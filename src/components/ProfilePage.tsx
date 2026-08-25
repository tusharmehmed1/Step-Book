import React, { useState } from 'react';
import {
  Camera,
  Edit,
  Plus,
  MessageCircle,
  Briefcase,
  GraduationCap,
  Home,
  MapPin,
  Heart,
  Globe,
  Calendar,
  CheckCircle2,
  Check,
  X,
  Sparkles,
  UserPlus,
  UserCheck,
  Clock,
  Send,
} from 'lucide-react';
import { UserProfile, PostItem, ReactionType, FriendShip } from '../types';
import { PostCard } from './PostCard';
import { CreatePostBox } from './CreatePostBox';

interface ProfilePageProps {
  profileUser: UserProfile;
  currentUser: UserProfile;
  posts: PostItem[];
  allUsers: UserProfile[];
  friendsList: UserProfile[];
  friendRequests: FriendShip[];
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onCreatePost: (newPost: any) => Promise<void>;
  onToggleReaction: (postId: string, reactionType: ReactionType) => Promise<void>;
  onAddComment: (postId: string, content: string, imageUrl?: string) => Promise<void>;
  onDeleteComment: (postId: string, commentId: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onOpenChatWith: (user: UserProfile) => void;
  onSelectUser: (user: UserProfile) => void;
  onAddFriend: (userId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profileUser,
  currentUser,
  posts,
  allUsers,
  friendsList,
  friendRequests,
  onUpdateProfile,
  onCreatePost,
  onToggleReaction,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onOpenChatWith,
  onSelectUser,
  onAddFriend,
  onAcceptRequest,
  onDeclineRequest,
}) => {
  const isMe = profileUser.id === currentUser.id;
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profileUser.bio || '');
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);

  // Edit details form states
  const [work, setWork] = useState(profileUser.work || '');
  const [education, setEducation] = useState(profileUser.education || '');
  const [location, setLocation] = useState(profileUser.location || '');
  const [website, setWebsite] = useState(profileUser.website || '');
  const [avatarUrl, setAvatarUrl] = useState(profileUser.avatar_url || '');
  const [coverUrl, setCoverUrl] = useState(profileUser.cover_url || '');

  // Friendship status
  const isFriend = friendsList.some((f) => f.id === profileUser.id);
  const incomingReq = friendRequests.find((r) => r.user_id === profileUser.id);
  const [sentReq, setSentReq] = useState(false);

  const userPosts = posts.filter((p) => p.user_id === profileUser.id);

  const handleSaveBio = async () => {
    await onUpdateProfile({ bio: bioText });
    setIsEditingBio(false);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      work,
      education,
      location,
      website,
      avatarUrl,
      coverUrl,
    });
    setShowEditDetailsModal(false);
  };

  const handleAddFriendClick = () => {
    setSentReq(true);
    onAddFriend(profileUser.id);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] pb-12 transition-colors">
      {/* Profile Header & Banner */}
      <div className="bg-white dark:bg-[#242526] shadow-xs border-b border-gray-200 dark:border-[#393a3b]">
        <div className="max-w-6xl mx-auto">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-72 md:h-88 w-full bg-gradient-to-r from-blue-400 to-indigo-600 sm:rounded-b-2xl overflow-hidden group">
            <img
              src={
                profileUser.cover_url ||
                'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80'
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {isMe && (
              <button
                onClick={() => setShowEditDetailsModal(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-black/70 hover:bg-white text-gray-800 dark:text-white text-xs sm:text-sm font-bold shadow-md backdrop-blur-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Cover Photo</span>
              </button>
            )}
          </div>

          {/* Profile Details Bar */}
          <div className="px-4 sm:px-8 pb-3">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 -mt-16 sm:-mt-20 md:-mt-24 mb-4">
              {/* Avatar + Info */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 text-center md:text-left">
                <div className="relative group">
                  <img
                    src={
                      profileUser.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.id}`
                    }
                    alt={profileUser.full_name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white dark:border-[#242526] shadow-xl bg-white"
                  />
                  {isMe && (
                    <button
                      onClick={() => setShowEditDetailsModal(true)}
                      className="absolute bottom-2 right-2 p-2.5 rounded-full bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white shadow-md border-2 border-white dark:border-[#242526] cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-1.5">
                    <span>{profileUser.full_name}</span>
                    {profileUser.verified && (
                      <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500" />
                    )}
                  </h1>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    {friendsList.length} friends · {userPosts.length} posts
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isMe ? (
                  <button
                    onClick={() => setShowEditDetailsModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Friend status button */}
                    {isFriend ? (
                      <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs">
                        <UserCheck className="w-4 h-4" /> Friends
                      </div>
                    ) : incomingReq ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAcceptRequest(incomingReq.id)}
                          className="px-3.5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Confirm Request
                        </button>
                        <button
                          onClick={() => onDeclineRequest(incomingReq.id)}
                          className="px-3 py-2.5 rounded-xl bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    ) : sentReq ? (
                      <button
                        disabled
                        className="px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-not-allowed shadow-xs"
                      >
                        <Check className="w-4 h-4 text-green-500" /> Request Sent
                      </button>
                    ) : (
                      <button
                        onClick={handleAddFriendClick}
                        className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" /> Add Friend
                      </button>
                    )}

                    {/* Message button */}
                    <button
                      onClick={() => onOpenChatWith(profileUser)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#1877F2]" /> Message
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 pt-1 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-[#393a3b]">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-3 font-bold text-sm border-b-[3px] transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'posts'
                    ? 'border-[#1877F2] text-[#1877F2]'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-3 font-bold text-sm border-b-[3px] transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'about'
                    ? 'border-[#1877F2] text-[#1877F2]'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-4 py-3 font-bold text-sm border-b-[3px] transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'friends'
                    ? 'border-[#1877F2] text-[#1877F2]'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
                }`}
              >
                Friends ({friendsList.length})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-3 font-bold text-sm border-b-[3px] transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'photos'
                    ? 'border-[#1877F2] text-[#1877F2]'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
                }`}
              >
                Photos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Content Grid */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-4">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Intro, Photos & Friends Preview */}
            <div className="lg:col-span-5 space-y-4">
              {/* Intro Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs space-y-3">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Intro</h3>

                {/* Bio */}
                {isEditingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Describe who you are..."
                      rows={3}
                      className="w-full p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white resize-none focus:outline-hidden"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsEditingBio(false)}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBio}
                        className="px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 text-center py-1">
                      {profileUser.bio || (isMe ? 'Add a bio to tell people about yourself' : 'No bio yet')}
                    </p>
                    {isMe && (
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className="w-full py-1.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors mt-2 cursor-pointer"
                      >
                        Edit Bio
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-[#393a3b] text-sm text-gray-700 dark:text-gray-300">
                  {profileUser.work && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{profileUser.work}</span>
                    </div>
                  )}
                  {profileUser.education && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{profileUser.education}</span>
                    </div>
                  )}
                  {profileUser.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Lives in <strong className="font-semibold">{profileUser.location}</strong></span>
                    </div>
                  )}
                  {profileUser.relationship && (
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{profileUser.relationship}</span>
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                      <a
                        href={profileUser.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                      >
                        {profileUser.website}
                      </a>
                    </div>
                  )}
                </div>

                {isMe && (
                  <button
                    onClick={() => setShowEditDetailsModal(true)}
                    className="w-full py-2 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-bold text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {/* Friends Preview Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Friends</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {friendsList.length} friends
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('friends')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    See all friends
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {friendsList.slice(0, 6).map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onSelectUser(f)}
                      className="cursor-pointer group text-center"
                    >
                      <img
                        src={f.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                        alt={f.full_name}
                        className="w-full aspect-square rounded-xl object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 truncate mt-1">
                        {f.full_name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Create Post (if me) & User's Posts */}
            <div className="lg:col-span-7 space-y-4">
              {isMe && (
                <CreatePostBox
                  currentUser={currentUser}
                  onCreatePost={onCreatePost}
                />
              )}

              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onToggleReaction={onToggleReaction}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    onDeletePost={onDeletePost}
                    onSelectUser={onSelectUser}
                  />
                ))
              ) : (
                <div className="bg-white dark:bg-[#242526] p-8 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs text-center text-gray-500 dark:text-gray-400">
                  <p className="font-bold text-base">No posts to show</p>
                  <p className="text-xs mt-1">
                    {isMe ? 'Share your thoughts, photos or life updates!' : 'This user has not shared any posts yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 border border-gray-200 dark:border-[#393a3b] shadow-xs space-y-4">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">About</h3>
            <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
              <div>
                <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Bio</span>
                <p>{profileUser.bio || 'No bio provided'}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Work</span>
                <p>{profileUser.work || 'No workplace provided'}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Education</span>
                <p>{profileUser.education || 'No education provided'}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Location</span>
                <p>{profileUser.location || 'No location provided'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 border border-gray-200 dark:border-[#393a3b] shadow-xs">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">
              Friends ({friendsList.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {friendsList.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-[#393a3b] bg-gray-50/50 dark:bg-[#1f2022] hover:shadow-xs transition-shadow gap-3"
                >
                  <div
                    onClick={() => onSelectUser(f)}
                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <img
                      src={f.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                      alt={f.full_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline">
                        {f.full_name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{f.location || 'StepBook Friend'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenChatWith(f)}
                    className="p-2 rounded-full bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#1877F2] dark:text-blue-400 transition-colors shrink-0 cursor-pointer"
                    title={`Message ${f.full_name}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 border border-gray-200 dark:border-[#393a3b] shadow-xs">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-4">Photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {userPosts
                .filter((p) => p.image_url)
                .map((p) => (
                  <div
                    key={p.id}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xs"
                  >
                    <img
                      src={p.image_url}
                      alt="Photo"
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Details Modal */}
      {showEditDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-[#393a3b] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between sticky top-0 bg-white dark:bg-[#242526] z-10">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Profile Details</h3>
              <button
                onClick={() => setShowEditDetailsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Cover Photo URL
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Work / Job Title
                </label>
                <input
                  type="text"
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                  placeholder="e.g. Software Engineer at StepBook"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Education / University
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. Computer Science at University of Dhaka"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Current Location / City
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditDetailsModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-blue-600 transition-colors shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
