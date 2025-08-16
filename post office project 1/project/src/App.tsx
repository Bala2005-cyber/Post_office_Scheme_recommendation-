// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SchemeRecommender from './pages/SchemeRecommender';
import CampaignPlanner from './pages/CampaignPlanner';
import AdminDashboard from './pages/AdminDashboard';
import PostOfficeLocator from './pages/PostOfficeLocator';
import Chat from './pages/chat';
import SignUp from './pages/signup';

const ProtectedRoute = ({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles: Array<'staff' | 'admin'>;
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path = "/signup" element={<SignUp/>}/>

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/scheme-recommender" element={<SchemeRecommender />} />

              <Route
                path="/campaign-planner"
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <CampaignPlanner />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post-office-locator"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <PostOfficeLocator />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
