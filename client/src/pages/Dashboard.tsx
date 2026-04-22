import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user, searchQuery } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await api.get('/api/videos/dashboard');
      setVideos(res.data);
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const ytToken = localStorage.getItem('youtube_access_token');
      
      if (!ytToken) {
        alert('Please login with Google again to sync videos.');
        return;
      }
      
      await api.post('/api/subscriptions/sync', 
        { accessToken: ytToken }
      );
      
      alert('Sync started! Wait a few moments for the background process to finish fetching new videos, then refresh.');
      // Re-fetch after a short delay since it's a background process
      setTimeout(fetchVideos, 5000);
    } catch (err) {
      console.error('Error syncing videos', err);
      alert('Error syncing videos. Token might be expired.');
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <span style={{ color: 'var(--color-primary)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '10px' }}>Overview</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.25rem', marginBottom: '0.25rem' }}>Good Afternoon, {user?.name?.split(' ')[0]}</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem' }}>
            You have {filteredVideos.length} matching curated updates.
          </p>
        </div>
        
        <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '0.75rem' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-primary-container)', borderRadius: '50%', boxShadow: '0 0 8px var(--color-primary-container)' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>LIVE FEED</span>
        </div>
      </header>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '2rem' }} className="no-scrollbar">
        <button style={{ backgroundColor: 'var(--color-primary-container)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.75rem', border: 'none', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: 'rgba(255, 77, 141, 0.2) 0px 10px 15px -3px' }}>
          All Updates
        </button>
      </div>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            Today's New Videos
            {filteredVideos.length > 0 && <span style={{ backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-primary)', fontSize: '10px', padding: '2px 8px', borderRadius: '9999px' }}>{filteredVideos.length} FOUND</span>}
          </h3>
          
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              backgroundColor: 'transparent',
              color: 'var(--color-primary)', border: '1px solid var(--color-primary-container)',
              padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, cursor: isSyncing ? 'not-allowed' : 'pointer',
              opacity: isSyncing ? 0.7 : 1
            }}
          >
            <RefreshCw size={16} className={isSyncing ? "spin-animation" : ""} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        {loading ? (
          <div style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: '3rem' }}>Curating your feed...</div>
        ) : filteredVideos.length === 0 ? (
          <div style={{ color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-surface-container-high)', borderRadius: '1rem' }}>
            {searchQuery ? `No videos match "${searchQuery}"` : "No new videos recently. (Try syncing your subscriptions!)"}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredVideos.map(video => (
              <div key={video._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', backgroundColor: 'rgba(0,0,0,0.8)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontSize: '10px', fontWeight: 700, color: 'white', letterSpacing: '1px' }}>
                    {video.duration || 'Video'}
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="channel-pulse" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 0 2px rgba(255, 177, 196, 0.2)', overflow: 'hidden' }}>
                      <img src={video.avatarUrl || 'https://ui-avatars.com/api/?name=Channel&background=2a2a2a&color=ffb1c4'} alt={video.channelTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-on-surface)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} title={video.title}>
                        {video.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.75rem', fontWeight: 500 }}>{video.channelTitle}</span>
                        <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--color-surface-container-highest)', borderRadius: '50%' }}></span>
                        <span style={{ color: 'var(--color-outline)', fontSize: '11px' }}>
                          {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <a href={`https://youtube.com/watch?v=${video.youtubeVideoId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', textAlign: 'center', flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-primary-container))', color: 'var(--color-on-primary-container)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', boxShadow: 'rgba(255, 77, 141, 0.1) 0px 10px 15px -3px' }}>
                      Watch Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
