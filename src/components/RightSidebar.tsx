import React from 'react';
import { Gift, Video, Search, MoreHorizontal, UserPlus, Check, X, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';

interface RightSidebarProps {
  contacts: UserProfile[];
  currentUser: UserProfile;
  onOpenChatWith: (user: UserProfile) => void;
  onSelectUser: (user: UserProfile) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  contacts,
  currentUser,
  onOpenChatWith,
  onSelectUser,
}) => {
  const activeContacts = contacts.filter((c) => c.id !== currentUser.id);

  return (
    <aside className="hidden xl:block w-72 2xl:w-80 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      {/* Sponsored */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          Sponsored
        </div>
        <div className="space-y-3">
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80"
              alt="StepKit Cloud"
              className="w-24 h-14 rounded-lg object-cover shadow-xs group-hover:opacity-95"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                Design Better with StepKit
              </h4>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 block mt-0.5">
                stepbook.com/ads
              </span>
            </div>
          </a>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-3" />

      {/* Birthdays */}
      <div className="mb-4">
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          Birthdays
        </div>
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-500">
            <Gift className="w-5 h-5" />
          </div>
          <div className="text-sm text-gray-800 dark:text-gray-200">
            <span className="font-semibold text-gray-900 dark:text-white">Sarah Rahman</span>'s birthday is today!
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-[#393a3b] my-3" />

      {/* Contacts / Online Friends */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Contacts
          </span>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <button title="New Room" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3b3c] transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button title="Search Contact" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3b3c] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button title="Options" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3b3c] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-0.5">
          {activeContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onOpenChatWith(contact)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c] transition-colors text-left group relative"
            >
              <div className="relative shrink-0">
                <img
                  src={contact.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.id}`}
                  alt={contact.full_name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {/* Active Green Dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-[#1877F2]">
                  {contact.full_name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
