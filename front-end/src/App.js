import React, { useState, useEffect, useMemo } from 'react';
import { fetchDashboardSummary, fetchDashboardChart, fetchBadges, fetchMonthlyGoal, fetchDashboardDetails } from './services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingDown, Award, Flame, Leaf, Calendar, LayoutDashboard, CheckCircle, Droplets, Mountain, ArrowRight, Star, Trophy, Zap, Target, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import { challenges, getDailyChallenge, getChallengesByCategory } from './data/challenges';

// Main App Component with Auth
const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <ImpactDashboard user={user} token={token} onLogout={handleLogout} />;
};

const ImpactDashboard = ({ user, token, onLogout }) => {
  const [timeRange, setTimeRange] = useState('8weeks');
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challengeAccepted, setChallengeAccepted] = useState(() => {
    const saved = localStorage.getItem(`challenge_${user?.id}_accepted`);
    const savedDate = localStorage.getItem(`challenge_${user?.id}_date`);
    const savedIndex = localStorage.getItem(`challenge_${user?.id}_index`);
    const today = new Date().toDateString();
    if (savedDate !== today) {
      localStorage.removeItem(`challenge_${user?.id}_accepted`);
      localStorage.removeItem(`challenge_${user?.id}_index`);
      return false;
    }
    if (savedIndex) setCurrentChallengeIndex(parseInt(savedIndex));
    return saved === 'true';
  });
  const [expandedBadge, setExpandedBadge] = useState(null);
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [challengeFilter, setChallengeFilter] = useState('all');

  // Get daily challenge or selected challenge
  const dailyChallenge = useMemo(() => getDailyChallenge(), []);
  const currentChallenge = showAllChallenges ? challenges[currentChallengeIndex] : dailyChallenge;

  const handleChallengeClick = async () => {
    const newState = !challengeAccepted;
    setChallengeAccepted(newState);
    localStorage.setItem(`challenge_${user?.id}_accepted`, newState.toString());
    localStorage.setItem(`challenge_${user?.id}_date`, new Date().toDateString());
    localStorage.setItem(`challenge_${user?.id}_index`, currentChallengeIndex.toString());

    // If completing challenge and logged in, notify backend
    if (newState && token) {
      try {
        await fetch(`https://impact-dashboard-2eau.onrender.com/api/user/challenges/${currentChallenge.id}/complete?co2_saved=${currentChallenge.co2Impact}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error('Failed to record challenge completion:', err);
      }
    }
  };

  const nextChallenge = () => {
    setChallengeAccepted(false);
    setCurrentChallengeIndex((prev) => (prev + 1) % challenges.length);
  };

  const prevChallenge = () => {
    setChallengeAccepted(false);
    setCurrentChallengeIndex((prev) => (prev - 1 + challenges.length) % challenges.length);
  };

  const filteredChallenges = useMemo(() => {
    return getChallengesByCategory(challengeFilter);
  }, [challengeFilter]);

  const [summaryData, setSummaryData] = useState({
    co2Emitted: 0,
    co2Saved: 0,
    streak: 0
  });
  const [chartData, setChartData] = useState([]);
  const [badgesConfig, setBadgesConfig] = useState([]);
  const [monthlyGoal, setMonthlyGoal] = useState({ target: 100, current: 0 });
  const [detailsData, setDetailsData] = useState({
    emitted: [],
    saved: [],
    streak: [],
    contributions: [],
    impact: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // If logged in, try to fetch user-specific data
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const [summary, chart, badgesData, goal, details] = await Promise.all([
          token 
            ? fetch('https://impact-dashboard-2eau.onrender.com/api/user/dashboard/summary', { headers }).then(r => r.json())
            : fetchDashboardSummary(),
          token
            ? fetch('https://impact-dashboard-2eau.onrender.com/api/user/dashboard/chart', { headers }).then(r => r.json())
            : fetchDashboardChart(),
          fetchBadges(),
          fetchMonthlyGoal(),
          fetchDashboardDetails()
        ]);
        
        setSummaryData(summary);
        setChartData(chart);
        setBadgesConfig(badgesData);
        setMonthlyGoal(goal);
        setDetailsData(details);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        setError(error.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ============ ALL DYNAMIC CALCULATIONS ============
  
  // Calculate total CO2 saved from chart data
  const totalSaved = useMemo(() => {
    return chartData.reduce((sum, week) => sum + (week.saved || 0), 0);
  }, [chartData]);

  // Calculate days left in current month
  const daysLeftInMonth = useMemo(() => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate();
  }, []);

  // Calculate Water & Land saved (environmental impact formulas)
  const environmentalImpact = useMemo(() => {
    // Average: 1kg CO2 saved ≈ 15L water saved, 0.5m² land saved
    return {
      water: Math.round(totalSaved * 15),
      land: Math.round(totalSaved * 0.5)
    };
  }, [totalSaved]);

  // Calculate trees equivalent (1 tree absorbs ~21kg CO2/year)
  const treesEquivalent = useMemo(() => {
    return Math.round(totalSaved / 21);
  }, [totalSaved]);

  // Dynamic badge calculation based on user progress
  const badges = useMemo(() => {
    const streak = summaryData.streak || 0;
    
    return [
      {
        id: 1,
        name: "First Week",
        icon: "🌱",
        description: "Logged your first week of tracking",
        unlocked: chartData.length >= 1,
        progress: chartData.length >= 1 ? 100 : (chartData.length / 1) * 100,
        target: "1 week"
      },
      {
        id: 2,
        name: "Beef-Free",
        icon: "🥗",
        description: "7 consecutive days without beef",
        unlocked: streak >= 7,
        progress: Math.min((streak / 7) * 100, 100),
        target: `${Math.min(streak, 7)}/7 days`
      },
      {
        id: 3,
        name: "Hot Streak",
        icon: "🔥",
        description: "Maintain a 30-day logging streak",
        unlocked: streak >= 30,
        progress: Math.min((streak / 30) * 100, 100),
        target: `${Math.min(streak, 30)}/30 days`
      },
      {
        id: 4,
        name: "Carbon Crusher",
        icon: "💪",
        description: "Save 100kg of CO₂ emissions",
        unlocked: totalSaved >= 100,
        progress: Math.min((totalSaved / 100) * 100, 100),
        target: `${Math.min(Math.round(totalSaved), 100)}/100kg`
      },
      {
        id: 5,
        name: "Plant Pioneer",
        icon: "🌿",
        description: "Save 200kg of CO₂ emissions",
        unlocked: totalSaved >= 200,
        progress: Math.min((totalSaved / 200) * 100, 100),
        target: `${Math.min(Math.round(totalSaved), 200)}/200kg`
      },
      {
        id: 6,
        name: "Climate Champ",
        icon: "🏆",
        description: "Maintain a 90-day streak",
        unlocked: streak >= 90,
        progress: Math.min((streak / 90) * 100, 100),
        target: `${Math.min(streak, 90)}/90 days`
      }
    ];
  }, [chartData, summaryData.streak, totalSaved]);

  // Calculate unlocked badge count dynamically
  const unlockedCount = useMemo(() => {
    return badges.filter(b => b.unlocked).length;
  }, [badges]);

  // Calculate monthly goal progress
  const monthlyProgress = useMemo(() => {
    // Use current month's saved CO2 (last 4 weeks approximation)
    const recentWeeks = chartData.slice(-4);
    const monthSaved = recentWeeks.reduce((sum, week) => sum + (week.saved || 0), 0);
    return {
      current: monthSaved,
      target: monthlyGoal.target || 100,
      percentage: Math.min((monthSaved / (monthlyGoal.target || 100)) * 100, 100)
    };
  }, [chartData, monthlyGoal.target]);

  // ============ END DYNAMIC CALCULATIONS ============

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>Error: {error}</div>;
  }

  const getFilteredData = () => {
    const weeks = parseInt(timeRange.replace('weeks', ''));
    return chartData.slice(Math.max(chartData.length - weeks, 0));
  };

  const weeklyData = getFilteredData();

  const currentWeek = {
    co2Emitted: summaryData.co2Emitted,
    co2Saved: summaryData.co2Saved,
    percentChange: summaryData.percentChange,
    streak: summaryData.streak
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      display: 'flex'
    },
    sidebarNav: {
      width: '80px',
      background: '#111827',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '32px',
      gap: '32px',
      zIndex: 50
    },
    navItem: {
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '12px',
      borderRadius: '12px',
      transition: 'all 0.2s',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    navItemActive: {
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.1)'
    },
    mainContent: {
      flex: 1,
      marginLeft: '80px',
      padding: '32px',
      maxWidth: '1400px'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1f2937',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px'
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #e5e7eb'
    },
    cardExpanded: {
      gridColumn: '1 / -1',
      minHeight: '300px'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    cardLabel: {
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px'
    },
    cardValue: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#1f2937',
      marginBottom: '4px'
    },
    unit: {
      fontSize: '16px',
      color: '#9ca3af',
      fontWeight: '500',
      marginLeft: '4px'
    },
    iconBox: {
      padding: '12px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardFooter: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#10b981',
      marginTop: 'auto'
    },
    cardIcon: {
      position: 'absolute',
      top: '24px',
      right: '24px',
      opacity: 0.2
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2.5fr 1fr',
      gap: '32px',
      marginBottom: '32px'
    },
    chartSection: {
      background: 'white',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1f2937'
    },
    select: {
      padding: '8px 16px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      background: 'white',
      fontSize: '13px',
      fontWeight: '600',
      color: '#4b5563',
      cursor: 'pointer',
      outline: 'none'
    },
    insightsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      marginTop: '32px'
    },
    insightCard: {
      padding: '20px',
      borderRadius: '16px',
      border: '1px solid',
      transition: 'transform 0.2s'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    rightCard: {
      background: 'white',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb'
    },
    progressBar: {
      height: '100%',
      background: '#10b981',
      borderRadius: '9999px',
      transition: 'width 1s ease-out'
    },
    expandedContent: {
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #f3f4f6',
      animation: 'fadeIn 0.4s ease-out'
    },
    challengeCard: {
      marginTop: '32px',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      borderRadius: '24px',
      padding: '32px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    challengeBtn: {
      marginTop: '24px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'transform 0.1s'
    },
    badgeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '12px',
      background: '#f9fafb',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    badgeExpanded: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0'
    }
  };

  const renderExpandedContent = (type) => {
    switch (type) {
      case 'emitted':
        return (
          <div style={styles.expandedContent}>
            <div style={{ height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detailsData.emitted}>
                  <Bar dataKey="v" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'saved':
        return (
          <div style={styles.expandedContent}>
            {detailsData.saved.map((i, k) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{i.n}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>{i.v}</span>
              </div>
            ))}
          </div>
        );
      case 'streak':
        return (
          <div style={styles.expandedContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d} style={{ fontSize: '10px', color: '#9ca3af' }}>{d}</span>)}
              {detailsData.streak.map((completed, i) => (
                <div key={i} style={{
                  aspectRatio: '1',
                  background: completed ? '#ef4444' : '#fecaca',
                  borderRadius: '4px',
                  opacity: completed ? 1 : 0.5,
                  fontSize: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>{completed ? '✓' : ''}</div>
              ))}
            </div>
          </div>
        );
      case 'badges':
        return (
          <div style={styles.expandedContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
              {badges.map(b => (
                <div key={b.id} style={{ textAlign: 'center', padding: '8px', background: b.unlocked ? '#f0fdf4' : '#f9fafb', borderRadius: '8px', opacity: b.unlocked ? 1 : 0.5 }}>
                  <div style={{ fontSize: '20px' }}>{b.icon}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'goal':
        return (
          <div style={styles.expandedContent}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', color: '#6b7280' }}>CONTRIBUTION HISTORY</h4>
            {detailsData.contributions.map((i, k) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#4b5563' }}>{i.d}</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>{i.v}</span>
              </div>
            ))}
          </div>
        );
      case 'impact':
        return (
          <div style={styles.expandedContent}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Water Saved</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{environmentalImpact.water.toLocaleString()}L</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Land Saved</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{environmentalImpact.land}m²</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Trees Equivalent</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>~{treesEquivalent} 🌳</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Total CO₂</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>{totalSaved}kg</div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderDashboard = () => (
    <>
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={styles.title}>Hello, {user?.display_name || 'User'}! <span style={{ fontSize: '24px' }}>👋</span></h1>
            <p style={styles.subtitle}>Here's your daily impact summary</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#f3f4f6', 
              padding: '8px 16px', 
              borderRadius: '12px' 
            }}>
              <User size={18} color="#6b7280" />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {user?.username}
                {user?.is_demo && <span style={{ marginLeft: '6px', background: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>DEMO</span>}
              </span>
            </div>
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards - Colored Backgrounds */}
      <div style={styles.summaryGrid}>
        {[
          { id: 'emitted', label: 'CO₂ Emitted', val: currentWeek.co2Emitted, unit: 'kg', icon: <TrendingDown size={32} />, color: '#c2410c', bg: '#ffedd5' }, // Orange-100 bg, Orange-700 text
          { id: 'saved', label: 'CO₂ Saved', val: currentWeek.co2Saved, unit: 'kg', icon: <Leaf size={32} />, color: '#15803d', bg: '#dcfce7' }, // Green-100 bg, Green-700 text
          { id: 'streak', label: 'Streak', val: currentWeek.streak, unit: 'days', icon: <Flame size={32} />, color: '#b91c1c', bg: '#fee2e2' }, // Red-100 bg, Red-700 text
          { id: 'badges', label: 'Badges', val: unlockedCount, unit: `/${badges.length}`, icon: <Award size={32} />, color: '#7e22ce', bg: '#f3e8ff' } // Purple-100 bg, Purple-700 text
        ].map(card => (
          <div
            key={card.id}
            style={{
              ...styles.card,
              background: card.bg,
              border: `1px solid ${card.color}20`, // Subtle border matching the color
              ...(expandedCard === card.id ? styles.cardExpanded : {})
            }}
            onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
          >
            <p style={{ ...styles.cardLabel, color: card.color }}>{card.label}</p>
            <h3 style={{ ...styles.cardValue, color: '#1f2937' }}>{card.val}<span style={{ ...styles.unit, color: '#4b5563' }}>{card.unit}</span></h3>
            <div style={{ ...styles.cardIcon, color: card.color, opacity: 0.2 }}>
              {card.icon}
            </div>
            {expandedCard === card.id && renderExpandedContent(card.id)}
          </div>
        ))}
      </div>

      <div style={styles.mainGrid}>
        {/* Left Column */}
        <div>
          <div style={styles.chartSection}>
            <div style={styles.chartHeader}>
              <h2 style={styles.sectionTitle}>Carbon Journey</h2>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={styles.select}>
                <option value="4weeks">Last 4 Weeks</option>
                <option value="8weeks">Last 8 Weeks</option>
                <option value="12weeks">Last 12 Weeks</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="footprint" stroke="#f97316" strokeWidth={3} fill="url(#colorFootprint)" name="Emitted" />
                <Area type="monotone" dataKey="saved" stroke="#10b981" strokeWidth={3} fill="url(#colorSaved)" name="Saved" />
              </AreaChart>
            </ResponsiveContainer>

            <div style={styles.insightsGrid}>
              {[
                { t: 'Trending Down', d: `${summaryData.percentChange || 0}% vs last month`, i: <TrendingDown size={20} />, c: '#10b981', b: '#f0fdf4' },
                { t: 'Best Week', d: `${Math.max(...chartData.map(w => w.saved || 0))}kg CO₂ saved`, i: <Star size={20} />, c: '#f59e0b', b: '#fffbeb' },
                { t: 'Total Saved', d: `${totalSaved}kg CO₂ Lifetime`, i: <Trophy size={20} />, c: '#8b5cf6', b: '#f5f3ff' }
              ].map((i, k) => (
                <div key={k} style={{ ...styles.insightCard, background: i.b, borderColor: i.b }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: i.c, fontWeight: '600', marginBottom: '8px' }}>
                    {i.i} <span>{i.t}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#4b5563' }}>{i.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Eco Challenge - Dynamic from 50 challenges */}
          <div style={styles.challengeCard}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Header with browse toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{currentChallenge.icon}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#fbbf24', letterSpacing: '0.05em' }}>
                      {showAllChallenges ? 'BROWSE CHALLENGES' : 'DAILY ECO-CHALLENGE'}
                    </span>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                      {showAllChallenges ? `${currentChallengeIndex + 1} of ${challenges.length}` : `#${dailyChallenge.id} • ${dailyChallenge.category}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowAllChallenges(!showAllChallenges); }}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {showAllChallenges ? '← Today\'s' : 'Browse All 50 →'}
                </button>
              </div>

              {/* Challenge navigation (only in browse mode) */}
              {showAllChallenges && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <button onClick={prevChallenge} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'white' }}>
                    <ChevronLeft size={20} />
                  </button>
                  <select
                    value={challengeFilter}
                    onChange={(e) => setChallengeFilter(e.target.value)}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '13px' }}
                  >
                    <option value="all" style={{ color: '#1f2937' }}>All Categories</option>
                    <option value="food" style={{ color: '#1f2937' }}>🍽️ Food & Diet</option>
                    <option value="transport" style={{ color: '#1f2937' }}>🚗 Transportation</option>
                    <option value="energy" style={{ color: '#1f2937' }}>⚡ Home & Energy</option>
                    <option value="lifestyle" style={{ color: '#1f2937' }}>🌿 Lifestyle</option>
                  </select>
                  <button onClick={nextChallenge} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'white' }}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {/* Challenge content */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{
                  background: currentChallenge.difficulty === 'easy' ? '#10b981' : currentChallenge.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {currentChallenge.difficulty}
                </span>
              </div>
              
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', marginTop: '8px' }}>{currentChallenge.title}</h3>
              <p style={{ color: '#d1d5db', maxWidth: '90%', lineHeight: '1.5' }}>{currentChallenge.description}</p>
              
              {/* CO2 Impact Display */}
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                background: 'rgba(16, 185, 129, 0.15)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Leaf size={24} color="#10b981" />
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>POTENTIAL IMPACT</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>
                    {currentChallenge.co2Impact} {currentChallenge.unit}
                  </div>
                </div>
              </div>

              {/* Tips */}
              {currentChallenge.tips && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                  💡 Tip: {currentChallenge.tips[Math.floor(Math.random() * currentChallenge.tips.length)]}
                </div>
              )}

              {challengeAccepted && (
                <div style={{ 
                  marginTop: '12px', 
                  padding: '12px', 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <p style={{ color: '#10b981', fontSize: '13px', margin: 0 }}>
                    🌱 Amazing! You saved <strong>{currentChallenge.co2Impact} {currentChallenge.unit}</strong> by completing this challenge!
                  </p>
                </div>
              )}
              
              <button
                style={{ ...styles.challengeBtn, background: challengeAccepted ? '#374151' : '#10b981', marginTop: '16px' }}
                onClick={handleChallengeClick}
              >
                {challengeAccepted ? <CheckCircle size={20} /> : null}
                {challengeAccepted ? 'Challenge Completed!' : 'Accept Challenge'}
              </button>
            </div>
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
              <Leaf size={200} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.sidebar}>
          {/* Monthly Goal - Dynamic Calculation */}
          <div
            style={{
              ...styles.rightCard,
              ...(expandedCard === 'goal' ? { border: '2px solid #10b981' } : {}),
              cursor: 'pointer'
            }}
            onClick={() => setExpandedCard(expandedCard === 'goal' ? null : 'goal')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '12px', color: '#3b82f6' }}><Target size={20} /></div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>Monthly Goal</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>{daysLeftInMonth} days left this month</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: '#1f2937' }}>{monthlyProgress.current}kg saved</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>/ {monthlyProgress.target}kg target</span>
              </div>
              <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ ...styles.progressBar, width: `${monthlyProgress.percentage}%` }}></div>
              </div>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>
                {monthlyProgress.current >= monthlyProgress.target 
                  ? '🎉 Goal achieved!' 
                  : `${monthlyProgress.target - monthlyProgress.current}kg more to reach your goal`}
              </p>
            </div>
            {expandedCard === 'goal' && renderExpandedContent('goal')}
          </div>

          {/* Achievements - With Progress Bars */}
          <div style={styles.rightCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '10px', background: '#fffbeb', borderRadius: '12px', color: '#f59e0b' }}><Trophy size={20} /></div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>Achievements</h3>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{unlockedCount} of {badges.length} unlocked</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {badges.map(b => (
                <div
                  key={b.id}
                  style={{
                    ...styles.badgeItem,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    ...(expandedBadge === b.id ? styles.badgeExpanded : {})
                  }}
                  onClick={() => setExpandedBadge(expandedBadge === b.id ? null : b.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '20px', opacity: b.unlocked ? 1 : 0.4 }}>{b.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: b.unlocked ? '#1f2937' : '#9ca3af' }}>{b.name}</div>
                    </div>
                    {b.unlocked ? (
                      <CheckCircle size={16} color="#10b981" />
                    ) : (
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{b.target}</span>
                    )}
                  </div>
                  
                  {/* Progress bar for incomplete badges */}
                  {!b.unlocked && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #10b981, #34d399)', 
                          borderRadius: '99px',
                          width: `${b.progress}%`,
                          transition: 'width 0.5s ease'
                        }}></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Expanded description */}
                  {expandedBadge === b.id && (
                    <div style={{ 
                      marginTop: '10px', 
                      padding: '10px', 
                      background: b.unlocked ? '#ecfdf5' : '#f9fafb', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#4b5563'
                    }}>
                      <p style={{ margin: 0 }}>{b.description}</p>
                      {b.unlocked && (
                        <p style={{ margin: '8px 0 0 0', color: '#10b981', fontWeight: '600' }}>✓ Completed!</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Impact Summary - Expandable */}
          <div
            style={{
              ...styles.rightCard,
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setExpandedCard(expandedCard === 'impact' ? null : 'impact')}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Impact Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ opacity: 0.8, fontSize: '14px' }}>Total Saved</span>
              <span style={{ fontSize: '24px', fontWeight: '700' }}>{totalSaved}kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ opacity: 0.8, fontSize: '14px' }}>Trees</span>
              <span style={{ fontSize: '24px', fontWeight: '700' }}>~{treesEquivalent} 🌳</span>
            </div>
            
            {/* Water & Land stats - calculated dynamically */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '8px',
              marginTop: '8px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '10px', 
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Water Saved</div>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>{environmentalImpact.water.toLocaleString()}L</div>
              </div>
              <div style={{ 
                background: 'rgba(255,255,255,0.15)', 
                padding: '10px', 
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>Land Saved</div>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>{environmentalImpact.land}m²</div>
              </div>
            </div>
            {expandedCard === 'impact' && renderExpandedContent('impact')}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      {/* Logo Sidebar */}
      <div style={styles.sidebarNav}>
        <div><Leaf color="#10b981" size={32} /></div>
        <div
          style={{ ...styles.navItem, ...styles.navItemActive }}
        >
          <LayoutDashboard size={24} />
        </div>
      </div>

      <div style={styles.mainContent}>
        {renderDashboard()}
      </div>
    </div>
  );
};

export default App;