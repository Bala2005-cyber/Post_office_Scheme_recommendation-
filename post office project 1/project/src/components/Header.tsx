import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, MapPin, BarChart3, Calendar, MessageCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-post-red text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-post-red font-bold text-xl">📮</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">India Post</h1>
              <p className="text-sm opacity-90">AI Scheme Recommender</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-post-yellow transition-colors">
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link to="/post-office-locator" className="flex items-center space-x-1 hover:text-post-yellow transition-colors">
              <MapPin size={18} />
              <span>Post Offices</span>
            </Link>

            <Link to="/chat" className="flex items-center space-x-1 hover:text-post-yellow transition-colors">
              <MessageCircle size={18} />
              <span>Community Chat</span>
            </Link>

            {user?.role === 'staff' && (
              <Link to="/campaign-planner" className="flex items-center space-x-1 hover:text-post-yellow transition-colors">
                <Calendar size={18} />
                <span>Campaigns</span>
              </Link>
            )}

            {user?.role === 'user' && (
              <Link to="/admin" className="flex items-center space-x-1 hover:text-post-yellow transition-colors">
                <BarChart3 size={18} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User Profile or Login */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-post-yellow transition-colors">
                  <User size={18} />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-post-yellow transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-post-yellow hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
