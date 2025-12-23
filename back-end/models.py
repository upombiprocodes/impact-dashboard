from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship
from database import Base

class WeeklyData(Base):
    __tablename__ = "weekly_data"

    id = Column(Integer, primary_key=True, index=True)
    week = Column(String, index=True)
    footprint = Column(Integer)
    saved = Column(Integer)
    baseline = Column(Integer)

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    icon = Column(String)
    unlocked = Column(Boolean, default=False)
    description = Column(String)

class MonthlyGoal(Base):
    __tablename__ = "monthly_goals"

    id = Column(Integer, primary_key=True, index=True)
    target = Column(Integer)
    current = Column(Integer)
    daysLeft = Column(Integer)

class DashboardSummary(Base):
    __tablename__ = "dashboard_summary"

    id = Column(Integer, primary_key=True, index=True)
    co2Emitted = Column(Float)
    co2Saved = Column(Float)
    streak = Column(Integer)
    badgesUnlocked = Column(Integer)
    totalBadges = Column(Integer)
    percentChange = Column(Float)

# Expansion Data Models
class EmittedData(Base):
    __tablename__ = "emitted_data"
    id = Column(Integer, primary_key=True, index=True)
    d = Column(String)
    v = Column(Integer)

class SavedItem(Base):
    __tablename__ = "saved_items"
    id = Column(Integer, primary_key=True, index=True)
    n = Column(String)
    v = Column(String)

class StreakDay(Base):
    __tablename__ = "streak_days"
    id = Column(Integer, primary_key=True, index=True)
    day_index = Column(Integer) # 0-27
    completed = Column(Boolean)

class Contribution(Base):
    __tablename__ = "contributions"
    id = Column(Integer, primary_key=True, index=True)
    d = Column(String)
    v = Column(String)

class ImpactDetail(Base):
    __tablename__ = "impact_details"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String)
    value = Column(String)

# Food Database
class Food(Base):
    __tablename__ = "foods"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    is_veg = Column(Boolean, default=False)
    protein = Column(Float)
    co2_per_100g = Column(Float)
    rating = Column(String)  # A, B, C, D, E, F
    origin = Column(String)
    notes = Column(String)

# Activity/Food Logging
class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("foods.id"))
    quantity_grams = Column(Float)
    co2_impact = Column(Float)
    logged_at = Column(String)  # ISO date string
