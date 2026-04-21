import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        // We have an access_token, we can fetch the user profile from google directly
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        // Let's send the user info directly to our backend to create/get the user
        const response = await axios.post('/api/auth/google', {
          user: userInfo.data,
          youtubeAccessToken: tokenResponse.access_token
        });

        login(response.data.user);
        localStorage.setItem('subtrack_token', response.data.token);
        // Save the youtube access token to use when syncing
        localStorage.setItem('youtube_access_token', tokenResponse.access_token);
        
        navigate('/dashboard');
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Login Failed'),
    scope: 'https://www.googleapis.com/auth/youtube.readonly openid email profile'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-container-lowest)', padding: '1rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 900, 
          background: 'linear-gradient(to bottom right, var(--color-primary-fixed), var(--color-primary-container))', 
          WebkitBackgroundClip: 'text', 
          color: 'transparent',
          marginBottom: '0.5rem'
        }}>SubTrack</h1>
        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: '3rem', fontSize: '0.875rem' }}>The Digital Curator for your YouTube reality.</p>
        
        {error && <div style={{ color: '#ffb4ab', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <button 
          onClick={() => handleLogin()}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: '1rem',
            border: 'none',
            background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-primary-container))',
            color: 'var(--color-on-primary-container)',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            boxShadow: 'rgba(255, 77, 141, 0.2) 0px 10px 20px -5px'
          }}
        >
          <LogIn size={20} />
          {loading ? 'Authenticating...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
