// Use environment variable or fallback to local backend
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080/api';

// Insights endpoints (served from main backend on port 8080)
const INSIGHTS_API_URL = process.env.REACT_APP_INSIGHTS_API_URL || 'http://127.0.0.1:8080/api/insights';

// Food Search endpoints (Algen's backend on port 8081)
const FOOD_API_URL = process.env.REACT_APP_FOOD_API_URL || 'http://127.0.0.1:8081/api';

export const fetchDashboardSummary = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard/summary`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        throw error;
    }
};

export const fetchDashboardChart = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard/chart`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching dashboard chart:', error);
        throw error;
    }
};

export const fetchBadges = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard/badges`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching badges:', error);
        throw error;
    }
};

export const fetchMonthlyGoal = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard/goal`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching monthly goal:', error);
        throw error;
    }
};

export const fetchDashboardDetails = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard/details`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching dashboard details:', error);
        throw error;
    }
};

export const fetchChallenges = async () => {
    try {
        const response = await fetch(`${API_URL}/challenges`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching challenges:', error);
        return [];
    }
};

export const fetchDailyChallenge = async () => {
    try {
        const response = await fetch(`${API_URL}/challenges/daily`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching daily challenge:', error);
        return null;
    }
};

// ============ Insights Endpoints (Spring Boot backend on port 8085) ============

export const fetchInsightsTotals = async (userId = 1) => {
    try {
        const response = await fetch(`${INSIGHTS_API_URL}/totals/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch insights totals');
        return await response.json();
    } catch (error) {
        console.error('Error fetching insights totals:', error);
        throw error;
    }
};

export const fetchCarbonJourneyWeekly = async (userId = 1, weeks = 4) => {
    try {
        const response = await fetch(`${INSIGHTS_API_URL}/carbon-journey/${userId}?weeks=${weeks}&breakdown=weekly`);
        if (!response.ok) throw new Error('Failed to fetch weekly carbon journey');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weekly carbon journey:', error);
        throw error;
    }
};

export const fetchCarbonJourneyDaily = async (userId = 1, weeks = 4) => {
    try {
        const response = await fetch(`${INSIGHTS_API_URL}/carbon-journey/${userId}?weeks=${weeks}&breakdown=daily`);
        if (!response.ok) throw new Error('Failed to fetch daily carbon journey');
        return await response.json();
    } catch (error) {
        console.error('Error fetching daily carbon journey:', error);
        throw error;
    }
};

export const fetchInsightsHistory = async (userId = 1) => {
    try {
        const response = await fetch(`${INSIGHTS_API_URL}/history/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch insights history');
        return await response.json();
    } catch (error) {
        console.error('Error fetching insights history:', error);
        throw error;
    }
};
