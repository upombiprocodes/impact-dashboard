import React, { useState } from 'react';
import { Leaf, User, Lock, Mail, ArrowRight, Eye, EyeOff, Zap, Award, TrendingDown } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  });

  const API_URL = 'https://impact-dashboard-2eau.onrender.com';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { username: formData.username, password: formData.password }
        : { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password,
            display_name: formData.displayName || formData.username
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Demo login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    },
    leftPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '60px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '48px'
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(90deg, #10b981, #34d399)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: '800',
      lineHeight: '1.1',
      marginBottom: '24px'
    },
    heroSubtitle: {
      fontSize: '18px',
      color: '#94a3b8',
      marginBottom: '48px',
      maxWidth: '500px',
      lineHeight: '1.6'
    },
    features: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    featureIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    featureText: {
      display: 'flex',
      flexDirection: 'column'
    },
    featureTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'white'
    },
    featureDesc: {
      fontSize: '14px',
      color: '#64748b'
    },
    formCard: {
      background: 'white',
      borderRadius: '24px',
      padding: '48px',
      width: '100%',
      maxWidth: '440px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    formTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '8px'
    },
    formSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '32px'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '15px',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '4px'
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(90deg, #10b981, #059669)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'transform 0.1s, box-shadow 0.2s',
      marginTop: '24px'
    },
    demoBtn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '12px'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '24px 0',
      color: '#9ca3af',
      fontSize: '14px'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e5e7eb'
    },
    switchText: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '14px',
      color: '#6b7280'
    },
    switchLink: {
      color: '#10b981',
      fontWeight: '600',
      cursor: 'pointer',
      marginLeft: '4px'
    },
    error: {
      background: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    bgOrb1: {
      position: 'absolute',
      width: '400px',
      height: '400px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
      top: '-100px',
      right: '-100px'
    },
    bgOrb2: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
      bottom: '-50px',
      left: '-50px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.bgOrb1}></div>
        <div style={styles.bgOrb2}></div>
        
        <div style={styles.logo}>
          <Leaf size={40} color="#10b981" />
          <span style={styles.logoText}>Impact Dashboard</span>
        </div>
        
        <h1 style={styles.heroTitle}>
          Track Your<br />
          <span style={{ color: '#10b981' }}>Carbon Impact</span>
        </h1>
        
        <p style={styles.heroSubtitle}>
          Join thousands making sustainable food choices. Monitor your environmental 
          impact, complete daily challenges, and earn badges for your eco-conscious lifestyle.
        </p>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={{ ...styles.featureIcon, background: 'rgba(16, 185, 129, 0.2)' }}>
              <TrendingDown size={24} color="#10b981" />
            </div>
            <div style={styles.featureText}>
              <span style={styles.featureTitle}>Track CO₂ Savings</span>
              <span style={styles.featureDesc}>Monitor your weekly carbon footprint reduction</span>
            </div>
          </div>
          
          <div style={styles.feature}>
            <div style={{ ...styles.featureIcon, background: 'rgba(251, 191, 36, 0.2)' }}>
              <Zap size={24} color="#fbbf24" />
            </div>
            <div style={styles.featureText}>
              <span style={styles.featureTitle}>Daily Eco-Challenges</span>
              <span style={styles.featureDesc}>50 unique challenges to boost your impact</span>
            </div>
          </div>
          
          <div style={styles.feature}>
            <div style={{ ...styles.featureIcon, background: 'rgba(139, 92, 246, 0.2)' }}>
              <Award size={24} color="#8b5cf6" />
            </div>
            <div style={styles.featureText}>
              <span style={styles.featureTitle}>Earn Badges</span>
              <span style={styles.featureDesc}>Unlock achievements as you progress</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={styles.formSubtitle}>
            {isLogin 
              ? 'Sign in to continue tracking your impact' 
              : 'Start your sustainable journey today'}
          </p>
          
          {error && <div style={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <Mail size={20} style={styles.inputIcon} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required={!isLogin}
                    style={styles.input}
                  />
                </div>
              </div>
            )}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <User size={20} style={styles.inputIcon} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  style={styles.input}
                />
              </div>
            </div>
            
            {!isLogin && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Display Name (optional)</label>
                <div style={styles.inputWrapper}>
                  <User size={20} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="How should we call you?"
                    style={styles.input}
                  />
                </div>
              </div>
            )}
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              <ArrowRight size={20} />
            </button>
          </form>
          
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={{ padding: '0 16px' }}>or</span>
            <div style={styles.dividerLine}></div>
          </div>
          
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            style={{ ...styles.demoBtn, opacity: loading ? 0.7 : 1 }}
          >
            <User size={20} />
            Try Demo (Alex's Account)
          </button>
          
          <p style={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              style={styles.switchLink}
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
