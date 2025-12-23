// Use deployed backend URL directly for production
const API_URL = 'https://impact-dashboard-2eau.onrender.com/api';

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
