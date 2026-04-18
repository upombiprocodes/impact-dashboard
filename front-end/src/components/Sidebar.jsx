import React from 'react';
import { Leaf, LayoutDashboard, Search, Utensils, Lightbulb, Users } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeNav, setActiveNav }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'food', icon: Search },
    { id: 'meal', icon: Utensils },
    { id: 'insight', icon: Lightbulb },
    { id: 'community', icon: Users }
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Leaf color="#10B981" size={32} strokeWidth={2.5} />
      </div>

      <nav className="nav-menu">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <Icon size={24} />
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
