import React, { useState } from 'react';
import { Shield, User, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { UserProfile } from '../types';
import { supabase, dataStore } from '../lib/supabase';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

// Local registry key for persisted registered accounts
const REGISTERED_USERS_KEY = 'stepbook_registered_users';

interface RegisteredAccount {
  id: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
}

function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredAccount(account: RegisteredAccount) {
  try {
    const accounts = getRegisteredAccounts();
    const existingIdx = accounts.findIndex(
      (a) => a.email.toLowerCase() === account.email.toLowerCase()
    );
    if (existingIdx >= 0) {
      accounts[existingIdx] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to save account:', e);
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP FLOW ---
        if (!cleanName) {
          setErrorMsg('Please enter your full name.');
          setIsLoading(false);
          return;
        }

        if (cleanPassword !== confirmPassword.trim()) {
          setErrorMsg('Passwords do not match. Please re-enter.');
          setIsLoading(false);
          return;
        }

        let userId = 'user_' + Date.now();
        let userProfile: UserProfile = {
          id: userId,
          email: cleanEmail,
          full_name: cleanName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
          cover_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
          bio: 'Hey there! I just joined StepBook 🚀',
          location: 'Dhaka, Bangladesh',
          created_at: new Date().toISOString(),
          verified: false,
        };

        // Try Supabase auth sign up
        try {
          const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPassword,
            options: {
              data: { full_name: cleanName },
            },
          });

          if (!error && data?.user) {
            userId = data.user.id;
            userProfile.id = userId;
            // Also store profile in supabase profiles table
            await dataStore.updateProfile(userProfile);
          } else if (error && error.message.includes('already registered')) {
            throw new Error('This email is already registered. Please log in instead.');
          }
        } catch (supaErr: any) {
          if (supaErr.message && supaErr.message.includes('already registered')) {
            throw supaErr;
          }
          // If offline or network issue, proceed with local persistent account
        }

        // Save into local registered accounts registry
        saveRegisteredAccount({
          id: userId,
          email: cleanEmail,
          passwordHash: cleanPassword,
          profile: userProfile,
        });

        // Also add to dataStore profiles
        await dataStore.updateProfile(userProfile);

        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(userProfile);
        }, 600);

      } else {
        // --- LOG IN FLOW ---
        let loggedInProfile: UserProfile | null = null;

        // 1. Try Supabase signInWithPassword
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
          });

          if (!error && data?.user) {
            const fetchedProfile = await dataStore.getProfile(data.user.id);
            if (fetchedProfile) {
              loggedInProfile = fetchedProfile;
            } else {
              loggedInProfile = {
                id: data.user.id,
                email: cleanEmail,
                full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
                cover_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
                bio: 'StepBook Member ✨',
                created_at: new Date().toISOString(),
                verified: false,
              };
              await dataStore.updateProfile(loggedInProfile);
            }
          }
        } catch {
          // fallback to registered accounts check
        }

        // 2. If not found in supabase session, check locally registered accounts
        if (!loggedInProfile) {
          const registered = getRegisteredAccounts();
          const match = registered.find(
            (acc) => acc.email.toLowerCase() === cleanEmail && acc.passwordHash === cleanPassword
          );

          if (match) {
            loggedInProfile = match.profile;
          }
        }

        if (loggedInProfile) {
          onLoginSuccess(loggedInProfile);
        } else {
          throw new Error('Invalid email or password. Please check your credentials or create a new account.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="flex-1 max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-8">
        
        {/* Left Branding & Highlights */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-5">
          <div>
            <div className="text-[#1877F2] font-black text-5xl sm:text-6xl tracking-tighter inline-block">
              stepbook
            </div>
            <p className="text-xl sm:text-2xl font-normal text-gray-800 dark:text-gray-200 mt-2 leading-snug">
              StepBook helps you connect and share with the people in your life.
            </p>
          </div>

          <div className="hidden sm:flex flex-col gap-3.5 pt-2 text-left max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-[#242526]/70 border border-gray-200 dark:border-[#393a3b] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-[#1877F2] shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <strong className="block font-semibold text-gray-900 dark:text-white">Secure Authentication</strong>
                <span className="text-gray-600 dark:text-gray-400">Sign up with your personal email & secure password</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-[#242526]/70 border border-gray-200 dark:border-[#393a3b] shadow-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm">
                <strong className="block font-semibold text-gray-900 dark:text-white">Complete Social Experience</strong>
                <span className="text-gray-600 dark:text-gray-400">Posts, stories, 6 animated reactions, groups & messenger</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-md bg-white dark:bg-[#242526] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-[#393a3b]">
          {/* Header text */}
          <div className="mb-5 pb-3 border-b border-gray-100 dark:border-[#393a3b]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isSignUp ? 'Create a new account' : 'Log In to StepBook'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isSignUp ? "It's quick and easy." : 'Enter your email and password to access your feed.'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {/* Full Name for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-auth-name"
                    type="text"
                    required
                    placeholder="e.g. Arifur Rahman"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#F0F2F5]/50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2] focus:bg-white dark:focus:bg-[#3a3b3c] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-auth-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#F0F2F5]/50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2] focus:bg-white dark:focus:bg-[#3a3b3c] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isSignUp ? 'Minimum 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#F0F2F5]/50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2] focus:bg-white dark:focus:bg-[#3a3b3c] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-auth-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#F0F2F5]/50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1877F2] focus:bg-white dark:focus:bg-[#3a3b3c] transition-colors"
                  />
                </div>
              </div>
            )}

            {isSignUp && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight pt-1">
                By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy.
              </p>
            )}

            {/* Primary Action Button */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-bold text-base shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                isSignUp ? 'bg-[#42B72A] hover:bg-emerald-600' : 'bg-[#1877F2] hover:bg-blue-600'
              }`}
            >
              {isLoading ? (
                <span>Please wait...</span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-4" />

            {/* Switch Mode Button */}
            <div className="text-center">
              <button
                type="button"
                id="btn-toggle-auth-mode"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-colors cursor-pointer ${
                  isSignUp
                    ? 'bg-gray-100 dark:bg-[#3a3b3c] text-gray-800 dark:text-gray-200 hover:bg-gray-200'
                    : 'bg-[#42B72A] hover:bg-emerald-600 text-white'
                }`}
              >
                {isSignUp ? 'Already have an account? Log In' : 'Create new account'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Clean Footer */}
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
