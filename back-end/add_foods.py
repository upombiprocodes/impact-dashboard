"""Add food data to existing database"""
from database import SessionLocal, engine
import models

# Create new tables if they don't exist
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if foods already exist
if db.query(models.Food).first():
    print("Foods already exist in database.")
else:
    print("Adding food data...")
    
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
    print(f"Added {len(foods)} foods to database.")

db.close()
