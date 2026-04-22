import { useEffect, useState } from 'react';
import api from '../services/api';
import { RefreshCw } from 'lucide-react';

export default function Subscriptions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchSubs = async () => {
    try {
      const res = await api.get('/api/subscriptions');
      setSubs(res.data);
      setSubs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const youtubeAccessToken = localStorage.getItem('youtube_access_token');
      await api.post('/api/subscriptions/sync', { accessToken: youtubeAccessToken });
      await fetchSubs(); // refresh after sync
    } catch (err) {
      console.error('Failed to sync', err);
      alert("Failed to sync subscriptions. Please check your backend and API keys.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.25rem', marginBottom: '0.25rem' }}>Your Subscriptions</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>Manage and sync your curated channels.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={syncing}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-primary)', 
            padding: '0.5rem 1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 77, 141, 0.2)', 
            fontWeight: 600, cursor: syncing ? 'not-allowed' : 'pointer', opacity: syncing ? 0.7 : 1
          }}
        >
          <RefreshCw size={18} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          {syncing ? 'Syncing...' : 'Sync from YouTube'}
        </button>
      </header>

      {loading ? (
        <div style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: '3rem' }}>Loading subscriptions...</div>
      ) : subs.length === 0 ? (
        <div style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '1rem' }}>
          No subscriptions found yet. Click 'Sync from YouTube' to fetch.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {subs.map(sub => (
            <div key={sub._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div className="channel-pulse" style={{ width: '4rem', height: '4rem', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 0 2px rgba(255, 177, 196, 0.2)', overflow: 'hidden' }}>
                <img src={sub.avatarUrl || 'https://ui-avatars.com/api/?name=Channel&background=2a2a2a&color=ffb1c4'} alt={sub.channelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-on-surface)' }} title={sub.channelName}>
                  {sub.channelName.length > 20 ? sub.channelName.substring(0, 18) + '...' : sub.channelName}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
