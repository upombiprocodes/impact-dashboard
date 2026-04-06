// Use environment variable or fallback to local backend
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8080/api';

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
