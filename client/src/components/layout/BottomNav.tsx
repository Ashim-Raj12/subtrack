import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, Settings } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" style={{ color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
        <LayoutDashboard size={20} />
        <span style={{ fontSize: '10px' }}>Home</span>
      </NavLink>
      <NavLink to="/subscriptions" style={{ color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
        <Users size={20} />
        <span style={{ fontSize: '10px' }}>Subs</span>
      </NavLink>
      <NavLink to="/notifications" style={{ color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
        <Bell size={20} />
        <span style={{ fontSize: '10px' }}>Alerts</span>
      </NavLink>
      <NavLink to="/settings" style={{ color: 'var(--color-on-surface-variant)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
        <Settings size={20} />
        <span style={{ fontSize: '10px' }}>Settings</span>
      </NavLink>
    </nav>
  );
}
