import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.25rem', marginBottom: '0.25rem' }}>Notifications</h2>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Recent activity and curation updates.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: 'rgba(255, 77, 141, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
            <Bell size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)' }}>Welcome to SubTrack!</h4>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
              Your account is successfully set up. Hit "Sync from YouTube" on the Subscriptions tab to start curating.
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-outline)', marginTop: '0.5rem', display: 'block' }}>Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
