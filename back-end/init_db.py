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

    # ============ FOOD DATA ============
    foods = [
        models.Food(name="Beef steak", category="Meat", is_veg=False, protein=26, co2_per_100g=27.0, rating="F", origin="Brazil", notes="Very high emissions due to methane and land use."),
        models.Food(name="Chicken breast", category="Meat", is_veg=False, protein=31, co2_per_100g=6.9, rating="D", origin="UK", notes="Lower footprint than beef but still higher than plant-based."),
        models.Food(name="Lentils (dry)", category="Legumes", is_veg=True, protein=25, co2_per_100g=0.9, rating="A", origin="Canada", notes="Low emissions and high in protein."),
        models.Food(name="Salmon fillet", category="Fish", is_veg=False, protein=20, co2_per_100g=4.6, rating="C", origin="Norway", notes="Moderate emissions; fishing method affects footprint."),
        models.Food(name="Tofu", category="Plant-based", is_veg=True, protein=8, co2_per_100g=1.6, rating="A", origin="China", notes="Very low emissions and good plant protein source."),
        models.Food(name="Cheddar cheese", category="Dairy", is_veg=False, protein=25, co2_per_100g=8.5, rating="E", origin="UK", notes="Dairy has high footprint due to methane."),
        models.Food(name="Eggs", category="Dairy", is_veg=False, protein=13, co2_per_100g=4.5, rating="C", origin="UK", notes="Moderate emissions, good protein source."),
        models.Food(name="Rice (white)", category="Grains", is_veg=True, protein=7, co2_per_100g=2.7, rating="B", origin="India", notes="Methane from paddy fields contributes to emissions."),
        models.Food(name="Chickpeas", category="Legumes", is_veg=True, protein=19, co2_per_100g=0.8, rating="A", origin="Turkey", notes="Excellent low-carbon protein source."),
        models.Food(name="Lamb chop", category="Meat", is_veg=False, protein=25, co2_per_100g=24.0, rating="F", origin="New Zealand", notes="High emissions similar to beef."),
        models.Food(name="Pork chop", category="Meat", is_veg=False, protein=27, co2_per_100g=7.2, rating="D", origin="Denmark", notes="Lower than beef but significant footprint."),
        models.Food(name="Milk (whole)", category="Dairy", is_veg=False, protein=3.4, co2_per_100g=1.9, rating="B", origin="UK", notes="Moderate emissions per serving."),
        models.Food(name="Almonds", category="Nuts", is_veg=True, protein=21, co2_per_100g=2.3, rating="B", origin="USA", notes="Water-intensive but low carbon."),
        models.Food(name="Broccoli", category="Vegetables", is_veg=True, protein=2.8, co2_per_100g=0.4, rating="A", origin="UK", notes="Very low emissions, nutrient dense."),
        models.Food(name="Potatoes", category="Vegetables", is_veg=True, protein=2, co2_per_100g=0.3, rating="A", origin="UK", notes="One of the lowest carbon foods."),
        models.Food(name="Banana", category="Fruits", is_veg=True, protein=1.1, co2_per_100g=0.7, rating="A", origin="Ecuador", notes="Low emissions despite transport."),
        models.Food(name="Avocado", category="Fruits", is_veg=True, protein=2, co2_per_100g=1.3, rating="B", origin="Mexico", notes="Water-intensive but moderate carbon."),
        models.Food(name="Pasta (dry)", category="Grains", is_veg=True, protein=13, co2_per_100g=1.2, rating="A", origin="Italy", notes="Low carbon staple food."),
        models.Food(name="Bread (white)", category="Grains", is_veg=True, protein=9, co2_per_100g=0.8, rating="A", origin="UK", notes="Low emissions, daily staple."),
        models.Food(name="Tuna (canned)", category="Fish", is_veg=False, protein=26, co2_per_100g=3.1, rating="B", origin="Thailand", notes="Lower than fresh fish, good protein."),
    ]
    db.add_all(foods)

    db.commit()
    print("Database initialized successfully.")

db.close()
