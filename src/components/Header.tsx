import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Home,
  Users,
  Tv,
  Store,
  Grid,
  MessageCircle,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  Database,
  CheckCircle2,
  X,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserProfile, ActivePage, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  unreadNotifsCount: number;
  unreadMsgsCount: number;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onOpenSqlModal: () => void;
  onOpenMessenger: (user?: UserProfile) => void;
  onLogout: () => void;
  onSelectUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activePage,
  setActivePage,
  unreadNotifsCount,
  unreadMsgsCount,
  isDark,
  setIsDark,
  onOpenSqlModal,
  onOpenMessenger,
  onLogout,
  onSelectUser,
  allUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setShowMobileSearch(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showMobileSearch && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [showMobileSearch]);

  const filteredUsers = searchQuery.trim()
    ? allUsers.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (u.location && u.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-[#393a3b] shadow-xs px-2 sm:px-4 h-[56px] flex items-center justify-between transition-colors duration-200">
      {/* Left Section: Logo & Desktop/Tablet Search */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          id="btn-header-logo"
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 focus:outline-hidden group cursor-pointer"
        >
          <div className="text-[#1877F2] font-black text-2xl sm:text-3xl tracking-tighter hover:opacity-95 transition-opacity">
            stepbook
          </div>
        </button>

        {/* Mobile Search Button (Visible only on <sm) */}
        <button
          onClick={() => setShowMobileSearch(true)}
          className="sm:hidden w-9 h-9 rounded-full bg-[#F0F2F5] dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4a4b4c] flex items-center justify-center text-gray-600 dark:text-gray-300 ml-1 cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Search Bar for sm screens and above */}
        <div ref={searchRef} className="hidden sm:block relative ml-2">
          <div className="flex items-center bg-[#F0F2F5] dark:bg-[#3a3b3c] hover:bg-gray-200/70 dark:hover:bg-[#4a4b4c] rounded-full px-3.5 py-2 w-36 md:w-56 lg:w-60 focus-within:w-64 transition-all duration-200">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
            <input
              id="input-global-search"
              type="text"
              placeholder="Search StepBook"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="ml-2 w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Search Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute top-12 left-0 w-72 sm:w-80 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#393a3b] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1.5 flex items-center justify-between">
                <span>People & Profiles</span>
                <span className="text-[10px] text-blue-500">Live search</span>
              </div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg transition-colors text-left"
                  >
                    <img
                      src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                      alt={u.full_name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                        {u.full_name}
                        {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {u.location || u.work || 'StepBook Member'}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
                  No people found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Mobile Search Overlay */}
      {showMobileSearch && (
        <div
          ref={mobileSearchRef}
          className="fixed inset-0 z-50 bg-white dark:bg-[#242526] flex flex-col p-3 animate-in fade-in duration-150 sm:hidden"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-[#393a3b]">
            <button
              onClick={() => {
                setShowMobileSearch(false);
                setSearchQuery('');
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-600 dark:text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center bg-[#F0F2F5] dark:bg-[#3a3b3c] rounded-full px-3.5 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search StepBook..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-3">
            {searchQuery.trim() ? (
              filteredUsers.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                    Search Results
                  </div>
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u);
                        setShowMobileSearch(false);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-xl transition-colors text-left"
                    >
                      <img
                        src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                        alt={u.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                          {u.full_name}
                          {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {u.location || u.work || 'StepBook Member'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No people found matching "{searchQuery}"
                </div>
              )
            ) : (
              <div className="p-4 text-xs text-gray-400 text-center">
                Search for friends, colleagues, or groups by name
              </div>
            )}
          </div>
        </div>
      )}

      {/* Center Section: Main Nav Tabs (hidden on small mobile; mobile uses bottom bar) */}
      <nav className="hidden sm:flex items-center justify-center flex-1 max-w-xl h-full mx-2">
        <div className="flex items-center justify-around w-full h-full">
          <button
            id="tab-nav-home"
            title="Home"
            onClick={() => setActivePage('home')}
            className={`flex items-center justify-center flex-1 h-full max-w-[110px] border-b-4 transition-all relative cursor-pointer ${
              activePage === 'home'
                ? 'border-[#1877F2] text-[#1877F2]'
                : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] dark:text-gray-400 rounded-lg'
            }`}
          >
            <Home className="w-6 h-6" />
          </button>

          <button
            id="tab-nav-friends"
            title="Friends"
            onClick={() => setActivePage('friends')}
            className={`flex items-center justify-center flex-1 h-full max-w-[110px] border-b-4 transition-all relative cursor-pointer ${
              activePage === 'friends'
                ? 'border-[#1877F2] text-[#1877F2]'
                : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] dark:text-gray-400 rounded-lg'
            }`}
          >
            <Users className="w-6 h-6" />
          </button>

          <button
            id="tab-nav-groups"
            title="Groups"
            onClick={() => setActivePage('groups')}
            className={`flex items-center justify-center flex-1 h-full max-w-[110px] border-b-4 transition-all relative cursor-pointer ${
              activePage === 'groups'
                ? 'border-[#1877F2] text-[#1877F2]'
                : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] dark:text-gray-400 rounded-lg'
            }`}
          >
            <Grid className="w-6 h-6" />
          </button>

          <button
            id="tab-nav-watch"
            title="Video / Watch"
            onClick={() => setActivePage('home')}
            className="hidden md:flex items-center justify-center flex-1 h-full max-w-[110px] border-b-4 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] dark:text-gray-400 rounded-lg transition-colors cursor-pointer"
          >
            <Tv className="w-6 h-6" />
          </button>

          <button
            id="tab-nav-marketplace"
            title="Marketplace"
            onClick={() => setActivePage('home')}
            className="hidden lg:flex items-center justify-center flex-1 h-full max-w-[110px] border-b-4 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] dark:text-gray-400 rounded-lg transition-colors cursor-pointer"
          >
            <Store className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Right Section: Messenger, Notifs, Dark/Light, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
        {/* Supabase SQL Helper Button (Hidden on mobile to save space) */}
        <button
          id="btn-sql-schema"
          title="Supabase SQL Schema"
          onClick={onOpenSqlModal}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-800"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Supabase DB</span>
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          id="btn-toggle-theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={() => setIsDark(!isDark)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors cursor-pointer shrink-0"
        >
          {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Messenger Button */}
        <button
          id="btn-open-messenger"
          title="Messenger"
          onClick={() => onOpenMessenger()}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors cursor-pointer shrink-0"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadMsgsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white dark:border-[#242526]">
              {unreadMsgsCount}
            </span>
          )}
        </button>

        {/* Notifications Button (hidden on sm if bottom bar exists, but accessible) */}
        <button
          id="btn-open-notifications"
          title="Notifications"
          onClick={() => setActivePage('notifications')}
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-colors cursor-pointer shrink-0 ${
            activePage === 'notifications'
              ? 'bg-blue-100 text-[#1877F2] dark:bg-blue-900/40 dark:text-[#2d88ff]'
              : 'bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-700 dark:text-gray-200'
          } flex items-center justify-center`}
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white dark:border-[#242526]">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* User Avatar & Dropdown */}
        <div ref={profileMenuRef} className="relative shrink-0">
          <button
            id="btn-user-avatar-menu"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#1877F2] transition-colors cursor-pointer flex items-center justify-center focus:outline-hidden"
          >
            <img
              src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
              alt={currentUser.full_name}
              className="w-full h-full object-cover"
            />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-68 sm:w-72 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] p-2.5 sm:p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                id="btn-menu-profile"
                onClick={() => {
                  onSelectUser(currentUser);
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-left"
              >
                <img
                  src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
                  alt={currentUser.full_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#1877F2]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                    {currentUser.full_name}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    See your profile
                  </div>
                </div>
              </button>

              <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-2" />

              <button
                onClick={() => {
                  onOpenSqlModal();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-left text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold">Supabase Database SQL</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">View or execute table script</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsDark(!isDark);
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors text-left text-xs sm:text-sm text-gray-800 dark:text-gray-200 font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#3a3b3c] flex items-center justify-center text-gray-700 dark:text-gray-300 shrink-0">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-semibold">Display & Dark Mode</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">Currently: {isDark ? 'Dark' : 'Light'}</div>
                </div>
              </button>

              <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-2" />

              <button
                id="btn-menu-logout"
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-colors text-left text-xs sm:text-sm font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
