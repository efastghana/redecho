import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Login = ({ isDarkMode = true }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const { register } = await import('../context/AuthContext');
        // Registration handled in AuthContext
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-dark-bg' : 'bg-light-bg'} flex items-center justify-center px-4 pb-20`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
            RedEcho
          </h1>
          <p className={isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Form Card */}
        <div className={`card p-6 ${isDarkMode ? 'border border-dark-bg bg-dark-secondary' : 'border border-light-hover bg-light-secondary'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`input-field ${isDarkMode ? '' : 'light-mode'}`}
                required
              />
            </div>

            {/* Username (Register only) */}
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                  Username (Optional)
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your username"
                  className={`input-field ${isDarkMode ? '' : 'light-mode'}`}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-text-light' : 'text-text-dark'}`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field ${isDarkMode ? '' : 'light-mode'}`}
                required
                minLength={6}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-primary hover:text-red-700 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Guest Mode */}
        <div className="mt-6 text-center">
          <p className={`text-sm mb-3 ${isDarkMode ? 'text-text-grey' : 'text-text-dark-grey'}`}>
            Want to browse as guest?
          </p>
          <Link
            to="/"
            className={`inline-block px-4 py-2 rounded-lg font-medium transition ${
              isDarkMode
                ? 'bg-dark-secondary hover:bg-dark-bg text-text-light'
                : 'bg-light-secondary hover:bg-light-hover text-text-dark border border-light-hover'
            }`}
          >
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
};
