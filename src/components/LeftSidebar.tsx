import React from 'react';
import {
  Users,
  Grid,
  Tv,
  Bookmark,
  Clock,
  Calendar,
  Flag,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  MessageCircle,
} from 'lucide-react';
import { UserProfile, ActivePage } from '../types';

interface LeftSidebarProps {
  currentUser: UserProfile;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onSelectUser: (user: UserProfile) => void;
  onOpenMessenger: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentUser,
  activePage,
  setActivePage,
  onSelectUser,
  onOpenMessenger,
}) => {
  return (
    <aside className="hidden lg:block w-72 xl:w-80 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      <div className="space-y-1 text-sm font-medium text-gray-800 dark:text-gray-200">
        {/* Profile Item */}
        <button
          id="sidebar-profile-link"
          onClick={() => onSelectUser(currentUser)}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left group"
        >
          <img
            src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
            alt={currentUser.full_name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-gray-900 dark:text-white truncate">
            {currentUser.full_name}
          </span>
        </button>

        {/* Friends */}
        <button
          id="sidebar-friends-link"
          onClick={() => setActivePage('friends')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
            activePage === 'friends'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-[#1877F2] font-bold'
              : 'hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c]'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <span>Friends</span>
        </button>

        {/* Groups */}
        <button
          id="sidebar-groups-link"
          onClick={() => setActivePage('groups')}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left ${
            activePage === 'groups'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-[#1877F2] font-bold'
              : 'hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c]'
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
            <Grid className="w-5 h-5" />
          </div>
          <span>Groups</span>
        </button>

        {/* Messenger */}
        <button
          id="sidebar-messages-link"
          onClick={onOpenMessenger}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span>Messenger</span>
        </button>

        {/* Watch */}
        <button
          id="sidebar-watch-link"
          onClick={() => setActivePage('home')}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <span>Video & Reels</span>
        </button>

        {/* Memories */}
        <button
          id="sidebar-memories-link"
          onClick={() => setActivePage('home')}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <span>Memories</span>
        </button>

        {/* Saved */}
        <button
          id="sidebar-saved-link"
          onClick={() => setActivePage('home')}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <span>Saved Posts</span>
        </button>

        {/* Events */}
        <button
          id="sidebar-events-link"
          onClick={() => setActivePage('home')}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <span>Events</span>
        </button>
      </div>

      <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-3 mx-2" />

      {/* Your Shortcuts */}
      <div className="px-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          <span>Your shortcuts</span>
        </div>
        <div className="space-y-1 text-sm font-medium">
          <button
            onClick={() => setActivePage('groups')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400 text-lg shrink-0">
              💻
            </div>
            <span className="text-gray-900 dark:text-gray-200 truncate font-medium text-sm">UI Designers Hub</span>
          </button>

          <button
            onClick={() => setActivePage('groups')}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg shrink-0">
              🚀
            </div>
            <span className="text-gray-900 dark:text-gray-200 truncate font-medium text-sm">React & TypeScript BD</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 pt-6 text-[11px] text-gray-500 dark:text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">Privacy</a> ·
          <a href="#" className="hover:underline">Terms</a> ·
          <a href="#" className="hover:underline">Advertising</a> ·
          <a href="#" className="hover:underline">Cookies</a> ·
          <a href="#" className="hover:underline">More</a>
        </div>
        <div>StepBook Social © 2026. Made with React & Supabase.</div>
      </div>
    </aside>
  );
};
