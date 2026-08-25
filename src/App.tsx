import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { StoriesRow } from './components/StoriesRow';
import { CreatePostBox } from './components/CreatePostBox';
import { PostCard } from './components/PostCard';
import { FloatingChat } from './components/FloatingChat';
import { FriendsPage } from './components/FriendsPage';
import { GroupsPage } from './components/GroupsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ProfilePage } from './components/ProfilePage';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { AuthModal } from './components/AuthModal';

import {
  UserProfile,
  PostItem,
  StoryItem,
  GroupItem,
  FriendShip,
  NotificationItem,
  DirectMessage,
  ActivePage,
  ReactionType,
} from './types';
import { dataStore, supabase } from './lib/supabase';
import { SEED_USERS } from './lib/mockData';
import { Home, Users, Grid, Bell, User as UserIcon } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('stepbook_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data states
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(SEED_USERS);
  const [friendRequests, setFriendRequests] = useState<FriendShip[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Messenger chat state
  const [activeChatPartner, setActiveChatPartner] = useState<UserProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<DirectMessage[]>([]);

  // Modals & toast
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync Dark Mode class on document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      if (!currentUser) return;
      const [fetchedPosts, fetchedStories, fetchedGroups, fetchedUsers, fetchedReqs, fetchedNotifs] =
        await Promise.all([
          dataStore.getPosts(),
          dataStore.getStories(),
          dataStore.getGroups(),
          dataStore.getAllProfiles(),
          dataStore.getFriendRequests(currentUser.id),
          dataStore.getNotifications(currentUser.id),
        ]);

      setPosts(fetchedPosts);
      setStories(fetchedStories);
      setGroups(fetchedGroups);
      if (fetchedUsers && fetchedUsers.length > 0) {
        setAllUsers(fetchedUsers);
      }
      setFriendRequests(fetchedReqs);
      setNotifications(fetchedNotifs);
    };

    initData();
  }, [currentUser]);

  // Load chat messages when activeChatPartner changes
  useEffect(() => {
    if (currentUser && activeChatPartner) {
      dataStore.getMessages(currentUser.id, activeChatPartner.id).then(setChatMessages);
    }
  }, [currentUser, activeChatPartner]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('stepbook_current_user', JSON.stringify(user));
    showToast(`Welcome to StepBook, ${user.full_name}!`);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    localStorage.removeItem('stepbook_current_user');
    setCurrentUser(null);
    setActiveChatPartner(null);
  };

  // Post actions
  const handleCreatePost = async (newPostData: {
    content?: string;
    image_url?: string;
    video_url?: string;
    feeling?: { emoji: string; label: string };
    location?: string;
    privacy?: 'public' | 'friends' | 'only_me';
    bg_gradient?: string;
  }) => {
    if (!currentUser) return;
    const created = await dataStore.createPost({
      ...newPostData,
      user_id: currentUser.id,
      user: currentUser,
    });
    setPosts([created, ...posts]);
    showToast('Post published successfully!');
  };

  const handleToggleReaction = async (postId: string, reactionType: ReactionType) => {
    if (!currentUser) return;
    const updated = await dataStore.toggleReaction(postId, currentUser.id, reactionType, currentUser);
    if (updated) {
      setPosts(posts.map((p) => (p.id === postId ? { ...updated } : p)));
    }
  };

  const handleAddComment = async (postId: string, content: string, imageUrl?: string) => {
    if (!currentUser) return;
    const updated = await dataStore.addComment(postId, currentUser.id, content, currentUser, imageUrl);
    if (updated) {
      setPosts(posts.map((p) => (p.id === postId ? { ...updated } : p)));
      showToast('Comment posted!');
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    const updated = await dataStore.deleteComment(postId, commentId);
    if (updated) {
      setPosts(posts.map((p) => (p.id === postId ? { ...updated } : p)));
      showToast('Comment deleted');
    }
  };

  const handleDeletePost = async (postId: string) => {
    await dataStore.deletePost(postId);
    setPosts(posts.filter((p) => p.id !== postId));
    showToast('Post removed');
  };

  // Story actions
  const handleCreateStory = async (mediaUrl: string, caption?: string) => {
    if (!currentUser) return;
    const created = await dataStore.createStory(currentUser.id, mediaUrl, caption, currentUser);
    setStories([created, ...stories]);
    showToast('Story shared with your friends!');
  };

  // Groups actions
  const handleCreateGroup = async (name: string, description: string, coverUrl?: string) => {
    if (!currentUser) return;
    const created = await dataStore.createGroup(name, description, currentUser.id, coverUrl);
    setGroups([created, ...groups]);
    showToast(`Group "${name}" created!`);
  };

  const handleToggleGroupMembership = async (groupId: string) => {
    const updated = await dataStore.toggleGroupMembership(groupId);
    setGroups([...updated]);
    showToast('Updated group membership');
  };

  // Friends actions
  const handleAcceptRequest = async (requestId: string) => {
    if (!currentUser) return;
    await dataStore.acceptFriendRequest(requestId, currentUser);
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    const notifs = await dataStore.getNotifications(currentUser.id);
    setNotifications(notifs);
    showToast('Friend request accepted! You can now chat privately.');
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!currentUser) return;
    await dataStore.declineFriendRequest(requestId);
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast('Friend request removed');
  };

  const handleAddFriend = async (userId: string) => {
    if (!currentUser) return;
    await dataStore.sendFriendRequest(currentUser.id, userId, currentUser);
    showToast('Friend request sent! Notification delivered.');
  };

  // Profile actions
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const saved = await dataStore.updateProfile({ ...updated, id: currentUser.id });
    setCurrentUser(saved);
    localStorage.setItem('stepbook_current_user', JSON.stringify(saved));
    setAllUsers(allUsers.map((u) => (u.id === saved.id ? saved : u)));
    showToast('Profile updated!');
  };

  // Messenger actions
  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!currentUser || !activeChatPartner) return;
    const sent = await dataStore.sendMessage(currentUser.id, activeChatPartner.id, content, imageUrl, currentUser);
    setChatMessages((prev) => [...prev, sent]);
  };

  const handleSelectUser = (user: UserProfile) => {
    setViewingUser(user);
    setActivePage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMessenger = (user?: UserProfile) => {
    if (user) {
      setActiveChatPartner(user);
    } else {
      const partner = allUsers.find((u) => u.id !== currentUser?.id) || SEED_USERS[1];
      setActiveChatPartner(partner);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    await dataStore.markAllNotificationsRead(currentUser.id);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  // If not logged in, display Facebook Auth Screen (Sign Up / Sign In required)
  if (!currentUser) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const friendsList = allUsers.filter((u) => u.id !== currentUser.id && u.id !== 'seed-user-10');

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#18191a] text-gray-900 dark:text-gray-100 font-sans antialiased flex flex-col transition-colors duration-200">
      {/* Facebook Top Navigation Header */}
      <Header
        currentUser={currentUser}
        activePage={activePage}
        setActivePage={(p) => {
          if (p === 'profile') setViewingUser(currentUser);
          setActivePage(p);
        }}
        unreadNotifsCount={unreadNotifsCount}
        unreadMsgsCount={activeChatPartner ? 0 : 2}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenSqlModal={() => setShowSqlModal(true)}
        onOpenMessenger={handleOpenMessenger}
        onLogout={handleLogout}
        onSelectUser={handleSelectUser}
        allUsers={allUsers}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex justify-between w-full max-w-[1920px] mx-auto">
        {/* Left Sidebar (Desktop Only) */}
        {activePage === 'home' && (
          <LeftSidebar
            currentUser={currentUser}
            activePage={activePage}
            setActivePage={setActivePage}
            onSelectUser={handleSelectUser}
            onOpenMessenger={handleOpenMessenger}
          />
        )}

        {/* Center Main Feed / Current Page */}
        <main
          className={`flex-1 min-w-0 py-3 sm:py-4 px-2 sm:px-4 ${
            activePage === 'home' ? 'max-w-2xl mx-auto' : 'w-full'
          }`}
        >
          {activePage === 'home' && (
            <>
              {/* Stories Carousel */}
              <StoriesRow
                stories={stories}
                currentUser={currentUser}
                onCreateStory={handleCreateStory}
              />

              {/* Create Post Box */}
              <CreatePostBox
                currentUser={currentUser}
                onCreatePost={handleCreatePost}
              />

              {/* Feed Posts */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onToggleReaction={handleToggleReaction}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                    onDeletePost={handleDeletePost}
                    onSelectUser={handleSelectUser}
                  />
                ))}
              </div>
            </>
          )}

          {activePage === 'friends' && (
            <FriendsPage
              friendRequests={friendRequests}
              friendsList={friendsList}
              allUsers={allUsers}
              currentUser={currentUser}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onAddFriend={handleAddFriend}
              onOpenChatWith={(u) => setActiveChatPartner(u)}
              onSelectUser={handleSelectUser}
            />
          )}

          {activePage === 'groups' && (
            <GroupsPage
              groups={groups}
              currentUser={currentUser}
              onCreateGroup={handleCreateGroup}
              onToggleMembership={handleToggleGroupMembership}
            />
          )}

          {activePage === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              currentUser={currentUser}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onSelectUser={handleSelectUser}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onOpenChatWith={(u) => setActiveChatPartner(u)}
            />
          )}

          {activePage === 'profile' && (
            <ProfilePage
              profileUser={viewingUser || currentUser}
              currentUser={currentUser}
              posts={posts}
              allUsers={allUsers}
              friendsList={friendsList}
              friendRequests={friendRequests}
              onUpdateProfile={handleUpdateProfile}
              onCreatePost={handleCreatePost}
              onToggleReaction={handleToggleReaction}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onDeletePost={handleDeletePost}
              onOpenChatWith={(u) => setActiveChatPartner(u)}
              onSelectUser={handleSelectUser}
              onAddFriend={handleAddFriend}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
            />
          )}
        </main>

        {/* Right Sidebar (Online contacts, birthdays, ads) */}
        {activePage === 'home' && (
          <RightSidebar
            contacts={allUsers}
            currentUser={currentUser}
            onOpenChatWith={(u) => setActiveChatPartner(u)}
            onSelectUser={handleSelectUser}
          />
        )}
      </div>

      {/* Floating Messenger Window */}
      {activeChatPartner && (
        <FloatingChat
          partner={activeChatPartner}
          currentUser={currentUser}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          onClose={() => setActiveChatPartner(null)}
        />
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden sticky bottom-0 z-40 w-full bg-white dark:bg-[#242526] border-t border-gray-200 dark:border-[#393a3b] px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActivePage('home')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer ${
            activePage === 'home' ? 'text-[#1877F2]' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        <button
          onClick={() => setActivePage('friends')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer ${
            activePage === 'friends' ? 'text-[#1877F2]' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Friends</span>
        </button>

        <button
          onClick={() => setActivePage('groups')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer ${
            activePage === 'groups' ? 'text-[#1877F2]' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Groups</span>
        </button>

        <button
          onClick={() => setActivePage('notifications')}
          className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer ${
            activePage === 'notifications' ? 'text-[#1877F2]' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500" />
          )}
          <span className="text-[10px] font-bold mt-0.5">Alerts</span>
        </button>

        <button
          onClick={() => {
            setViewingUser(currentUser);
            setActivePage('profile');
          }}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer ${
            activePage === 'profile' && viewingUser?.id === currentUser.id
              ? 'text-[#1877F2]'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <img
            src={
              currentUser.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`
            }
            alt="Profile"
            className="w-5 h-5 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </button>
      </nav>

      {/* SQL Schema Modal for Supabase inspection */}
      {showSqlModal && <SqlSchemaModal onClose={() => setShowSqlModal(false)} />}

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-gray-900/90 text-white text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
