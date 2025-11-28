# Impact Dashboard - Personal Carbon Footprint Tracker

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌍 About The Project

**Impact Dashboard** is a comprehensive, full-stack application designed to empower individuals to track, visualize, and reduce their carbon footprint. 

In an era where environmental consciousness is paramount, this tool bridges the gap between intention and action. By providing real-time data visualization, gamified eco-challenges, and actionable insights, the Impact Dashboard transforms the abstract concept of "carbon footprint" into tangible, manageable metrics.

I built this project to demonstrate how modern web technologies can be leveraged to solve real-world problems, focusing on a seamless user experience and robust data architecture.

### ✨ Key Features

*   **Real-time Carbon Tracking**: Interactive charts and graphs powered by Recharts to visualize weekly and monthly carbon emission trends.
*   **Gamification Engine**: A custom-built badge and achievement system to motivate sustained eco-friendly behaviors.
*   **Data Persistence**: Reliable data storage using SQLite, ensuring user progress and history are securely saved.
*   **Responsive Design**: A fully responsive, dark-mode optimized interface built with modern CSS practices.
*   **RESTful API**: A high-performance backend API built with FastAPI to serve data efficiently to the frontend.

## 🛠️ Tech Stack

This project utilizes a modern, type-safe, and efficient technology stack:

### Frontend
*   **React**: For building a dynamic and component-based user interface.
*   **Recharts**: For rendering complex, responsive data visualizations.
*   **CSS Modules / Vanilla CSS**: For modular, maintainable, and performant styling.

### Backend
*   **Python 3.9+**: The core programming language for the server-side logic.
*   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python.
*   **SQLAlchemy**: The Python SQL toolkit and Object Relational Mapper (ORM) for database interactions.
*   **SQLite**: A lightweight, disk-based database for local data persistence.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

Ensure you have the following installed on your system:
*   **Node.js** (v14 or higher)
*   **Python** (v3.8 or higher)
*   **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/upombiprocodes/impact-dashboard.git
    cd impact-dashboard
    ```

2.  **Backend Setup**
    Navigate to the backend directory and set up the Python environment.
    ```bash
    # Create a virtual environment (optional but recommended)
    python -m venv venv
    
    # Activate the virtual environment
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate

    # Install dependencies
    pip install -r backend/requirements.txt
    ```

3.  **Initialize the Database**
    ```bash
    # Run the initialization script to create the database and seed initial data
    python backend/init_db.py
    ```

4.  **Frontend Setup**
    Install the Node.js dependencies.
    ```bash
    npm install
    ```

### 🏃‍♂️ Running the Application

You will need to run the backend and frontend in separate terminal windows.

**Terminal 1: Backend**
```bash
# Make sure your virtual environment is activated
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2: Frontend**
```bash
npm start
```

The application will launch automatically in your browser at `http://localhost:3000`.

## 🔮 Future Improvements

*   **User Authentication**: Implementing secure login/signup functionality.
*   **AI Recommendations**: Integrating machine learning to suggest personalized carbon-reduction tips based on user habits.
*   **Social Sharing**: Allowing users to share their achievements and streaks on social media.

## 👤 Author

**Upom Bipro**

*   GitHub: [@upombiprocodes](https://github.com/upombiprocodes)

---
*Built with passion for code and the planet.* 🌿
