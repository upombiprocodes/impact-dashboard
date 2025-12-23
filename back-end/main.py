from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import models
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://impact-dashboard-mfpd.vercel.app",
    "https://impact-dashboard-s6jh.vercel.app",
    "https://impact-dashboard.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models (Response Models)
class WeeklyData(BaseModel):
    week: str
    footprint: int
    saved: int
    baseline: int
    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    co2Emitted: float
    co2Saved: float
    streak: int
    badgesUnlocked: int
    totalBadges: int
    percentChange: float
    class Config:
        from_attributes = True

class Badge(BaseModel):
    id: int
    name: str
    icon: str
    unlocked: bool
    description: str
    class Config:
        from_attributes = True

class MonthlyGoal(BaseModel):
    target: int
    current: int
    daysLeft: int
    class Config:
        from_attributes = True

class EmittedData(BaseModel):
    d: str
    v: int
    class Config:
        from_attributes = True

class SavedItem(BaseModel):
    n: str
    v: str
    class Config:
        from_attributes = True

class Contribution(BaseModel):
    d: str
    v: str
    class Config:
        from_attributes = True

class ImpactDetail(BaseModel):
    label: str
    value: str
    class Config:
        from_attributes = True

class DashboardDetails(BaseModel):
    emitted: List[EmittedData]
    saved: List[SavedItem]
    streak: List[bool]
    contributions: List[Contribution]
    impact: List[ImpactDetail]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Impact Dashboard Backend is running"}

# One-time fix endpoint to update Plant Pioneer badge
@app.get("/api/fix-badges")
def fix_badges(db: Session = Depends(get_db)):
    # Update Plant Pioneer to unlocked (user has 226kg saved > 200kg requirement)
    plant_pioneer = db.query(models.Badge).filter(models.Badge.name == "Plant Pioneer").first()
    if plant_pioneer:
        plant_pioneer.unlocked = True
        db.commit()
    
    # Update summary to show 5 badges unlocked
    summary = db.query(models.DashboardSummary).first()
    if summary:
        summary.badgesUnlocked = 5
        db.commit()
    
    return {"status": "fixed", "message": "Plant Pioneer badge unlocked, summary updated to 5 badges"}

@app.get("/api/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    summary = db.query(models.DashboardSummary).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    return summary

@app.get("/api/dashboard/chart", response_model=List[WeeklyData])
def get_dashboard_chart(db: Session = Depends(get_db)):
    return db.query(models.WeeklyData).all()

@app.get("/api/dashboard/badges", response_model=List[Badge])
def get_badges(db: Session = Depends(get_db)):
    return db.query(models.Badge).all()

@app.get("/api/dashboard/goal", response_model=MonthlyGoal)
def get_monthly_goal(db: Session = Depends(get_db)):
    goal = db.query(models.MonthlyGoal).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal

@app.get("/api/dashboard/details", response_model=DashboardDetails)
def get_dashboard_details(db: Session = Depends(get_db)):
    emitted = db.query(models.EmittedData).all()
    saved = db.query(models.SavedItem).all()
    streak_days = db.query(models.StreakDay).order_by(models.StreakDay.day_index).all()
    contributions = db.query(models.Contribution).all()
    impact = db.query(models.ImpactDetail).all()
    
    return {
        "emitted": emitted,
        "saved": saved,
        "streak": [day.completed for day in streak_days],
        "contributions": contributions,
        "impact": impact
    }

# ============ FOOD API ============

class FoodResponse(BaseModel):
    id: int
    name: str
    category: str
    is_veg: bool
    protein: float
    co2_per_100g: float
    rating: str
    origin: str
    notes: str
    class Config:
        from_attributes = True

class LogFoodRequest(BaseModel):
    food_id: int
    quantity_grams: float

class LogFoodResponse(BaseModel):
    id: int
    food_name: str
    quantity_grams: float
    co2_impact: float
    logged_at: str

@app.get("/api/foods", response_model=List[FoodResponse])
def get_foods(
    category: Optional[str] = None,
    is_veg: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all foods with optional filters"""
    query = db.query(models.Food)
    
    if category and category != "all":
        query = query.filter(models.Food.category == category)
    if is_veg is not None:
        query = query.filter(models.Food.is_veg == is_veg)
    if search:
        query = query.filter(models.Food.name.ilike(f"%{search}%"))
    
    return query.all()

@app.get("/api/foods/categories")
def get_food_categories(db: Session = Depends(get_db)):
    """Get unique food categories"""
    categories = db.query(models.Food.category).distinct().all()
    return ["all"] + [c[0] for c in categories]

@app.get("/api/foods/{food_id}", response_model=FoodResponse)
def get_food(food_id: int, db: Session = Depends(get_db)):
    """Get a specific food by ID"""
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food

@app.post("/api/log-food", response_model=LogFoodResponse)
def log_food(request: LogFoodRequest, db: Session = Depends(get_db)):
    """Log food consumption and calculate CO2 impact"""
    from datetime import datetime
    
    food = db.query(models.Food).filter(models.Food.id == request.food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    # Calculate CO2 impact (per 100g scaled to quantity)
    co2_impact = (food.co2_per_100g * request.quantity_grams) / 100
    
    # Create log entry
    log_entry = models.ActivityLog(
        food_id=request.food_id,
        quantity_grams=request.quantity_grams,
        co2_impact=round(co2_impact, 2),
        logged_at=datetime.now().isoformat()
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    
    return {
        "id": log_entry.id,
        "food_name": food.name,
        "quantity_grams": request.quantity_grams,
        "co2_impact": round(co2_impact, 2),
        "logged_at": log_entry.logged_at
    }

@app.get("/api/activity-logs")
def get_activity_logs(limit: int = 10, db: Session = Depends(get_db)):
    """Get recent activity logs"""
    logs = db.query(models.ActivityLog).order_by(models.ActivityLog.id.desc()).limit(limit).all()
    result = []
    for log in logs:
        food = db.query(models.Food).filter(models.Food.id == log.food_id).first()
        result.append({
            "id": log.id,
            "food_name": food.name if food else "Unknown",
            "quantity_grams": log.quantity_grams,
            "co2_impact": log.co2_impact,
            "logged_at": log.logged_at
        })
    return result
