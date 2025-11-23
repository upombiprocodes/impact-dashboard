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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
