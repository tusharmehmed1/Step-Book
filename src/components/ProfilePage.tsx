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
} from 'lucide-react';
import { UserProfile, PostItem, ReactionType } from '../types';
import { PostCard } from './PostCard';
import { CreatePostBox } from './CreatePostBox';

interface ProfilePageProps {
  profileUser: UserProfile;
  currentUser: UserProfile;
  posts: PostItem[];
  allUsers: UserProfile[];
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  onCreatePost: (newPost: any) => Promise<void>;
  onToggleReaction: (postId: string, reactionType: ReactionType) => Promise<void>;
  onAddComment: (postId: string, content: string, imageUrl?: string) => Promise<void>;
  onDeleteComment: (postId: string, commentId: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onOpenChatWith: (user: UserProfile) => void;
  onSelectUser: (user: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profileUser,
  currentUser,
  posts,
  allUsers,
  onUpdateProfile,
  onCreatePost,
  onToggleReaction,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onOpenChatWith,
  onSelectUser,
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

  const userPosts = posts.filter((p) => p.user_id === profileUser.id);
  const friendsList = allUsers.filter((u) => u.id !== profileUser.id);

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
      avatar_url: avatarUrl,
      cover_url: coverUrl,
    });
    setShowEditDetailsModal(false);
  };

  return (
    <div className="w-full pb-10">
      {/* Top Banner & Header Section */}
      <div className="bg-white dark:bg-[#242526] shadow-xs border-b border-gray-200 dark:border-[#393a3b]">
        <div className="max-w-6xl mx-auto">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-72 md:h-96 rounded-b-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600">
            {profileUser.cover_url && (
              <img
                src={profileUser.cover_url}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {isMe && (
              <button
                onClick={() => setShowEditDetailsModal(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-black/70 hover:bg-white text-gray-800 dark:text-white text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Cover Photo</span>
              </button>
            )}
          </div>

          {/* User Profile Bar (Avatar + Info + Buttons) */}
          <div className="px-4 sm:px-8 pb-4">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 sm:-mt-24 gap-4 pb-4 border-b border-gray-200 dark:border-[#393a3b]">
              {/* Avatar + Basic Names */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">
                <div className="relative group">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-[#242526] shadow-xl bg-gray-100 dark:bg-gray-800">
                    <img
                      src={
                        profileUser.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.id}`
                      }
                      alt={profileUser.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isMe && (
                    <button
                      onClick={() => setShowEditDetailsModal(true)}
                      className="absolute bottom-2 right-2 p-2.5 rounded-full bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 text-gray-800 dark:text-white shadow-md transition-colors cursor-pointer"
                      title="Update profile picture"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mb-2">
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
                  <>
                    <button
                      onClick={() => setShowEditDetailsModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onOpenChatWith(profileUser)}
                      className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" /> Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 pt-1 overflow-x-auto no-scrollbar">
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
                        className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBio}
                        className="px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold shadow-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 text-center py-1">
                      {profileUser.bio || 'No bio added yet.'}
                    </p>
                    {isMe && (
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className="w-full mt-2 py-2 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Edit bio
                      </button>
                    )}
                  </div>
                )}

                {/* Details List */}
                <div className="space-y-2.5 pt-2 text-sm text-gray-700 dark:text-gray-300">
                  {profileUser.work && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>{profileUser.work}</span>
                    </div>
                  )}
                  {profileUser.education && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>Studied {profileUser.education}</span>
                    </div>
                  )}
                  {profileUser.location && (
                    <div className="flex items-center gap-3">
                      <Home className="w-5 h-5 text-gray-400 shrink-0" />
                      <span>Lives in <strong className="font-semibold text-gray-900 dark:text-white">{profileUser.location}</strong></span>
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400 shrink-0" />
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
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                    <span>
                      Joined StepBook{' '}
                      {new Date(profileUser.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {isMe && (
                  <button
                    onClick={() => setShowEditDetailsModal(true)}
                    className="w-full py-2 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Edit details
                  </button>
                )}
              </div>

              {/* Photos Preview Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Photos</h3>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline"
                  >
                    See all photos
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                  {userPosts
                    .filter((p) => p.image_url)
                    .slice(0, 6)
                    .map((p) => (
                      <div key={p.id} className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <img
                          src={p.image_url}
                          alt="Gallery item"
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Friends Preview Card */}
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Friends</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {friendsList.length} friends
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('friends')}
                    className="text-blue-600 dark:text-blue-400 text-xs font-semibold hover:underline"
                  >
                    See all friends
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {friendsList.slice(0, 6).map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onSelectUser(f)}
                      className="cursor-pointer group text-left"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-1">
                        <img
                          src={f.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                          alt={f.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                        {f.full_name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Create Post Box & Feed */}
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
                <div className="bg-white dark:bg-[#242526] rounded-2xl p-8 text-center border border-gray-200 dark:border-[#393a3b] shadow-xs">
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                    No posts published yet.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Posts created by {profileUser.full_name} will appear right here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 border border-gray-200 dark:border-[#393a3b] shadow-xs max-w-2xl space-y-4">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              About {profileUser.full_name}
            </h3>
            <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200">
              <div>
                <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Biography</span>
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
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-[#393a3b] hover:shadow-xs transition-shadow"
                >
                  <img
                    src={f.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                    alt={f.full_name}
                    className="w-16 h-16 rounded-xl object-cover cursor-pointer"
                    onClick={() => onSelectUser(f)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => onSelectUser(f)}
                      className="font-bold text-sm text-gray-900 dark:text-white truncate hover:underline cursor-pointer"
                    >
                      {f.full_name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{f.location || 'StepBook Member'}</p>
                  </div>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-[#393a3b] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between sticky top-0 bg-white dark:bg-[#242526] z-10">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Profile Details</h3>
              <button
                onClick={() => setShowEditDetailsModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-blue-600 transition-colors shadow-md"
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
