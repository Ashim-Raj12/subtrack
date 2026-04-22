import { Search, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TopNav() {
  const { user, searchQuery, setSearchQuery } = useAuth();

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '28rem' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-outline)' }} />
          <input 
            type="text" 
            placeholder="Search curated feed..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              backgroundColor: 'var(--color-surface-container-lowest)', 
              border: 'none', 
              borderRadius: '0.75rem', 
              padding: '0.5rem 1rem 0.5rem 2.5rem', 
              width: '100%',
              fontSize: '0.875rem',
              color: 'var(--color-on-surface)',
              outline: 'none'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <NavLink to="/notifications" style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--color-outline)', 
          cursor: 'pointer',
          position: 'relative',
          padding: '0.5rem',
          display: 'flex'
        }}>
          <Bell size={20} />
          <span style={{ 
            position: 'absolute', 
            top: '0.5rem', 
            right: '0.5rem', 
            width: '8px', 
            height: '8px', 
            backgroundColor: 'var(--color-primary-container)', 
            borderRadius: '50%',
            boxShadow: '0 0 0 2px var(--color-surface)'
          }}></span>
        </NavLink>
        
        <NavLink to="/settings" style={{ 
          width: '2rem', 
          height: '2rem', 
          borderRadius: '50%', 
          backgroundColor: 'var(--color-surface-container-high)',
          overflow: 'hidden',
          border: '1px solid rgba(89, 64, 70, 0.2)',
          display: 'block'
        }}>
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=3a3939&color=e5e2e1`} 
            alt={user?.name || "User"} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </NavLink>
      </div>
    </header>
  );
}
