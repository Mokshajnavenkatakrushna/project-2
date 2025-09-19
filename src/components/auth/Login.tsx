import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(t('invalidCredentials') ?? 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 bg-white">
              <img
                src="/profile-user.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-black">SoilQ</h1>
            <p className="text-black/70">
              {t('soilQualityAnalyzer') ?? 'Soil Quality Analyzer'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-black/80 text-sm font-medium mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-black/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-black placeholder-black/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                  placeholder={t('enterEmail') ?? 'Enter your email'}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-black/80 text-sm font-medium mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-black/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-black placeholder-black/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                  placeholder={t('enterPassword') ?? 'Enter your password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-black/60 hover:text-black transition-colors"
                  aria-label={
                    showPassword
                      ? t('hidePassword') ?? 'Hide password'
                      : t('showPassword') ?? 'Show password'
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading && <Loader className="animate-spin" size={20} />}
              <span>
                {loading
                  ? t('loading') ?? 'Loading...'
                  : t('login') ?? 'Login'}
              </span>
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-black/70">
              {t('noAccount') ?? 'Don’t have an account?'}{' '}
              <Link
                to="/signup"
                className="text-blue-800 hover:text-blue-600 font-medium transition-colors"
              >
                {t('signup') ?? 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
