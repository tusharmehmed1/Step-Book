import React, { useState } from 'react';
import { Sparkles, Shield, User, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { SEED_USERS } from '../lib/mockData';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickLogin = (demoUser: UserProfile) => {
    onLoginSuccess(demoUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields.');
        }

        // Try Supabase auth
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { full_name: fullName.trim() },
          },
        });

        const newProfile: UserProfile = {
          id: data?.user?.id || 'user_' + Date.now(),
          email: email.trim(),
          full_name: fullName.trim(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
          cover_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
          bio: 'Hey there! I just joined StepBook 🚀',
          location: 'Dhaka, Bangladesh',
          created_at: new Date().toISOString(),
          verified: false,
        };

        onLoginSuccess(newProfile);
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }

        // Try Supabase signIn or fallback
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        const loggedProfile: UserProfile = {
          id: data?.user?.id || 'user_logged',
          email: email.trim(),
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          cover_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
          bio: 'StepBook Member ✨',
          created_at: new Date().toISOString(),
          verified: false,
        };

        onLoginSuccess(loggedProfile);
      }
    } catch (err: any) {
      // If error occurs, inform user or allow instant demo entry
      setErrorMsg(err?.message || 'Authentication error. You can also use 1-click demo login below.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="flex-1 max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-8">
        {/* Left Hero Text (Classic Facebook Style) */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-3">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-black text-3xl tracking-tighter shadow-lg">
              S
            </div>
            <h1 className="font-black text-4xl sm:text-5xl text-[#1877F2] tracking-tight">
              StepBook
            </h1>
          </div>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200 leading-snug">
            StepBook helps you connect and share with the people in your life.
          </p>

          {/* Quick Demo Switcher */}
          <div className="pt-6">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-center lg:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>One-Click Instant Demo Login:</span>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
              {SEED_USERS.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white dark:bg-[#242526] border border-gray-300 dark:border-[#393a3b] shadow-xs hover:border-[#1877F2] hover:shadow-md transition-all cursor-pointer group text-left"
                >
                  <img
                    src={u.avatar_url}
                    alt={u.full_name}
                    className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {u.full_name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400">Click to login</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-md bg-white dark:bg-[#242526] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-[#393a3b]">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2]"
                />
              </div>
            )}

            <div>
              <input
                type="email"
                required
                placeholder="Email address or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2]"
              />
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-base shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Log In'}
            </button>

            {!isSignUp && (
              <div className="text-center py-1">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleQuickLogin(SEED_USERS[0]);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Forgotten password? Quick login as Demo
                </a>
              </div>
            )}

            <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-4" />

            <div className="text-center">
              <button
                type="button"
                id="btn-toggle-auth-mode"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                }}
                className="px-6 py-3 rounded-xl bg-[#42B72A] hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                {isSignUp ? 'Already have an account? Log In' : 'Create new account'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-8 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#393a3b]">
        <div className="flex flex-wrap gap-3 mb-2">
          <span>English (US)</span>
          <span>বাংলা</span>
          <span>Español</span>
          <span>Français (France)</span>
          <span>Português (Brasil)</span>
          <span>العربية</span>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] text-gray-400">
          <span>Sign Up</span> · <span>Log In</span> · <span>Messenger</span> · <span>StepBook Lite</span> · <span>Video</span> · <span>Places</span> · <span>Games</span> · <span>Marketplace</span> · <span>Meta Pay</span> · <span>Privacy Policy</span> · <span>Terms</span> · <span>StepBook © 2026</span>
        </div>
      </footer>
    </div>
  );
};
