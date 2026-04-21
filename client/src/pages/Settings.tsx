import { useState } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('14:00');

  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '40rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.25rem', marginBottom: '0.25rem' }}>Preferences</h2>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Configure how SubTrack curates your life.</p>
      </header>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '0.5rem' }}>Profile Information</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--color-surface-container-highest)' }}>
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2a2a2a&color=ffb1c4`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-on-surface)' }}>{user?.name || 'Curator'}</div>
            <div style={{ color: 'var(--color-on-surface-variant)' }}>{user?.email || 'No email provided'}</div>
            <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'inline-block', backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-primary)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: 600 }}>Active Member</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '1rem' }}>Notifications</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 600 }}>Enable Curated Alerts</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>Receive daily pushes when new videos are found.</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={notificationsEnabled} onChange={e => setNotificationsEnabled(e.target.checked)} style={{ srOnly: true, width: 0, height: 0, opacity: 0 }} />
              <div style={{ 
                width: '3rem', height: '1.5rem', 
                backgroundColor: notificationsEnabled ? 'var(--color-primary-container)' : 'var(--color-surface-container-highest)', 
                borderRadius: '9999px',
                transition: 'all 0.3s',
                position: 'relative'
              }}>
                <span style={{ 
                  position: 'absolute', top: '2px', left: notificationsEnabled ? 'calc(100% - 1.25rem - 2px)' : '2px', 
                  width: '1.25rem', height: '1.25rem', backgroundColor: 'white', borderRadius: '50%',
                  transition: 'all 0.3s'
                }}></span>
              </div>
            </label>
          </div>

          {notificationsEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Daily Delivery Time</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)' }}>When should we run the cron job? Default 2:00 PM.</div>
              </div>
              <input 
                type="time" 
                value={notificationTime} 
                onChange={e => setNotificationTime(e.target.value)} 
                style={{ 
                  backgroundColor: 'var(--color-surface-container-highest)', 
                  border: '1px solid var(--color-outline-variant)', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.5rem' 
                }} 
              />
            </div>
          )}
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-outline-variant)', opacity: 0.2 }}></div>

        <div>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            backgroundColor: 'var(--color-primary-container)', 
            color: 'white', border: 'none', padding: '0.75rem 1.5rem', 
            borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer',
            boxShadow: 'rgba(255, 77, 141, 0.2) 0px 10px 15px -3px'
          }}>
            <Save size={18} />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
