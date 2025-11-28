from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if data exists
if db.query(models.DashboardSummary).first():
    print("Database already initialized.")
else:
    print("Initializing database...")
    
    # Summary
    summary = models.DashboardSummary(
        co2Emitted=25,
        co2Saved=32,
        streak=47,
        badgesUnlocked=4,
        totalBadges=6,
        percentChange=-6.5
    )
    db.add(summary)

    # Weekly Data
    weekly_data = [
        models.WeeklyData(week="W1", footprint=48, saved=10, baseline=57),
        models.WeeklyData(week="W2", footprint=46, saved=12, baseline=57),
        models.WeeklyData(week="W3", footprint=45, saved=12, baseline=57),
        models.WeeklyData(week="W4", footprint=42, saved=15, baseline=57),
        models.WeeklyData(week="W5", footprint=38, saved=19, baseline=57),
        models.WeeklyData(week="W6", footprint=41, saved=16, baseline=57),
        models.WeeklyData(week="W7", footprint=35, saved=22, baseline=57),
        models.WeeklyData(week="W8", footprint=33, saved=24, baseline=57),
        models.WeeklyData(week="W9", footprint=31, saved=26, baseline=57),
        models.WeeklyData(week="W10", footprint=29, saved=28, baseline=57),
        models.WeeklyData(week="W11", footprint=27, saved=30, baseline=57),
        models.WeeklyData(week="W12", footprint=25, saved=32, baseline=57),
    ]
    db.add_all(weekly_data)

    # Badges
    badges = [
        models.Badge(name="First Week", icon="🌱", unlocked=True, description="Logged your first week"),
        models.Badge(name="Beef-Free", icon="🥗", unlocked=True, description="7 days without beef"),
        models.Badge(name="Hot Streak", icon="🔥", unlocked=True, description="30-day logging streak"),
        models.Badge(name="Carbon Crusher", icon="💪", unlocked=True, description="Saved 100kg CO₂"),
        models.Badge(name="Plant Pioneer", icon="🌿", unlocked=False, description="Save 200kg CO₂"),
        models.Badge(name="Climate Champ", icon="🏆", unlocked=False, description="90-day streak"),
    ]
    db.add_all(badges)

    # Goal
    goal = models.MonthlyGoal(target=100, current=94, daysLeft=9)
    db.add(goal)

    # Expansion Data
    emitted = [
        models.EmittedData(d="M", v=4), models.EmittedData(d="T", v=3), models.EmittedData(d="W", v=5), 
        models.EmittedData(d="T", v=3), models.EmittedData(d="F", v=4), models.EmittedData(d="S", v=2), models.EmittedData(d="S", v=2)
    ]
    db.add_all(emitted)

    saved = [
        models.SavedItem(n="Bike", v="4kg"), models.SavedItem(n="Veg", v="2kg"), models.SavedItem(n="Cold", v="1kg")
    ]
    db.add_all(saved)

    # Streak (simplified logic for seeding)
    streak_days = []
    for i in range(28):
        streak_days.append(models.StreakDay(day_index=i, completed=(i <= 20)))
    db.add_all(streak_days)

    contributions = [
        models.Contribution(d="Today", v="+2.5kg"), models.Contribution(d="Yesterday", v="+4.1kg"), models.Contribution(d="Nov 18", v="+3.2kg")
    ]
    db.add_all(contributions)

    impact = [
        models.ImpactDetail(label="Water", value="420L"), models.ImpactDetail(label="Land", value="12m²")
    ]
    db.add_all(impact)

    db.commit()
    print("Database initialized successfully.")

db.close()
