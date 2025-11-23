from database import SessionLocal, engine
import models

db = SessionLocal()

print("Checking database content...")
print(f"DashboardSummary: {db.query(models.DashboardSummary).count()}")
print(f"WeeklyData: {db.query(models.WeeklyData).count()}")
print(f"Badge: {db.query(models.Badge).count()}")
print(f"MonthlyGoal: {db.query(models.MonthlyGoal).count()}")
print(f"EmittedData: {db.query(models.EmittedData).count()}")
print(f"SavedItem: {db.query(models.SavedItem).count()}")
print(f"StreakDay: {db.query(models.StreakDay).count()}")
print(f"Contribution: {db.query(models.Contribution).count()}")
print(f"ImpactDetail: {db.query(models.ImpactDetail).count()}")

db.close()
