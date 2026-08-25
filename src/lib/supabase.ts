import { createClient } from '@supabase/supabase-js';
import { UserProfile, PostItem, StoryItem, GroupItem, FriendShip, DirectMessage, NotificationItem, ReactionType } from '../types';
import { SEED_USERS, SEED_POSTS, SEED_STORIES, SEED_GROUPS } from './mockData';

export const SUPABASE_URL = 'https://cqrsyssoylaisqvmfqam.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcnN5c3NveWxhaXNxdm1mcWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MjE3MTksImV4cCI6MjEwMzE5NzcxOX0.ocA1gV4Np2xLQ_P9Co0VlzSSnjL6p0nQZYpdhtih6ho';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage keys for offline/fallback caching
const STORAGE_KEYS = {
  POSTS: 'stepbook_posts_cache',
  STORIES: 'stepbook_stories_cache',
  GROUPS: 'stepbook_groups_cache',
  FRIENDS: 'stepbook_friends_cache',
  NOTIFICATIONS: 'stepbook_notifications_cache',
  MESSAGES: 'stepbook_messages_cache',
  CURRENT_USER: 'stepbook_current_user',
  PROFILES: 'stepbook_profiles_cache',
};

// Initialize cache if empty
function getCache<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setCache<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const dataStore = {
  // Profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (!error && data) return data as UserProfile;
    } catch {
      // ignore
    }
    const profiles = getCache<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_USERS);
    return profiles.find((p) => p.id === userId) || null;
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data && data.length > 0) {
        setCache(STORAGE_KEYS.PROFILES, data);
        return data as UserProfile[];
      }
    } catch {
      // ignore
    }
    return getCache<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_USERS);
  },

  async updateProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
    try {
      const { data, error } = await supabase.from('profiles').upsert(profile).select().maybeSingle();
      if (!error && data) {
        return data as UserProfile;
      }
    } catch {
      // ignore
    }
    // Update local cache
    const profiles = getCache<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_USERS);
    const idx = profiles.findIndex((p) => p.id === profile.id);
    let updated: UserProfile;
    if (idx >= 0) {
      updated = { ...profiles[idx], ...profile };
      profiles[idx] = updated;
    } else {
      updated = {
        id: profile.id,
        full_name: profile.full_name || 'User',
        ...profile,
      };
      profiles.push(updated);
    }
    setCache(STORAGE_KEYS.PROFILES, profiles);
    return updated;
  },

  // Posts
  async getPosts(): Promise<PostItem[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, reactions(*), comments(*)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data && data.length > 0) {
        setCache(STORAGE_KEYS.POSTS, data);
        return data as PostItem[];
      }
    } catch {
      // fallback
    }
    return getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
  },

  async createPost(newPost: Omit<PostItem, 'id' | 'created_at'>): Promise<PostItem> {
    const postObj: PostItem = {
      ...newPost,
      id: 'post_' + Date.now(),
      created_at: new Date().toISOString(),
      reactions: [],
      comments: [],
      shares_count: 0,
    };

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: newPost.user_id,
          content: newPost.content,
          image_url: newPost.image_url,
          video_url: newPost.video_url,
          location: newPost.location,
          privacy: newPost.privacy || 'public',
          bg_gradient: newPost.bg_gradient,
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        postObj.id = data.id;
      }
    } catch {
      // ignore
    }

    const posts = getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
    posts.unshift(postObj);
    setCache(STORAGE_KEYS.POSTS, posts);
    return postObj;
  },

  async deletePost(postId: string): Promise<boolean> {
    try {
      await supabase.from('posts').delete().eq('id', postId);
    } catch {
      // ignore
    }
    const posts = getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
    const filtered = posts.filter((p) => p.id !== postId);
    setCache(STORAGE_KEYS.POSTS, filtered);
    return true;
  },

  // Reactions
  async toggleReaction(postId: string, userId: string, reactionType: ReactionType, userProfile?: UserProfile): Promise<PostItem | null> {
    try {
      const { data: existing } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (existing && existing.length > 0) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
      } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: userId, type: reactionType });
      }
    } catch {
      // ignore
    }

    const posts = getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    if (!post.reactions) post.reactions = [];
    const existingIdx = post.reactions.findIndex((r) => r.user_id === userId);

    if (existingIdx >= 0) {
      const currentReaction = post.reactions[existingIdx].reaction_type;
      if (currentReaction === reactionType) {
        // Remove reaction
        post.reactions.splice(existingIdx, 1);
        post.user_reaction = null;
      } else {
        // Change reaction type
        post.reactions[existingIdx].reaction_type = reactionType;
        post.user_reaction = reactionType;
      }
    } else {
      // Add new reaction
      post.reactions.push({
        id: 'r_' + Date.now(),
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType,
        user: userProfile,
      });
      post.user_reaction = reactionType;
    }

    setCache(STORAGE_KEYS.POSTS, posts);
    return post;
  },

  // Comments
  async addComment(postId: string, userId: string, content: string, userProfile?: UserProfile, imageUrl?: string): Promise<PostItem | null> {
    try {
      await supabase.from('comments').insert({
        post_id: postId,
        user_id: userId,
        content: content,
      });
    } catch {
      // ignore
    }

    const posts = getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
    const post = posts.find((p) => p.id === postId);
    if (!post) return null;

    if (!post.comments) post.comments = [];
    post.comments.push({
      id: 'c_' + Date.now(),
      post_id: postId,
      user_id: userId,
      content,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
      user: userProfile,
      likes_count: 0,
      user_liked: false,
    });

    setCache(STORAGE_KEYS.POSTS, posts);
    return post;
  },

  async deleteComment(postId: string, commentId: string): Promise<PostItem | null> {
    try {
      await supabase.from('comments').delete().eq('id', commentId);
    } catch {
      // ignore
    }
    const posts = getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.comments) return null;
    post.comments = post.comments.filter((c) => c.id !== commentId);
    setCache(STORAGE_KEYS.POSTS, posts);
    return post;
  },

  // Stories
  async getStories(): Promise<StoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setCache(STORAGE_KEYS.STORIES, data);
        return data as StoryItem[];
      }
    } catch {
      // ignore
    }
    return getCache<StoryItem[]>(STORAGE_KEYS.STORIES, SEED_STORIES);
  },

  async createStory(userId: string, mediaUrl: string, caption?: string, userProfile?: UserProfile): Promise<StoryItem> {
    const story: StoryItem = {
      id: 'story_' + Date.now(),
      user_id: userId,
      media_url: mediaUrl,
      caption,
      created_at: new Date().toISOString(),
      user: userProfile,
    };

    try {
      await supabase.from('stories').insert({
        user_id: userId,
        image_url: mediaUrl,
        caption,
      });
    } catch {
      // ignore
    }

    const stories = getCache<StoryItem[]>(STORAGE_KEYS.STORIES, SEED_STORIES);
    stories.unshift(story);
    setCache(STORAGE_KEYS.STORIES, stories);
    return story;
  },

  // Groups
  async getGroups(): Promise<GroupItem[]> {
    try {
      const { data, error } = await supabase.from('groups').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setCache(STORAGE_KEYS.GROUPS, data);
        return data as GroupItem[];
      }
    } catch {
      // ignore
    }
    return getCache<GroupItem[]>(STORAGE_KEYS.GROUPS, SEED_GROUPS);
  },

  async createGroup(name: string, description: string, userId: string, coverUrl?: string): Promise<GroupItem> {
    const grp: GroupItem = {
      id: 'grp_' + Date.now(),
      name,
      description,
      cover_url: coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
      privacy: 'public',
      created_by: userId,
      members_count: 1,
      is_member: true,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('groups').insert({
        name,
        description,
        cover_url: grp.cover_url,
        created_by: userId,
      });
    } catch {
      // ignore
    }

    const groups = getCache<GroupItem[]>(STORAGE_KEYS.GROUPS, SEED_GROUPS);
    groups.unshift(grp);
    setCache(STORAGE_KEYS.GROUPS, groups);
    return grp;
  },

  async toggleGroupMembership(groupId: string): Promise<GroupItem[]> {
    const groups = getCache<GroupItem[]>(STORAGE_KEYS.GROUPS, SEED_GROUPS);
    const grp = groups.find((g) => g.id === groupId);
    if (grp) {
      grp.is_member = !grp.is_member;
      grp.members_count += grp.is_member ? 1 : -1;
      setCache(STORAGE_KEYS.GROUPS, groups);
    }
    return groups;
  },

  // Notifications
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as NotificationItem[];
      }
    } catch {
      // ignore
    }
    return getCache<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif_1',
        user_id: userId,
        type: 'like',
        from_user_id: 'user_sarah',
        content: 'loved your photo post.',
        read: false,
        created_at: new Date(Date.now() - 10 * 60000).toISOString(),
        from_user: SEED_USERS[1],
      },
      {
        id: 'notif_2',
        user_id: userId,
        type: 'comment',
        from_user_id: 'user_alex',
        content: 'commented: "Awesome progress on StepBook!"',
        read: false,
        created_at: new Date(Date.now() - 45 * 60000).toISOString(),
        from_user: SEED_USERS[2],
      },
      {
        id: 'notif_3',
        user_id: userId,
        type: 'friend_request',
        from_user_id: 'user_aisha',
        content: 'sent you a friend request.',
        read: true,
        created_at: new Date(Date.now() - 120 * 60000).toISOString(),
        from_user: SEED_USERS[3],
      },
    ]);
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    try {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
    } catch {
      // ignore
    }
    const notifs = getCache<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.forEach((n) => (n.read = true));
    setCache(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Friends & Friend Requests
  async getFriendRequests(userId: string): Promise<FriendShip[]> {
    return [
      {
        id: 'req_1',
        user_id: 'user_aisha',
        friend_id: userId,
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        friend_profile: SEED_USERS[3],
        mutual_count: 7,
      },
      {
        id: 'req_2',
        user_id: 'user_zayan',
        friend_id: userId,
        status: 'pending',
        created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
        friend_profile: SEED_USERS[4],
        mutual_count: 12,
      },
    ];
  },

  // Direct Messages
  async getMessages(userId: string, partnerId: string): Promise<DirectMessage[]> {
    const key = `${STORAGE_KEYS.MESSAGES}_${[userId, partnerId].sort().join('_')}`;
    const cached = getCache<DirectMessage[]>(key, [
      {
        id: 'm1',
        sender_id: partnerId,
        receiver_id: userId,
        content: 'Hey there! How is the new StepBook update coming along?',
        read: true,
        created_at: new Date(Date.now() - 40 * 60000).toISOString(),
      },
      {
        id: 'm2',
        sender_id: userId,
        receiver_id: partnerId,
        content: 'Hey! It is going great, the Facebook UI and Supabase integration are looking super clean 🚀',
        read: true,
        created_at: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        id: 'm3',
        sender_id: partnerId,
        receiver_id: userId,
        content: 'Awesome! Can not wait to share it with everyone 👍',
        read: true,
        created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ]);
    return cached;
  },

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<DirectMessage> {
    const msg: DirectMessage = {
      id: 'msg_' + Date.now(),
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      read: false,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('messages').insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      });
    } catch {
      // ignore
    }

    const key = `${STORAGE_KEYS.MESSAGES}_${[senderId, receiverId].sort().join('_')}`;
    const msgs = getCache<DirectMessage[]>(key, []);
    msgs.push(msg);
    setCache(key, msgs);
    return msg;
  },
};
