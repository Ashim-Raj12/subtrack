import { useState } from 'react';
import { LogIn, Play } from 'lucide-react';
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
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        
        const response = await axios.post('/api/auth/google', {
          user: userInfo.data,
          youtubeAccessToken: tokenResponse.access_token
        });

        login(response.data.user);
        localStorage.setItem('subtrack_token', response.data.token);
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#0A0A0A',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Mesh Gradients / Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, rgba(244, 63, 94, 0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      <div className="glass-card" style={{ 
        maxWidth: '440px', 
        width: '100%', 
        padding: '3.5rem 2.5rem', 
        textAlign: 'center', 
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '4rem', 
            height: '4rem', 
            backgroundColor: '#F43F5E', 
            borderRadius: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(244, 63, 94, 0.4)'
          }}>
            <Play fill="white" color="white" size={24} style={{ marginLeft: '2px' }} />
          </div>
        </div>

        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 800, 
          color: 'white',
          marginBottom: '0.75rem',
          letterSpacing: '-0.025em'
        }}>Welcome Back</h1>
        
        <p style={{ 
          color: '#9CA3AF', 
          marginBottom: '3rem', 
          fontSize: '1rem',
          lineHeight: '1.5'
        }}>
          Curating your digital consumption with precision.
        </p>
        
        {error && <div style={{ color: '#FB7185', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>{error}</div>}

        <button 
          onClick={() => handleLogin()}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1.125rem',
            borderRadius: '9999px',
            border: 'none',
            background: 'linear-gradient(to right, #FB7185, #F43F5E)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 10px 15px -3px rgba(244, 63, 94, 0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {loading ? (
            'Authenticating...'
          ) : (
            <>
              {/* Simple Google Icon Simulation */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fillOpacity="0.8" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fillOpacity="0.9" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem' }}>
          <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

