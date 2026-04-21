import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 900, 
          background: 'linear-gradient(to bottom right, #fbcfe8, #db2777)', 
          WebkitBackgroundClip: 'text', 
          color: 'transparent'
        }}>SubTrack</h1>
        <p style={{ color: '#71717a', fontSize: '0.75rem', marginTop: '0.25rem' }}>Digital Curator</p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/subscriptions" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span>Subscriptions</span>
        </NavLink>
        <NavLink to="/notifications" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Bell size={20} />
          <span>Notifications</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div style={{ padding: '0 0.5rem', marginTop: 'auto' }}>
        <button onClick={handleLogout} className="nav-link" style={{ borderRadius: '0.75rem', width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
