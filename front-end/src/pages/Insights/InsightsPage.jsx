import React, { useMemo, useState } from 'react';
import { historyData } from './data/userHistory';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './InsightsPage.css';

const InsightsPage = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [swapList, setSwapList] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekData = useMemo(() => {
    const start = historyData.length - 7 - (weekOffset * 7);
    const end = start + 7;
    return historyData.slice(start, end);
  }, [weekOffset]);

  const weeklyTotal = useMemo(() => {
    return currentWeekData.reduce((total, day) => total + day.co2, 0);
  }, [currentWeekData]);

  const { topHabit, recommendation } = useMemo(() => {
    const impactScores = {};
    currentWeekData.forEach(entry => {
      if (!impactScores[entry.category]) impactScores[entry.category] = 0;
      impactScores[entry.category] += entry.co2;
    });

    let maxCO2 = 0;
    let worstCategory = "General";

    Object.entries(impactScores).forEach(([category, score]) => {
      if (score > maxCO2) {
        maxCO2 = score;
        worstCategory = category;
      }
    });

    const tips = {
      "Meat": { text: "Swap beef for lentils to save 2kg CO2.", item: "Lentils 🍲" },
      "Poultry": { text: "Choose local chicken to cut transport.", item: "Local Chicken 🍗" },
      "Dairy": { text: "Try oat milk in your coffee.", item: "Oat Milk 🥛" },
      "Veg": { text: "Keep eating seasonal veggies!", item: "Seasonal Veg Box 🥦" },
      "General": { text: "Track more meals!", item: "Reusable Container 🥡" }
    };

    return {
      topHabit: worstCategory,
      recommendation: tips[worstCategory] || tips["General"]
    };
  }, [currentWeekData]);

  const handleAddToList = () => {
    if (!swapList.includes(recommendation.item)) {
      setSwapList([...swapList, recommendation.item]);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setSwapList(swapList.filter(item => item !== itemToRemove));
  };

  const handlePrevWeek = () => {
    if (weekOffset < 3) setWeekOffset(weekOffset + 1);
  };

  const handleNextWeek = () => {
    if (weekOffset > 0) setWeekOffset(weekOffset - 1);
  };

  return (
    <div className="insights-container"> 
      
      <header className="page-header">
        <h1>Hello, Kibria 👋</h1>
        <p>Here's your personal sustainability breakdown.</p>
      </header>

      <div className="summary-header">
        <div className="summary-text">
          <h2>{weekOffset === 0 ? "This Week's" : "Weekly"} Carbon Footprint</h2>
          <span className="total-number">{weeklyTotal.toFixed(1)}kg</span>
        </div>
        <div className="summary-badge">
          <span>{weekOffset === 0 ? "↓ 15% better than last week" : "↓ 10% better than the week before"}</span>
        </div>
      </div>

      <div className="insights-grid">
        
        <section className="card calendar-card">
            <h2 className="calendar-title">Your Carbon Calendar</h2>
            <p className="instruction-text">Click a day to see details</p>
            
            <div className="calendar-container">
              <button 
                className="nav-arrow" 
                onClick={handlePrevWeek}
                disabled={weekOffset >= 3}
                style={{ opacity: weekOffset >= 3 ? 0 : 1 }}
              >
                <ChevronLeft size={24} />
              </button>

              <div className="calendar-row">
                {currentWeekData.map((day, index) => {
                  const statusClass = day.co2 > 3.0 ? 'high' : 'low';
                  const isSelected = selectedDay && selectedDay.id === day.id;

                  return (
                    <div 
                      key={index} 
                      onClick={() => setSelectedDay(day)} 
                      className={`day-box ${statusClass} ${isSelected ? 'selected' : ''}`}
                    >
                      <span className="day-name">{day.day}</span>
                      <span className="co2-value">{day.co2}kg</span>
                    </div>
                  );
                })}
              </div>

              <button 
                className="nav-arrow" 
                onClick={handleNextWeek}
                disabled={weekOffset === 0}
                style={{ opacity: weekOffset === 0 ? 0 : 1 }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </section>

          {selectedDay && (
            <section className="card detail-card">
              <div className="detail-header">
                <h3>{selectedDay.day}'s Meal Log</h3>
                <button className="close-btn" onClick={() => setSelectedDay(null)}>×</button>
              </div>
              <div className="detail-content">
                <div className="detail-item">
                  <span className="label">Meal:</span>
                  <span className="value">{selectedDay.meal}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="value badge">{selectedDay.category}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Impact:</span>
                  <span className="value">{selectedDay.co2} kg CO2</span>
                </div>
              </div>
            </section>
          )}

          <section className="card tip-card">
            <div className="tip-header">
              <span className="icon-badge">💡</span>
              <h3>Smart Recommendation</h3>
            </div>
            <div className="tip-body">
              <p className="habit-alert">Pattern Detected: High <strong>{topHabit}</strong> Consumption</p>
              <p className="tip-text">{recommendation.text}</p>
              
              <button className="action-btn" onClick={handleAddToList}>
                Add alternative to list
              </button>
              
            </div>
          </section>

          <section className="card seasonal-card">
            <h3>In Season: November 🍂</h3>
            <ul className="veg-list">
              <li>🍎 Apples <span className="tag">Low Transport</span></li>
              <li>🎃 Pumpkins <span className="tag">Local</span></li>
              <li>🥬 Kale <span className="tag">Nutrient-dense</span></li>
            </ul>
          </section>

          <section className="card list-card">
            <h3>My Eco-Swap List</h3>
            {swapList.length === 0 ? (
              <div className="empty-state">
                <p>Your list is empty.</p>
                <small>Add items from recommendations!</small>
              </div>
            ) : (
              <ul className="swap-list">
                {swapList.map((item, index) => (
                  <li key={index} className="swap-item">
                    {item}
                    <button 
                      className="remove-btn" 
                      onClick={() => handleRemoveItem(item)}
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

      </div>
    </div>
  );
};

export default InsightsPage;