import { createClient } from '@supabase/supabase-js';
import {
  UserProfile,
  PostItem,
  StoryItem,
  GroupItem,
  FriendShip,
  DirectMessage,
  NotificationItem,
  ReactionType,
} from '../types';

// Supabase credentials
export const SUPABASE_URL =
  ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_URL) ||
  'https://cqrsyssoylaisqvmfqam.supabase.co';
export const SUPABASE_ANON_KEY =
  ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxcnN5c3NveWxhaXNxdm1mcWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MjE3MTksImV4cCI6MjEwMzE5NzcxOX0.ocA1gV4Np2xLQ_P9Co0VlzSSnjL6p0nQZYpdhtih6ho';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Seed data
export const SEED_USERS: UserProfile[] = [
  {
    id: 'user_tushar',
    email: 'tushar@stepbook.com',
    full_name: 'Tushar Mehmed',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
    bio: 'Software engineer & tech enthusiast 🚀 Building modern apps on StepBook.',
    work: 'Lead Full Stack Engineer at TechCorp',
    education: 'BSc in Computer Science, BUET',
    location: 'Dhaka, Bangladesh',
    relationship: 'Single',
    website: 'https://stepbook.dev',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'user_sarah',
    email: 'sarah.khan@example.com',
    full_name: 'Sarah Khan',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    bio: 'Visual Designer & Photographer 🎨 Living one coffee at a time ☕',
    work: 'Creative Director at Studio Pixel',
    education: 'Fine Arts & Design, Dhaka University',
    location: 'Gulshan, Dhaka',
    relationship: 'In a relationship',
    website: 'https://sarahvisuals.com',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'user_alex',
    email: 'alex.rahman@example.com',
    full_name: 'Alex Rahman',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    bio: 'Startup founder, mountain hiker & travel blogger 🏔️🎒',
    work: 'Founder & CEO at NextGen Solutions',
    education: 'IBA, University of Dhaka',
    location: 'Banani, Dhaka',
    relationship: 'Married',
    website: 'https://nextgen.io',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    verified: false,
  },
  {
    id: 'user_aisha',
    email: 'aisha.chowdhury@example.com',
    full_name: 'Aisha Chowdhury',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80',
    bio: 'Doctor by profession, foodie by heart 🩺🧁 Loves traveling across the globe.',
    work: 'Medical Officer at Square Hospital',
    education: 'Dhaka Medical College',
    location: 'Dhanmondi, Dhaka',
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
    verified: true,
  },
  {
    id: 'user_zayan',
    email: 'zayan.islam@example.com',
    full_name: 'Zayan Islam',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    bio: 'AI researcher & open source advocate 🤖 Learning every single day.',
    work: 'Machine Learning Specialist',
    education: 'KUET Computer Engineering',
    location: 'Uttara, Dhaka',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    verified: false,
  },
  {
    id: 'user_maya',
    email: 'maya.noshin@example.com',
    full_name: 'Maya Noshin',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    cover_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
    bio: 'Journalist & Content Creator 🎙️ Telling untold stories from Bangladesh.',
    work: 'Senior Feature Writer',
    education: 'Mass Communication, DU',
    location: 'Mohakhali, Dhaka',
    created_at: new Date(Date.now() - 50 * 86400000).toISOString(),
    verified: false,
  },
];

export const SEED_STORIES: StoryItem[] = [
  {
    id: 'story_1',
    user_id: 'user_sarah',
    media_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    caption: 'Sunset vibes at Cox’s Bazar beach 🌊🏖️',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    user: SEED_USERS[1],
    viewed: false,
  },
  {
    id: 'story_2',
    user_id: 'user_alex',
    media_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    caption: 'Conquered Sajek Valley peak today! 🏔️✨',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    user: SEED_USERS[2],
    viewed: false,
  },
  {
    id: 'story_3',
    user_id: 'user_aisha',
    media_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    caption: 'Dinner with the best team tonight 🍕🎉',
    created_at: new Date(Date.now() - 7 * 3600000).toISOString(),
    user: SEED_USERS[3],
    viewed: false,
  },
  {
    id: 'story_4',
    user_id: 'user_zayan',
    media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    caption: 'Deep learning model training all night long 💻⚡',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    user: SEED_USERS[4],
    viewed: true,
  },
];

export const SEED_POSTS: PostItem[] = [
  {
    id: 'post_1',
    user_id: 'user_sarah',
    content: 'Just launched our brand new design showcase! In love with modern UI minimalism, vibrant color palettes, and responsive layouts. Let me know what you think! 🚀🎨✨',
    image_url: 'https://images.unsplash.com/photo-1542744094-3a31727220c3?w=1200&auto=format&fit=crop&q=80',
    location: 'Gulshan 2, Dhaka',
    privacy: 'public',
    created_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    user: SEED_USERS[1],
    shares_count: 14,
    reactions: [
      { id: 'r1', post_id: 'post_1', user_id: 'user_tushar', reaction_type: 'love', user: SEED_USERS[0] },
      { id: 'r2', post_id: 'post_1', user_id: 'user_alex', reaction_type: 'like', user: SEED_USERS[2] },
      { id: 'r3', post_id: 'post_1', user_id: 'user_aisha', reaction_type: 'care', user: SEED_USERS[3] },
    ],
    user_reaction: 'love',
    comments: [
      {
        id: 'c1',
        post_id: 'post_1',
        user_id: 'user_alex',
        content: 'This looks incredibly sleek Sarah! Great typography and spacing 🔥',
        created_at: new Date(Date.now() - 45 * 60000).toISOString(),
        user: SEED_USERS[2],
        likes_count: 4,
        user_liked: true,
      },
      {
        id: 'c2',
        post_id: 'post_1',
        user_id: 'user_tushar',
        content: 'Awesome design! The StepBook UI integration fits perfectly with this clean style.',
        created_at: new Date(Date.now() - 20 * 60000).toISOString(),
        user: SEED_USERS[0],
        likes_count: 2,
        user_liked: false,
      },
    ],
  },
  {
    id: 'post_2',
    user_id: 'user_alex',
    content: 'Morning trek through the cloud trails of Bandarban. Nothing beats fresh mountain air, birds chirping, and a hot cup of black tea at 3,000 feet! ⛰️🍵🌤️',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    location: 'Bandarban Hill Tracts',
    privacy: 'public',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    user: SEED_USERS[2],
    shares_count: 8,
    reactions: [
      { id: 'r4', post_id: 'post_2', user_id: 'user_sarah', reaction_type: 'wow', user: SEED_USERS[1] },
      { id: 'r5', post_id: 'post_2', user_id: 'user_aisha', reaction_type: 'like', user: SEED_USERS[3] },
      { id: 'r6', post_id: 'post_2', user_id: 'user_zayan', reaction_type: 'love', user: SEED_USERS[4] },
    ],
    user_reaction: null,
    comments: [
      {
        id: 'c3',
        post_id: 'post_2',
        user_id: 'user_aisha',
        content: 'Breathtaking view Alex! Which trail did you take?',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        user: SEED_USERS[3],
        likes_count: 1,
        user_liked: false,
      },
    ],
  },
  {
    id: 'post_3',
    user_id: 'user_aisha',
    content: 'Never stop learning and pushing your boundaries. Success is a marathon, not a sprint! 💡🩺✨',
    bg_gradient: 'from-pink-500 via-rose-500 to-amber-500',
    privacy: 'public',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    user: SEED_USERS[3],
    shares_count: 5,
    reactions: [
      { id: 'r7', post_id: 'post_3', user_id: 'user_tushar', reaction_type: 'like', user: SEED_USERS[0] },
      { id: 'r8', post_id: 'post_3', user_id: 'user_sarah', reaction_type: 'care', user: SEED_USERS[1] },
    ],
    user_reaction: 'like',
    comments: [],
  },
];

export const SEED_GROUPS: GroupItem[] = [
  {
    id: 'grp_1',
    name: 'JavaScript & React Developers BD',
    description: 'Community of front-end and full stack web developers in Bangladesh 🇧🇩',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    privacy: 'public',
    created_by: 'user_tushar',
    members_count: 14200,
    is_member: true,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString(),
  },
  {
    id: 'grp_2',
    name: 'Travel & Photography Enthusiasts',
    description: 'Share your travel stories, landscape photos, and route guides.',
    cover_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&auto=format&fit=crop&q=80',
    privacy: 'public',
    created_by: 'user_alex',
    members_count: 8900,
    is_member: true,
    created_at: new Date(Date.now() - 140 * 86400000).toISOString(),
  },
  {
    id: 'grp_3',
    name: 'UI/UX Designers Guild',
    description: 'Daily Figma discussions, design systems, and product reviews.',
    cover_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80',
    privacy: 'public',
    created_by: 'user_sarah',
    members_count: 5300,
    is_member: false,
    created_at: new Date(Date.now() - 80 * 86400000).toISOString(),
  },
];

export const SEED_FRIENDSHIPS: FriendShip[] = [
  {
    id: 'friendship_1',
    user_id: 'user_tushar',
    friend_id: 'user_sarah',
    status: 'accepted',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    friend_profile: SEED_USERS[1],
    mutual_count: 14,
  },
  {
    id: 'friendship_2',
    user_id: 'user_tushar',
    friend_id: 'user_alex',
    status: 'accepted',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    friend_profile: SEED_USERS[2],
    mutual_count: 9,
  },
  {
    id: 'req_1',
    user_id: 'user_aisha',
    friend_id: 'user_tushar',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    friend_profile: SEED_USERS[3],
    mutual_count: 7,
  },
  {
    id: 'req_2',
    user_id: 'user_zayan',
    friend_id: 'user_tushar',
    status: 'pending',
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    friend_profile: SEED_USERS[4],
    mutual_count: 12,
  },
];

// Local state keys
const STORAGE_KEYS = {
  POSTS: 'stepbook_posts_v3',
  STORIES: 'stepbook_stories_v3',
  GROUPS: 'stepbook_groups_v3',
  PROFILES: 'stepbook_profiles_v3',
  FRIENDSHIPS: 'stepbook_friendships_v3',
  NOTIFICATIONS: 'stepbook_notifications_v3',
  MESSAGES: 'stepbook_direct_messages_v3',
};

function getCache<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export const dataStore = {
  // Profiles
  async getProfiles(): Promise<UserProfile[]> {
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

  async getAllProfiles(): Promise<UserProfile[]> {
    return this.getProfiles();
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const all = await this.getProfiles();
    return all.find((u) => u.id === userId) || null;
  },

  async updateProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
    try {
      await supabase.from('profiles').upsert(profile);
    } catch {
      // ignore
    }
    const profiles = getCache<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_USERS);
    const idx = profiles.findIndex((p) => p.id === profile.id);
    let updated: UserProfile;
    if (idx >= 0) {
      updated = { ...profiles[idx], ...profile };
      profiles[idx] = updated;
    } else {
      updated = {
        id: profile.id,
        full_name: profile.full_name || 'New Member',
        avatar_url: profile.avatar_url,
        cover_url: profile.cover_url,
        bio: profile.bio || '',
        created_at: new Date().toISOString(),
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
        .select('*, user:profiles(*), comments(*, user:profiles(*)), likes(*, user:profiles(*))')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCache(STORAGE_KEYS.POSTS, data);
        return data as PostItem[];
      }
    } catch {
      // fallback
    }
    return getCache<PostItem[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
  },

  async createPost(newPost: Partial<PostItem>): Promise<PostItem> {
    const postObj: PostItem = {
      id: 'post_' + Date.now(),
      user_id: newPost.user_id || 'user_anon',
      content: newPost.content,
      image_url: newPost.image_url,
      video_url: newPost.video_url,
      feeling: newPost.feeling,
      location: newPost.location,
      privacy: newPost.privacy || 'public',
      bg_gradient: newPost.bg_gradient,
      group_id: newPost.group_id,
      group_name: newPost.group_name,
      created_at: new Date().toISOString(),
      user: newPost.user,
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

    // If it's a public post, send a notification to friends/active users
    if (postObj.privacy === 'public' && newPost.user) {
      const allProfiles = getCache<UserProfile[]>(STORAGE_KEYS.PROFILES, SEED_USERS);
      const otherUsers = allProfiles.filter((u) => u.id !== postObj.user_id);
      
      // Notify other active community members
      otherUsers.slice(0, 3).forEach((u) => {
        this.addNotification({
          id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          user_id: u.id,
          type: 'mention',
          from_user_id: postObj.user_id,
          content: `shared a new public post: "${(postObj.content || 'Photo update').slice(0, 30)}..."`,
          read: false,
          created_at: new Date().toISOString(),
          from_user: postObj.user,
          reference_id: postObj.id,
        });
      });
    }

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
        post.reactions.splice(existingIdx, 1);
        post.user_reaction = null;
      } else {
        post.reactions[existingIdx].reaction_type = reactionType;
        post.user_reaction = reactionType;
      }
    } else {
      post.reactions.push({
        id: 'r_' + Date.now(),
        post_id: postId,
        user_id: userId,
        reaction_type: reactionType,
        user: userProfile,
      });
      post.user_reaction = reactionType;

      // Add like notification to post author if not author
      if (post.user_id !== userId && userProfile) {
        this.addNotification({
          id: 'notif_' + Date.now(),
          user_id: post.user_id,
          type: 'reaction',
          from_user_id: userId,
          reference_id: postId,
          content: `reacted ${reactionType} to your post.`,
          read: false,
          created_at: new Date().toISOString(),
          from_user: userProfile,
        });
      }
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

    if (post.user_id !== userId && userProfile) {
      this.addNotification({
        id: 'notif_' + Date.now(),
        user_id: post.user_id,
        type: 'comment',
        from_user_id: userId,
        reference_id: postId,
        content: `commented: "${content.length > 30 ? content.slice(0, 30) + '...' : content}"`,
        read: false,
        created_at: new Date().toISOString(),
        from_user: userProfile,
      });
    }

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
    const stored = getCache<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, [
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
        read: false,
        created_at: new Date(Date.now() - 120 * 60000).toISOString(),
        from_user: SEED_USERS[3],
        reference_id: 'req_1',
      },
    ]);
    return stored.filter((n) => !n.user_id || n.user_id === userId);
  },

  addNotification(notif: NotificationItem): NotificationItem[] {
    const notifs = getCache<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.unshift(notif);
    setCache(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return notifs;
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    try {
      await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
    } catch {
      // ignore
    }
    const notifs = getCache<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifs.forEach((n) => {
      if (n.user_id === userId) n.read = true;
    });
    setCache(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  // Friends & Friendships
  async getAllFriendships(): Promise<FriendShip[]> {
    return getCache<FriendShip[]>(STORAGE_KEYS.FRIENDSHIPS, SEED_FRIENDSHIPS);
  },

  async getFriendRequests(userId: string): Promise<FriendShip[]> {
    const all = await this.getAllFriendships();
    return all.filter((f) => f.friend_id === userId && f.status === 'pending');
  },

  async getFriendsList(userId: string): Promise<UserProfile[]> {
    const all = await this.getAllFriendships();
    const profiles = await this.getProfiles();
    const accepted = all.filter((f) => (f.user_id === userId || f.friend_id === userId) && f.status === 'accepted');

    const friendIds = accepted.map((f) => (f.user_id === userId ? f.friend_id : f.user_id));
    return profiles.filter((p) => friendIds.includes(p.id));
  },

  async sendFriendRequest(
    param1: UserProfile | string,
    param2: string | UserProfile,
    param3?: UserProfile
  ): Promise<{ success: boolean; friendship: FriendShip }> {
    const senderId = typeof param1 === 'string' ? param1 : param1.id;
    const targetUserId = typeof param2 === 'string' ? param2 : param2.id;
    const senderProfile =
      typeof param1 === 'object'
        ? param1
        : param3 || (await this.getProfile(senderId)) || {
            id: senderId,
            full_name: 'StepBook User',
            email: 'user@example.com',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderId}`,
            created_at: new Date().toISOString(),
          };

    const all = await this.getAllFriendships();
    const existing = all.find(
      (f) =>
        (f.user_id === senderId && f.friend_id === targetUserId) ||
        (f.user_id === targetUserId && f.friend_id === senderId)
    );

    if (existing) {
      return { success: false, friendship: existing };
    }

    const newReq: FriendShip = {
      id: 'req_' + Date.now(),
      user_id: senderId,
      friend_id: targetUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
      friend_profile: senderProfile,
      mutual_count: Math.floor(Math.random() * 8) + 1,
    };

    all.push(newReq);
    setCache(STORAGE_KEYS.FRIENDSHIPS, all);

    // Create Notification for target user
    this.addNotification({
      id: 'notif_' + Date.now(),
      user_id: targetUserId,
      type: 'friend_request',
      from_user_id: senderId,
      content: 'sent you a friend request.',
      read: false,
      created_at: new Date().toISOString(),
      from_user: senderProfile,
      reference_id: newReq.id,
    });

    return { success: true, friendship: newReq };
  },

  async acceptFriendRequest(
    param1: string | UserProfile,
    param2?: string | UserProfile
  ): Promise<FriendShip | null> {
    const requestId = typeof param1 === 'string' ? param1 : (param2 as string);
    const receiver = typeof param1 === 'object' ? param1 : (param2 as UserProfile);

    const all = await this.getAllFriendships();
    const req = all.find((f) => f.id === requestId);
    if (!req) return null;

    req.status = 'accepted';
    setCache(STORAGE_KEYS.FRIENDSHIPS, all);

    // Notify the original sender that their request was accepted
    if (receiver) {
      this.addNotification({
        id: 'notif_' + Date.now(),
        user_id: req.user_id,
        type: 'friend_accept',
        from_user_id: receiver.id,
        content: 'accepted your friend request. You can now chat and see each other’s posts!',
        read: false,
        created_at: new Date().toISOString(),
        from_user: receiver,
        reference_id: req.id,
      });
    }

    return req;
  },

  async declineFriendRequest(requestId: string): Promise<boolean> {
    const all = await this.getAllFriendships();
    const filtered = all.filter((f) => f.id !== requestId);
    setCache(STORAGE_KEYS.FRIENDSHIPS, filtered);
    return true;
  },

  async cancelFriendRequest(senderId: string, targetUserId: string): Promise<boolean> {
    const all = await this.getAllFriendships();
    const filtered = all.filter(
      (f) => !(f.user_id === senderId && f.friend_id === targetUserId && f.status === 'pending')
    );
    setCache(STORAGE_KEYS.FRIENDSHIPS, filtered);
    return true;
  },

  // Direct Private 1-on-1 Messages
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
        content: 'Hey! It is going great, the real-time chatting and friend requests are working smoothly 🚀',
        read: true,
        created_at: new Date(Date.now() - 35 * 60000).toISOString(),
      },
      {
        id: 'm3',
        sender_id: partnerId,
        receiver_id: userId,
        content: 'Awesome! Can not wait to test it out with our friends 👍',
        read: true,
        created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      },
    ]);
    return cached;
  },

  async sendMessage(
    sender: UserProfile | string,
    receiverId: string,
    content: string,
    imageUrl?: string,
    senderProfile?: UserProfile
  ): Promise<DirectMessage> {
    const senderId = typeof sender === 'string' ? sender : sender.id;
    const fromUser = typeof sender === 'object' ? sender : senderProfile;

    const msg: DirectMessage = {
      id: 'msg_' + Date.now(),
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      image_url: imageUrl,
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

    // Create a message notification for the receiver
    this.addNotification({
      id: 'notif_' + Date.now(),
      user_id: receiverId,
      type: 'message',
      from_user_id: senderId,
      content: `sent you a private message: "${content.length > 28 ? content.slice(0, 28) + '...' : content}"`,
      read: false,
      created_at: new Date().toISOString(),
      from_user: fromUser,
      reference_id: senderId,
    });

    return msg;
  },
};
