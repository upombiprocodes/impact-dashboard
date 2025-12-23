import React from 'react';
import { historyData } from '../data/userHistory';
import './InsightsPage.css';

const InsightsPage = () => {
    const topHabit = "Red Meat";
    const tipText = "Swap your Tuesday beef burger for a plant-based one to save 2kg CO2.";

    return (
        <div className="insights-container">
            <header className="page-header">
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111827' }}>Hello, Kibria 👋</h1>
                <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Here's your personal sustainability breakdown.</p>
            </header>

            <div className="insights-grid">

                <section className="card calendar-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your Carbon Calendar</h2>
                    <div className="calendar-row">
                        {historyData.slice(0, 7).map((day, index) => (
                            <div key={index} className={`day-box ${day.co2 > 5 ? 'high' : 'low'}`}>
                                <span className="day-name">{day.day}</span>
                                <span className="co2-value">{day.co2}kg</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="card tip-card">
                    <div className="tip-header">
                        <span className="icon-badge">💡</span>
                        <h3>Smart Recommendation</h3>
                    </div>
                    <div className="tip-body">
                        <p className="habit-alert">Pattern Detected: High <strong>{topHabit}</strong> Consumption</p>
                        <p className="tip-text">{tipText}</p>
                        <button className="action-btn">Add Alternative to List</button>
                    </div>
                </section>

                <section className="card seasonal-card">
                    <h3>In Season: November 🍂</h3>
                    <ul className="veg-list">
                        <li>🍎 Apples <span className="tag">Low Transport</span></li>
                        <li>🎃 Pumpkins <span className="tag">Local</span></li>
                        <li>🥬 Kale <span className="tag"> nutrient-dense</span></li>
                    </ul>
                </section>

            </div>
        </div>
    );
};

export default InsightsPage;
