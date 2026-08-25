import React, { useState } from 'react';
import {
  UserPlus,
  UserCheck,
  Search,
  MessageCircle,
  MoreHorizontal,
  Check,
  X,
  Clock,
  Sparkles,
  Users,
  Send,
} from 'lucide-react';
import { UserProfile, FriendShip } from '../types';

interface FriendsPageProps {
  friendRequests: FriendShip[];
  friendsList: UserProfile[];
  allUsers: UserProfile[];
  currentUser: UserProfile;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onAddFriend: (userId: string) => void;
  onOpenChatWith: (user: UserProfile) => void;
  onSelectUser: (user: UserProfile) => void;
}

export const FriendsPage: React.FC<FriendsPageProps> = ({
  friendRequests,
  friendsList,
  allUsers,
  currentUser,
  onAcceptRequest,
  onDeclineRequest,
  onAddFriend,
  onOpenChatWith,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  // Friends & non-friends calculations
  const friendIds = friendsList.map((f) => f.id);
  const requestSenderIds = friendRequests.map((r) => r.user_id);

  const nonFriends = allUsers.filter(
    (u) =>
      u.id !== currentUser.id &&
      !friendIds.includes(u.id) &&
      !requestSenderIds.includes(u.id)
  );

  const filteredFriends = searchQuery.trim()
    ? friendsList.filter((u) =>
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.location && u.location.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : friendsList;

  const filteredNonFriends = searchQuery.trim()
    ? nonFriends.filter((u) =>
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nonFriends;

  const handleSendFriendRequest = (userId: string) => {
    setSentRequests((prev) => [...prev, userId]);
    onAddFriend(userId);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Friends</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1877F2] dark:bg-blue-900/50 dark:text-blue-300">
              {friendsList.length} Friends
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Send friend requests, receive real-time notifications, and start private direct chats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-100 dark:bg-[#3a3b3c] text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#393a3b] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'bg-white dark:bg-[#242526] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] border border-gray-200 dark:border-[#393a3b]'
          }`}
        >
          All Friends ({friendsList.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'bg-white dark:bg-[#242526] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] border border-gray-200 dark:border-[#393a3b]'
          }`}
        >
          <span>Friend Requests</span>
          {friendRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-red-500 text-white">
              {friendRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 ${
            activeTab === 'suggestions'
              ? 'bg-[#1877F2] text-white shadow-xs'
              : 'bg-white dark:bg-[#242526] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] border border-gray-200 dark:border-[#393a3b]'
          }`}
        >
          Suggestions ({nonFriends.length})
        </button>
      </div>

      {/* 1. Friend Requests Section */}
      {(activeTab === 'all' || activeTab === 'requests') && friendRequests.length > 0 && (
        <section className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#1877F2]" />
              <span>Friend Requests</span>
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                {friendRequests.length} new
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friendRequests.map((req) => {
              const profile = req.friend_profile;
              if (!profile) return null;

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-[#1c1d1e] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative group cursor-pointer" onClick={() => onSelectUser(profile)}>
                    <img
                      src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
                      alt={profile.full_name}
                      className="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" /> Pending
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => onSelectUser(profile)}
                        className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
                      >
                        {profile.full_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {req.mutual_count || 5} mutual friends · {profile.location || 'Dhaka'}
                      </p>
                    </div>

                    <div className="space-y-2 mt-3.5">
                      <button
                        onClick={() => onAcceptRequest(req.id)}
                        className="w-full py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Confirm Request
                      </button>
                      <button
                        onClick={() => onDeclineRequest(req.id)}
                        className="w-full py-2 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. All Friends Section (With Private Chat) */}
      {(activeTab === 'all' || activeTab === 'all') && (
        <section className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span>Your Friends</span>
              <span className="text-xs text-gray-500">({filteredFriends.length})</span>
            </h3>
          </div>

          {filteredFriends.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFriends.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-[#1c1d1e] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative group cursor-pointer" onClick={() => onSelectUser(user)}>
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                      alt={user.full_name}
                      className="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-200"
                    />
                    <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" title="Online" />
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => onSelectUser(user)}
                        className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
                      >
                        {user.full_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {user.location || user.work || 'Friend on StepBook'}
                      </p>
                    </div>

                    <div className="space-y-2 mt-3.5">
                      <button
                        onClick={() => onOpenChatWith(user)}
                        className="w-full py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" /> Message Private Chat
                      </button>
                      <button
                        onClick={() => onSelectUser(user)}
                        className="w-full py-2 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
              No friends found matching your search. Add people from the suggestions below!
            </div>
          )}
        </section>
      )}

      {/* 3. Suggestions: People You May Know */}
      {(activeTab === 'all' || activeTab === 'suggestions') && (
        <section className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>People You May Know</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNonFriends.map((user) => {
              const isSent = sentRequests.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="bg-white dark:bg-[#1c1d1e] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={user.full_name}
                    className="w-full h-44 object-cover cursor-pointer hover:opacity-95"
                    onClick={() => onSelectUser(user)}
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => onSelectUser(user)}
                        className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
                      >
                        {user.full_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {user.location || user.work || 'Suggested for you'}
                      </p>
                    </div>

                    <div className="space-y-2 mt-3.5">
                      <button
                        onClick={() => handleSendFriendRequest(user.id)}
                        disabled={isSent}
                        className={`w-full py-2 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSent
                            ? 'bg-gray-100 dark:bg-[#3a3b3c] text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-[#1877F2] hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isSent ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" /> Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" /> Add Friend
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onOpenChatWith(user)}
                        className="w-full py-2 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#1877F2]" /> Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
