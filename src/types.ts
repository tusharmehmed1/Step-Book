export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  work?: string;
  education?: string;
  location?: string;
  relationship?: string;
  website?: string;
  created_at?: string;
  verified?: boolean;
}

export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at?: string;
  user?: UserProfile;
}

export interface CommentItem {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user?: UserProfile;
  likes_count?: number;
  user_liked?: boolean;
}

export interface PostItem {
  id: string;
  user_id: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  feeling?: { emoji: string; label: string };
  location?: string;
  privacy?: 'public' | 'friends' | 'only_me';
  bg_gradient?: string;
  created_at: string;
  user?: UserProfile;
  reactions?: PostReaction[];
  user_reaction?: ReactionType | null;
  comments?: CommentItem[];
  shares_count?: number;
  group_id?: string;
  group_name?: string;
}

export interface StoryItem {
  id: string;
  user_id: string;
  media_url: string;
  media_type?: 'image' | 'video';
  caption?: string;
  created_at: string;
  user?: UserProfile;
  viewed?: boolean;
}

export interface GroupItem {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  avatar_url?: string;
  privacy: 'public' | 'private';
  created_by: string;
  members_count: number;
  is_member?: boolean;
  created_at: string;
}

export interface FriendShip {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  friend_profile?: UserProfile;
  mutual_count?: number;
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  image_url?: string;
  read: boolean;
  created_at: string;
}

export interface GlobalMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: UserProfile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'reaction' | 'friend_request' | 'friend_accept' | 'group_invite' | 'message';
  from_user_id: string;
  reference_id?: string;
  content: string;
  read: boolean;
  created_at: string;
  from_user?: UserProfile;
}

export type ActivePage = 'home' | 'friends' | 'groups' | 'messages' | 'notifications' | 'profile' | 'saved' | 'settings';
