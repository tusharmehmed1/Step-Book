import React, { useState, useRef, useEffect } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  Bookmark,
  Trash2,
  Link as LinkIcon,
  Smile,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  MapPin,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PostItem, UserProfile, ReactionType } from '../types';
import { FB_REACTIONS } from '../lib/mockData';

interface PostCardProps {
  post: PostItem;
  currentUser: UserProfile;
  onToggleReaction: (postId: string, reactionType: ReactionType) => Promise<void>;
  onAddComment: (postId: string, content: string, imageUrl?: string) => Promise<void>;
  onDeleteComment: (postId: string, commentId: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onSelectUser: (user: UserProfile) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onToggleReaction,
  onAddComment,
  onDeleteComment,
  onDeletePost,
  onSelectUser,
}) => {
  const [showReactionsDock, setShowReactionsDock] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const author = post.user || currentUser;
  const isMine = post.user_id === currentUser.id;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnterLike = () => {
    hoverTimerRef.current = setTimeout(() => {
      setShowReactionsDock(true);
    }, 250);
  };

  const handleMouseLeaveLike = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setShowReactionsDock(false);
  };

  const handleSelectReaction = async (reactionType: ReactionType) => {
    setShowReactionsDock(false);
    await onToggleReaction(post.id, reactionType);
  };

  const handleQuickLike = async () => {
    const nextType: ReactionType = post.user_reaction ? post.user_reaction : 'like';
    await onToggleReaction(post.id, nextType);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment(post.id, commentText.trim());
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Reactions grouping calculation
  const totalReactions = post.reactions?.length || 0;
  const uniqueReactionTypes = Array.from(
    new Set(post.reactions?.map((r) => r.reaction_type) || [])
  );

  const activeReactionConfig = FB_REACTIONS.find((r) => r.type === post.user_reaction);

  // Time format
  const formatTimeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <article className="bg-white dark:bg-[#242526] rounded-2xl shadow-xs border border-gray-200 dark:border-[#393a3b] mb-4 overflow-hidden transition-colors">
      {/* Post Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectUser(author)}
            className="w-10 h-10 rounded-full overflow-hidden shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <img
              src={author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.id}`}
              alt={author.full_name}
              className="w-full h-full object-cover"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onSelectUser(author)}
                className="font-bold text-sm text-gray-900 dark:text-white hover:underline cursor-pointer flex items-center gap-1"
              >
                {author.full_name}
                {author.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 inline" />
                )}
              </button>
              {post.feeling && (
                <span className="text-gray-500 dark:text-gray-400 text-xs font-normal">
                  is feeling {post.feeling.emoji}{' '}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {post.feeling.label}
                  </span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTimeAgo(post.created_at)}</span>
              <span>·</span>
              {post.privacy === 'only_me' ? (
                <Lock className="w-3 h-3" />
              ) : post.privacy === 'friends' ? (
                <Users className="w-3 h-3" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              {post.location && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
                    <MapPin className="w-3 h-3" /> {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3-Dots Options Menu */}
        <div ref={optionsMenuRef} className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptionsMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-gray-200 dark:border-[#393a3b] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  handleShare();
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-xs font-semibold text-gray-700 dark:text-gray-200 text-left transition-colors"
              >
                <Bookmark className="w-4 h-4 text-purple-500" />
                <span>Save Post</span>
              </button>
              <button
                onClick={() => {
                  handleShare();
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-xs font-semibold text-gray-700 dark:text-gray-200 text-left transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-blue-500" />
                <span>Copy Link</span>
              </button>
              {isMine && (
                <button
                  onClick={() => {
                    onDeletePost(post.id);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold text-red-600 dark:text-red-400 text-left transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.bg_gradient ? (
        <div className={`w-full ${post.bg_gradient}`}>
          <p className="max-w-md mx-auto">{post.content}</p>
        </div>
      ) : (
        <>
          {post.content && (
            <div className="px-3 sm:px-4 pb-3 text-sm sm:text-[15px] text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line">
              {post.content.split(' ').map((word, i) => {
                if (word.startsWith('#')) {
                  return (
                    <span key={i} className="text-[#1877F2] font-semibold hover:underline cursor-pointer">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </div>
          )}

          {/* Media Player / Image Display */}
          {post.image_url && (
            <div className="w-full bg-black/5 dark:bg-black/40 overflow-hidden flex items-center justify-center">
              <img
                src={post.image_url}
                alt="Post attachment"
                className="w-full max-h-[550px] object-cover hover:opacity-95 transition-opacity"
              />
            </div>
          )}

          {post.video_url && (
            <div className="w-full bg-black flex items-center justify-center">
              <video
                src={post.video_url}
                controls
                playsInline
                className="w-full max-h-[500px]"
              />
            </div>
          )}
        </>
      )}

      {/* Stats Bar: Reactions Count + Comments Count */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#393a3b]">
        {/* Left: Reaction Emojis Stack & Number */}
        <div className="flex items-center gap-1.5">
          {totalReactions > 0 ? (
            <div className="flex items-center -space-x-1">
              {uniqueReactionTypes.slice(0, 3).map((type) => {
                const rConf = FB_REACTIONS.find((r) => r.type === type);
                return (
                  <span
                    key={type}
                    className="w-5 h-5 rounded-full bg-white dark:bg-[#242526] flex items-center justify-center text-xs shadow-xs"
                    title={rConf?.label}
                  >
                    {rConf?.emoji || '👍'}
                  </span>
                );
              })}
              <span className="ml-1.5 font-medium hover:underline cursor-pointer">
                {post.user_reaction
                  ? totalReactions === 1
                    ? `You reacted`
                    : `You and ${totalReactions - 1} other${totalReactions > 2 ? 's' : ''}`
                  : `${totalReactions}`}
              </span>
            </div>
          ) : (
            <span>Be the first to react</span>
          )}
        </div>

        {/* Right: Comments Count & Shares Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline cursor-pointer font-medium"
          >
            {post.comments?.length || 0} comments
          </button>
          {post.shares_count ? (
            <span className="font-medium">{post.shares_count} shares</span>
          ) : null}
        </div>
      </div>

      {/* Actions Row: Like, Comment, Share */}
      <div className="px-2 py-1 flex items-center justify-between relative border-b border-gray-100 dark:border-[#393a3b]">
        {/* Floating Facebook Reactions Hover Dock */}
        {showReactionsDock && (
          <div
            onMouseEnter={() => setShowReactionsDock(true)}
            onMouseLeave={handleMouseLeaveLike}
            className="absolute -top-12 left-2 z-40 bg-white dark:bg-[#242526] rounded-full px-2 py-1 shadow-2xl border border-gray-200 dark:border-[#393a3b] flex items-center gap-1 animate-in zoom-in-90 slide-in-from-bottom-2 duration-150"
          >
            {FB_REACTIONS.map((r) => (
              <button
                key={r.type}
                onClick={() => handleSelectReaction(r.type)}
                className="w-9 h-9 rounded-full hover:scale-130 transition-transform flex items-center justify-center text-2xl hover:-translate-y-1 duration-150 cursor-pointer"
                title={r.label}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}

        {/* Like Button */}
        <div
          className="flex-1 relative"
          onMouseEnter={handleMouseEnterLike}
          onMouseLeave={handleMouseLeaveLike}
        >
          <button
            onClick={handleQuickLike}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeReactionConfig
                ? activeReactionConfig.bg
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
            }`}
          >
            {activeReactionConfig ? (
              <span className="text-base">{activeReactionConfig.emoji}</span>
            ) : (
              <ThumbsUp className="w-5 h-5" />
            )}
            <span>{activeReactionConfig ? activeReactionConfig.label : 'Like'}</span>
          </button>
        </div>

        {/* Comment Button */}
        <button
          onClick={() => {
            setShowComments(true);
            setTimeout(() => commentInputRef.current?.focus(), 150);
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-3 sm:p-4 bg-gray-50/50 dark:bg-[#1c1d1e]/50 space-y-3">
          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
              alt={currentUser.full_name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-[#3a3b3c] rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="p-1 rounded-full text-[#1877F2] hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {post.comments.map((comment) => {
                const cUser = comment.user || currentUser;
                const canDelete = comment.user_id === currentUser.id || isMine;

                return (
                  <div key={comment.id} className="flex gap-2.5 group/c">
                    <img
                      src={cUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cUser.id}`}
                      alt={cUser.full_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="inline-block bg-gray-100 dark:bg-[#3a3b3c] rounded-2xl px-3.5 py-2 max-w-full">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-xs text-gray-900 dark:text-white hover:underline cursor-pointer">
                            {cUser.full_name}
                          </span>
                          {canDelete && (
                            <button
                              onClick={() => onDeleteComment(post.id, comment.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover/c:opacity-100 transition-opacity text-xs"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 mt-0.5 whitespace-pre-wrap break-words">
                          {comment.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 ml-2 font-semibold">
                        <button className="hover:underline cursor-pointer">Like</button>
                        <span>·</span>
                        <button className="hover:underline cursor-pointer">Reply</button>
                        <span>·</span>
                        <span>{formatTimeAgo(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              No comments yet. Start the conversation!
            </div>
          )}
        </div>
      )}
    </article>
  );
};
