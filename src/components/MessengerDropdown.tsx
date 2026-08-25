import React, { useState, useMemo } from 'react';
import {
  Search,
  MessageCircle,
  X,
  CheckCircle2,
  Phone,
  Video,
  Send,
  Sparkles,
  Users,
  Circle,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, DirectMessage } from '../types';

interface MessengerDropdownProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectChatPartner: (user: UserProfile) => void;
  onClose: () => void;
}

export const MessengerDropdown: React.FC<MessengerDropdownProps> = ({
  currentUser,
  allUsers,
  onSelectChatPartner,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active'>('all');

  // Filter out the logged-in user from the chat list
  const availableUsers = useMemo(() => {
    return allUsers.filter((u) => u.id !== currentUser.id);
  }, [allUsers, currentUser.id]);

  // Search filtered list
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return availableUsers;
    return availableUsers.filter(
      (u) =>
        u.full_name.toLowerCase().includes(q) ||
        (u.work && u.work.toLowerCase().includes(q)) ||
        (u.location && u.location.toLowerCase().includes(q)) ||
        (u.bio && u.bio.toLowerCase().includes(q))
    );
  }, [availableUsers, search]);

  // Get last message snippet from localStorage if available
  const getLastMessageSnippet = (partnerId: string): string => {
    try {
      const key = `stepbook_messages_${[currentUser.id, partnerId].sort().join('_')}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const msgs = JSON.parse(saved) as DirectMessage[];
        if (msgs && msgs.length > 0) {
          const last = msgs[msgs.length - 1];
          const prefix = last.sender_id === currentUser.id ? 'You: ' : '';
          return prefix + (last.content || (last.image_url ? 'Sent a photo 📷' : ''));
        }
      }
    } catch {
      // ignore
    }
    return 'Click to start chatting on StepBook';
  };

  return (
    <div
      id="messenger-contacts-panel"
      className="absolute right-0 sm:right-0 top-12 sm:top-14 w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[400px] bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh] sm:max-h-[580px]"
    >
      {/* Header */}
      <div className="p-3.5 pb-2.5 border-b border-gray-100 dark:border-[#393a3b] bg-white dark:bg-[#242526] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#1877F2]">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                Chats & Messages
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Select a friend to SMS / Chat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] flex items-center justify-center text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-[#F0F2F5] dark:bg-[#3a3b3c] rounded-xl px-3 py-2 text-sm">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name to send SMS / message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ml-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-xs sm:text-sm focus:outline-hidden"
            autoFocus
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Active Now Tray */}
      {!search && (
        <div className="p-3 border-b border-gray-100 dark:border-[#393a3b] bg-gray-50/50 dark:bg-[#1e1f20]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Active Now ({availableUsers.length})
            </span>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  onSelectChatPartner(u);
                  onClose();
                }}
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                title={`Chat with ${u.full_name}`}
              >
                <div className="relative">
                  <img
                    src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                    alt={u.full_name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-transparent group-hover:border-[#1877F2] transition-all group-hover:scale-105"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full" />
                </div>
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 max-w-[54px] truncate text-center group-hover:text-[#1877F2]">
                  {u.full_name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-gray-50 dark:divide-[#393a3b]/40">
        <div className="px-2 pt-1 pb-0.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span>All Contacts ({filteredUsers.length})</span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
            Click to chat
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 dark:text-gray-400">
            No contacts found matching &ldquo;{search}&rdquo;
          </div>
        ) : (
          filteredUsers.map((u) => {
            const snippet = getLastMessageSnippet(u.id);
            return (
              <button
                key={u.id}
                onClick={() => {
                  onSelectChatPartner(u);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 dark:hover:bg-[#3a3b3c] transition-all text-left cursor-pointer group pt-2"
              >
                {/* Avatar with Online Indicator */}
                <div className="relative shrink-0">
                  <img
                    src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                    alt={u.full_name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full" />
                </div>

                {/* Name & Snippet */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate flex items-center gap-1 group-hover:text-[#1877F2] dark:group-hover:text-blue-400">
                      <span>{u.full_name}</span>
                      {u.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {snippet}
                  </p>
                  {u.location && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      📍 {u.location}
                    </span>
                  )}
                </div>

                {/* Direct SMS / Message Action Badge */}
                <div className="shrink-0 flex items-center">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1877F2] dark:text-blue-300 text-xs font-semibold flex items-center gap-1 group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                    <Send className="w-3 h-3" />
                    <span className="hidden xs:inline">Chat</span>
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-2.5 bg-gray-50 dark:bg-[#1c1d1e] border-t border-gray-100 dark:border-[#393a3b] text-center">
        <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          Real-time 1-on-1 private messaging on StepBook
        </span>
      </div>
    </div>
  );
};
