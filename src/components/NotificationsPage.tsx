import React, { useState } from 'react';
import {
  Bell,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Heart,
  Check,
  MoreHorizontal,
  Mail,
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  currentUser: UserProfile;
  onMarkAllRead: () => void;
  onSelectUser: (user: UserProfile) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  currentUser,
  onMarkAllRead,
  onSelectUser,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
      case 'reaction':
        return (
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
            <ThumbsUp className="w-3 h-3" />
          </div>
        );
      case 'comment':
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-3 h-3" />
          </div>
        );
      case 'friend_request':
      case 'friend_accept':
        return (
          <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-xs">
            <UserPlus className="w-3 h-3" />
          </div>
        );
      case 'message':
        return (
          <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
            <Mail className="w-3 h-3" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
            <Bell className="w-3 h-3" />
          </div>
        );
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto py-4 px-2 sm:px-4 space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Notifications</h2>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-[#1877F2] dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-[#1877F2] dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        <button
          onClick={onMarkAllRead}
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs divide-y divide-gray-100 dark:divide-[#393a3b] overflow-hidden">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => {
            const sender = notif.from_user || currentUser;

            return (
              <div
                key={notif.id}
                onClick={() => sender && onSelectUser(sender)}
                className={`p-3.5 sm:p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer ${
                  !notif.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                }`}
              >
                {/* Avatar with small type badge */}
                <div className="relative shrink-0">
                  <img
                    src={sender.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender.id}`}
                    alt={sender.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1">{getNotifIcon(notif.type)}</div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                    <strong className="text-gray-900 dark:text-white font-bold">
                      {sender.full_name}
                    </strong>{' '}
                    {notif.content}
                  </p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
                    {formatTimeAgo(notif.created_at)}
                  </span>
                </div>

                {/* Unread dot */}
                {!notif.read && (
                  <div className="w-3 h-3 rounded-full bg-[#1877F2] shrink-0" />
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-base font-bold">No notifications right now</p>
            <p className="text-xs mt-1">You're all caught up with your StepBook alerts!</p>
          </div>
        )}
      </div>
    </div>
  );
};
