// Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'staff'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { success, error: authError, user } = await signIn(email, password, role);
    setLoading(false);

    if (!success) {
      setError(authError || 'Login failed');
    } else {
      // Navigate based on actual user role from backend
      if (user?.role === 'user') {
        navigate('/admin');
      } else if (user?.role === 'staff') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-post-red-light via-white to-post-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-post-gray-200 animate-slide-up">
        <div className="text-center mb-8">
          <div className="bg-post-red p-3 rounded-full inline-block mb-4 animate-bounce-subtle">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-post-gray-900 mb-2">Welcome Back</h2>
          <p className="text-post-gray-600">Sign in to your India Post account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-post-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-post-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-semibold text-post-gray-700 mb-2">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'staff')}
              className="w-full px-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red"
            >
              <option value="user">Post Office User</option>
              <option value="staff">Post Office Staff</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-post-red hover:bg-post-red-dark text-white py-3 rounded-lg font-semibold"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-post-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-post-red hover:text-post-red-dark font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
