import React, { useState } from "react";
import "./MealBuilderPage.css";

const FOOD_DB = [
  { id: "beef", name: "Beef", co2Per100g: 5.0 },
  { id: "chicken", name: "Chicken", co2Per100g: 1.8 },
  { id: "lamb", name: "Lamb", co2Per100g: 6.0 },
  { id: "fish", name: "Fish", co2Per100g: 2.0 },
];

function calculateMealFootprint(mealItems) {
  let total = 0;
  for (const item of mealItems) {
    const portionKg = item.quantity / 100;
    total += item.co2Per100g * portionKg;
  }
  return total;
}

export default function MealBuilderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mealItems, setMealItems] = useState([]);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  let matchedFood = null;
  if (trimmedQuery.length >= 2) {
    const matches = FOOD_DB.filter((food) =>
      food.name.toLowerCase().includes(trimmedQuery)
    );
    if (matches.length > 0) {
      matchedFood = matches[0];
    }
  }

  const totalFootprint = calculateMealFootprint(mealItems);

  function handleAddToMeal(food) {
    const amount = 100;
    setMealItems((current) => {
      const existing = current.find((item) => item.id === food.id);
      if (existing) {
        return current;
      }
      return [
        ...current,
        {
          id: food.id,
          name: food.name,
          co2Per100g: food.co2Per100g,
          quantity: amount,
        },
      ];
    });
  }

  function handleRemoveItem(id) {
    setMealItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="meal-page">
      <header className="meal-header">
        <div className="brand">
          <div className="brand-title">
            Food<span>Print</span>
          </div>
        </div>
      </header>

      <div className="meal-layout">
        <div className="top-row">
          <section className="panel">
            <h2>Add foods to your meal</h2>
            <p className="panel-sub">
              Search for a food and add it to the meal.
            </p>

            <div className="field-row">
              <label htmlFor="search-input">Search food</label>
              <input
                id="search-input"
                type="text"
                placeholder="beef, chicken, lamb, fish"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="field-hint">
                Type at least 2 letters to search.
              </span>
            </div>

            <div className="list-header">Result</div>
            <div className="result-list">
              {trimmedQuery.length < 2 && (
                <div className="empty-state">
                  Start typing to search for a food.
                </div>
              )}

              {trimmedQuery.length >= 2 && !matchedFood && (
                <div className="empty-state">No food found.</div>
              )}

              {matchedFood && (
                <div className="result-row">
                  <div className="result-main">
                    <div className="result-name">{matchedFood.name}</div>
                    <div className="result-meta">
                      {matchedFood.co2Per100g.toFixed(1)} kg CO₂e / 100 g
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => handleAddToMeal(matchedFood)}
                  >
                    Add 100g
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="panel">
            <h2>Smarter swaps</h2>
            <p className="panel-sub">
              This is a future feature. The idea is to suggest lower-impact
              alternatives for each food.
            </p>

            <div className="empty-state">
              In the current version this box is only a placeholder. It shows my
              plan for the next iteration but it does not run any calculations
              yet.
            </div>
          </section>
        </div>

        <section className="panel panel-bottom">
          <h2>Your meal summary</h2>
          <p className="panel-sub">
            Each item here is fixed at 100g. The total updates when you add or
            remove foods.
          </p>

          {mealItems.length === 0 && (
            <div className="empty-state">No foods in the meal yet.</div>
          )}

          {mealItems.length > 0 && (
            <>
              <table className="meal-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity (g)</th>
                    <th>kg CO₂e / 100 g</th>
                    <th>Portion CO₂e (kg)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {mealItems.map((item) => {
                    const portionTotal =
                      item.co2Per100g * (item.quantity / 100);
                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>100</td>
                        <td>{item.co2Per100g.toFixed(1)}</td>
                        <td>{portionTotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-small btn-danger"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="total-row">
                <div className="total-label">Total meal footprint</div>
                <div className="total-values">
                  <div className="total-main">
                    {totalFootprint.toFixed(2)} kg CO₂e
                  </div>
                  <div className="total-sub">
                    {mealItems.length}{" "}
                    {mealItems.length === 1 ? "item" : "items"}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

