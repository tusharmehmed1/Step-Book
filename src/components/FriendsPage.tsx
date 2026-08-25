import React, { useState } from 'react';
import { UserPlus, UserCheck, Search, MessageCircle, MoreHorizontal, Check, X } from 'lucide-react';
import { UserProfile, FriendShip } from '../types';

interface FriendsPageProps {
  friendRequests: FriendShip[];
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
  allUsers,
  currentUser,
  onAcceptRequest,
  onDeclineRequest,
  onAddFriend,
  onOpenChatWith,
  onSelectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const nonFriends = allUsers.filter(
    (u) =>
      u.id !== currentUser.id &&
      !friendRequests.some((r) => r.friend_id === u.id || r.user_id === u.id)
  );

  const filteredNonFriends = searchQuery.trim()
    ? nonFriends.filter((u) =>
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nonFriends;

  const handleSendFriendRequest = (userId: string) => {
    setSentRequests([...sentRequests, userId]);
    onAddFriend(userId);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Friends</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connect with friends, colleagues, and family on StepBook
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-100 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <section className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Friend Requests</span>
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                {friendRequests.length}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friendRequests.map((req) => {
              const profile = req.friend_profile;
              if (!profile) return null;

              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-[#1c1d1e] rounded-xl overflow-hidden border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <img
                    src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
                    alt={profile.full_name}
                    className="w-full h-44 object-cover cursor-pointer"
                    onClick={() => onSelectUser(profile)}
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => onSelectUser(profile)}
                        className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
                      >
                        {profile.full_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {req.mutual_count || 3} mutual friends
                      </p>
                    </div>

                    <div className="space-y-2 mt-3">
                      <button
                        onClick={() => onAcceptRequest(req.id)}
                        className="w-full py-2 rounded-lg bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Confirm
                      </button>
                      <button
                        onClick={() => onDeclineRequest(req.id)}
                        className="w-full py-2 rounded-lg bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors"
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

      {/* People You May Know Section */}
      <section className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          People You May Know
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNonFriends.map((user) => {
            const isSent = sentRequests.includes(user.id);

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-[#1c1d1e] rounded-xl overflow-hidden border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  alt={user.full_name}
                  className="w-full h-44 object-cover cursor-pointer"
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

                  <div className="space-y-2 mt-3">
                    <button
                      onClick={() => handleSendFriendRequest(user.id)}
                      disabled={isSent}
                      className={`w-full py-2 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 ${
                        isSent
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                          : 'bg-[#1877F2] hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isSent ? (
                        <>
                          <Check className="w-4 h-4" /> Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" /> Add Friend
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onOpenChatWith(user)}
                      className="w-full py-2 rounded-lg bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-blue-500" /> Message
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
