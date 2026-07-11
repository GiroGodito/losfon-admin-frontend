// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { RateLimitBanner } from '../common/RateLimitBanner';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isRateLimited, rateLimitCountdown, resetRateLimit } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRateLimited) {
      showToast(`Please wait ${rateLimitCountdown} seconds before trying again.`, 'error');
      return;
    }
    
    if (!username.trim()) {
      showToast('Please enter your username', 'error');
      return;
    }
    if (!password.trim()) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error caught in form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-2xl shadow-2xl border border-green-500/20 p-8">
          <div className="text-center mb-8">
            {/* <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
              <span className="text-white font-bold text-2xl">LF</span>
            </div> */}
            <div className="
              w-16 h-16 
              bg-green-500/10 backdrop-blur-sm 
              border border-green-500/20 
              rounded-2xl 
              flex items-center justify-center 
              mx-auto
              shadow-sm
              shadow-green-500/5
              transition-all duration-300
              hover:bg-green-500/20
              hover:border-green-500/30
              hover:shadow-green-500/20
              hover:scale-[1.02]
              mb-4
            ">
              <span className="text-green-400 font-bold text-2xl group-hover:text-green-300 transition-colors">
                LF
              </span>
            </div>
            {/* <h1 className="text-2xl font-bold text-white mt-4">LosFon Admin</h1> */}
            <p className="text-gray-400 mt-1">Sign in to manage the system</p>
            {/* <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-400/70 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </div> */}
          </div>

          <RateLimitBanner
            isRateLimited={isRateLimited}
            countdown={rateLimitCountdown}
            resourceType="admin login"
            onDismiss={resetRateLimit}
            className="mb-4"
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-green-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isRateLimited}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-green-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isRateLimited}
                className="w-full pl-10 pr-12 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-400 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="glass-green"
              fullWidth
              isLoading={isLoading}
              disabled={isRateLimited}
              className="py-3 text-sm font-semibold"
            >
              {isRateLimited ? `Wait ${rateLimitCountdown}s` : 'Sign In'}
            </Button>
          </form>
          
          <p className="text-center text-xs text-gray-600 mt-6">
            Secure • Encrypted • Protected
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;