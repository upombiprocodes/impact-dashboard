from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import models
from database import SessionLocal, engine
import hashlib
import secrets
import json

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Simple token storage (in production, use Redis or JWT)
active_tokens = {}

security = HTTPBearer(auto_error=False)

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

# ============ AUTHENTICATION HELPERS ============

def hash_password(password: str) -> str:
    """Simple password hashing"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

def create_token() -> str:
    """Create a simple token"""
    return secrets.token_urlsafe(32)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current user from token"""
    if not credentials:
        return None
    token = credentials.credentials
    if token not in active_tokens:
        return None
    user_id = active_tokens[token]
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return user

def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Require authentication"""
    user = get_current_user(credentials, db)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ============ AUTH PYDANTIC MODELS ============

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str  # Can be username or email
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    display_name: str
    is_demo: bool
    created_at: datetime
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

# ============ AUTH ENDPOINTS ============

@app.post("/api/auth/register", response_model=AuthResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if email exists
    if db.query(models.User).filter(models.User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username exists
    if db.query(models.User).filter(models.User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create user
    user = models.User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
        display_name=user_data.display_name or user_data.username,
        is_demo=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Initialize user data with empty weeks
    init_user_data(db, user.id)
    
    # Create token
    token = create_token()
    active_tokens[token] = user.id
    
    return {"token": token, "user": user}

@app.post("/api/auth/login", response_model=AuthResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    # Find by username or email
    user = db.query(models.User).filter(
        (models.User.username == credentials.username) | 
        (models.User.email == credentials.username)
    ).first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_token()
    active_tokens[token] = user.id
    
    return {"token": token, "user": user}

@app.post("/api/auth/demo-login", response_model=AuthResponse)
def demo_login(db: Session = Depends(get_db)):
    """Login as demo user (Alex)"""
    # Find or create demo user
    demo_user = db.query(models.User).filter(models.User.username == "alex_demo").first()
    
    if not demo_user:
        demo_user = models.User(
            email="alex@demo.com",
            username="alex_demo",
            hashed_password=hash_password("demo123"),
            display_name="Alex",
            is_demo=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        # Initialize with sample data
        init_demo_user_data(db, demo_user.id)
    
    # Create token
    token = create_token()
    active_tokens[token] = demo_user.id
    
    return {"token": token, "user": demo_user}

@app.post("/api/auth/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout user"""
    if credentials and credentials.credentials in active_tokens:
        del active_tokens[credentials.credentials]
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(user: models.User = Depends(require_auth)):
    """Get current user info"""
    return user

def init_user_data(db: Session, user_id: int):
    """Initialize empty user data for new users"""
    # Create empty weekly data for last 12 weeks
    from datetime import datetime, timedelta
    for i in range(12):
        week_date = datetime.now() - timedelta(weeks=11-i)
        week_str = f"W{i+1}"
        user_week = models.UserWeeklyData(
            user_id=user_id,
            week=week_str,
            footprint=0,
            saved=0,
            baseline=35
        )
        db.add(user_week)
    
    # Create empty badges
    badge_names = ["First Week", "Beef-Free", "Carbon Crusher", "Hot Streak", "Plant Pioneer", "Climate Champ"]
    for badge in badge_names:
        user_badge = models.UserBadge(
            user_id=user_id,
            badge_name=badge,
            unlocked=False
        )
        db.add(user_badge)
    
    db.commit()

def init_demo_user_data(db: Session, user_id: int):
    """Initialize demo user with sample data (Alex's data)"""
    # Sample weekly data for Alex (the demo data)
    weekly_data = [
        ("W1", 32, 22), ("W2", 29, 28), ("W3", 35, 18), ("W4", 28, 30),
        ("W5", 31, 25), ("W6", 25, 32), ("W7", 30, 27), ("W8", 24, 35),
        ("W9", 26, 29), ("W10", 22, 38), ("W11", 20, 41), ("W12", 18, 45)
    ]
    
    for week, footprint, saved in weekly_data:
        user_week = models.UserWeeklyData(
            user_id=user_id,
            week=week,
            footprint=footprint,
            saved=saved,
            baseline=35
        )
        db.add(user_week)
    
    # Badges for Alex
    badges = [
        ("First Week", True), ("Beef-Free", True), ("Carbon Crusher", True),
        ("Hot Streak", True), ("Plant Pioneer", True), ("Climate Champ", False)
    ]
    for badge_name, unlocked in badges:
        user_badge = models.UserBadge(
            user_id=user_id,
            badge_name=badge_name,
            unlocked=unlocked,
            unlocked_at=datetime.utcnow() if unlocked else None
        )
        db.add(user_badge)
    
    # Add some completed challenges
    for i in range(15):
        completion = models.ChallengeCompletion(
            user_id=user_id,
            challenge_id=(i % 50) + 1,
            completed_at=datetime.utcnow() - timedelta(days=i),
            co2_saved=float(i + 1) * 0.5
        )
        db.add(completion)
    
    db.commit()

# ============ USER-SPECIFIC DASHBOARD ENDPOINTS ============

@app.get("/api/user/dashboard/summary")
def get_user_summary(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard summary for current user or default"""
    if user:
        # Get user-specific data
        weekly_data = db.query(models.UserWeeklyData).filter(
            models.UserWeeklyData.user_id == user.id
        ).all()
        
        total_saved = sum(w.saved for w in weekly_data)
        recent_saved = sum(w.saved for w in weekly_data[-4:]) if weekly_data else 0
        
        badges = db.query(models.UserBadge).filter(
            models.UserBadge.user_id == user.id
        ).all()
        unlocked = sum(1 for b in badges if b.unlocked)
        
        # Calculate streak (consecutive days with challenges)
        completions = db.query(models.ChallengeCompletion).filter(
            models.ChallengeCompletion.user_id == user.id
        ).order_by(models.ChallengeCompletion.completed_at.desc()).all()
        
        streak = 0
        if completions:
            today = datetime.utcnow().date()
            for i, c in enumerate(completions):
                if (today - c.completed_at.date()).days <= i + 1:
                    streak += 1
                else:
                    break
        
        return {
            "co2Emitted": sum(w.footprint for w in weekly_data[-4:]) if weekly_data else 0,
            "co2Saved": recent_saved,
            "streak": streak,
            "badgesUnlocked": unlocked,
            "totalBadges": len(badges),
            "percentChange": -12.5 if total_saved > 0 else 0
        }
    
    # Fallback to default summary
    summary = db.query(models.DashboardSummary).first()
    if not summary:
        return {"co2Emitted": 0, "co2Saved": 0, "streak": 0, "badgesUnlocked": 0, "totalBadges": 6, "percentChange": 0}
    return summary

@app.get("/api/user/dashboard/chart")
def get_user_chart(
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chart data for current user"""
    if user:
        weekly_data = db.query(models.UserWeeklyData).filter(
            models.UserWeeklyData.user_id == user.id
        ).order_by(models.UserWeeklyData.id).all()
        
        return [{"week": w.week, "footprint": w.footprint, "saved": w.saved, "baseline": w.baseline} for w in weekly_data]
    
    # Fallback to default chart
    return db.query(models.WeeklyData).all()

@app.post("/api/user/challenges/{challenge_id}/complete")
def complete_challenge(
    challenge_id: int,
    co2_saved: float,
    user: models.User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Mark a challenge as completed"""
    # Check if already completed today
    today = datetime.utcnow().date()
    existing = db.query(models.ChallengeCompletion).filter(
        models.ChallengeCompletion.user_id == user.id,
        models.ChallengeCompletion.challenge_id == challenge_id
    ).all()
    
    today_completion = [c for c in existing if c.completed_at.date() == today]
    if today_completion:
        raise HTTPException(status_code=400, detail="Challenge already completed today")
    
    # Create completion
    completion = models.ChallengeCompletion(
        user_id=user.id,
        challenge_id=challenge_id,
        co2_saved=co2_saved
    )
    db.add(completion)
    
    # Update user's weekly data
    current_week = db.query(models.UserWeeklyData).filter(
        models.UserWeeklyData.user_id == user.id
    ).order_by(models.UserWeeklyData.id.desc()).first()
    
    if current_week:
        current_week.saved += int(co2_saved)
    
    db.commit()
    
    return {"message": "Challenge completed!", "co2_saved": co2_saved}

@app.get("/api/user/challenges/history")
def get_challenge_history(
    user: models.User = Depends(require_auth),
    db: Session = Depends(get_db)
):
    """Get user's challenge completion history"""
    completions = db.query(models.ChallengeCompletion).filter(
        models.ChallengeCompletion.user_id == user.id
    ).order_by(models.ChallengeCompletion.completed_at.desc()).limit(50).all()
    
    return [
        {
            "id": c.id,
            "challenge_id": c.challenge_id,
            "co2_saved": c.co2_saved,
            "completed_at": c.completed_at.isoformat()
        }
        for c in completions
    ]

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
