import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return (
    <>
      <Sidebar />
      <TopNav />
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/subscriptions" element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
