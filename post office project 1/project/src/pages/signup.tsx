import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, User, Mail, Lock, Phone, MapPin, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user' as 'user' | 'staff',
    postOfficeCode: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const userData = {
      username: formData.username,
      full_name: formData.fullName,
      phone: formData.phone,
      role: formData.role,
      post_office_code: formData.role === 'staff' ? formData.postOfficeCode : null,
      address: formData.address
    };

    const { success, error: authError } = await signUp(formData.email, formData.password, userData);
    
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(authError || 'Registration failed');
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-post-green/10 via-white to-post-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-post-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-post-gray-900 mb-2">Account Created!</h2>
          <p className="text-post-gray-600 mb-4">Your account has been successfully created. Redirecting to login...</p>
          <div className="w-8 h-8 border-2 border-post-green border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-post-red-light via-white to-post-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-post-gray-200 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-post-red p-3 rounded-full inline-block mb-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-post-gray-900 mb-2">Create Account</h2>
            <p className="text-post-gray-600">Join the India Post Management System</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                >
                  <option value="user">Post Office User</option>
                  <option value="staff">Post Office Staff</option>
                </select>
              </div>
            </div>

            {/* Post Office Code (only for staff) */}
            {formData.role === 'staff' && (
              <div>
                <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                  Post Office Code
                </label>
                <div className="relative">
                  <Building className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="postOfficeCode"
                    value={formData.postOfficeCode}
                    onChange={handleChange}
                    required={formData.role === 'staff'}
                    className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white"
                    placeholder="Enter your post office code"
                  />
                </div>
              </div>
            )}

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-post-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="h-5 w-5 text-post-gray-400 absolute left-3 top-3" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-post-gray-300 rounded-lg focus:ring-2 focus:ring-post-red focus:border-transparent transition-all duration-200 bg-post-gray-50 focus:bg-white resize-none"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-post-red hover:bg-post-red-dark text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-post-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-post-red hover:text-post-red-dark font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;