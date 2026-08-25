import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight, X, Play, Pause, Heart, Send, Sparkles, Image as ImageIcon } from 'lucide-react';
import { StoryItem, UserProfile } from '../types';

interface StoriesRowProps {
  stories: StoryItem[];
  currentUser: UserProfile;
  onCreateStory: (mediaUrl: string, caption?: string) => Promise<void>;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({
  stories,
  currentUser,
  onCreateStory,
}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createImage, setCreateImage] = useState<string | null>(null);
  const [createCaption, setCreateCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;

  // Auto-progress story timer
  useEffect(() => {
    if (selectedStoryIndex === null || isPaused) return;

    const interval = 50; // update every 50ms
    const totalTime = 5000; // 5 seconds per story
    const step = (interval / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story or close
          if (selectedStoryIndex < stories.length - 1) {
            setSelectedStoryIndex(selectedStoryIndex + 1);
            return 0;
          } else {
            setSelectedStoryIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [selectedStoryIndex, isPaused, stories.length]);

  const handleOpenStory = (index: number) => {
    setSelectedStoryIndex(index);
    setProgress(0);
    setIsPaused(false);
  };

  const handleNextStory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedStoryIndex !== null && selectedStoryIndex < stories.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
      setProgress(0);
    } else {
      setSelectedStoryIndex(null);
    }
  };

  const handlePrevStory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCreateImage(ev.target?.result as string);
        setShowCreateModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishStory = async () => {
    if (!createImage) return;
    setIsUploading(true);
    try {
      await onCreateStory(createImage, createCaption);
      setShowCreateModal(false);
      setCreateImage(null);
      setCreateCaption('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="relative mb-4 group/row">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#3a3b3c] shadow-lg items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4e4f50] border border-gray-200 dark:border-gray-700 transition-all opacity-0 group-hover/row:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Stories List */}
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
        >
          {/* Create Story Card */}
          <div
            id="btn-create-story-card"
            onClick={() => fileInputRef.current?.click()}
            className="relative shrink-0 w-28 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="h-32 sm:h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
                alt={currentUser.full_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-16 bg-white dark:bg-[#242526] flex flex-col items-center justify-end pb-2">
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-[#1877F2] border-4 border-white dark:border-[#242526] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 font-bold" />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">
                Create Story
              </span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* User Stories Cards */}
          {stories.map((story, index) => {
            const user = story.user || currentUser;
            return (
              <div
                key={story.id}
                onClick={() => handleOpenStory(index)}
                className="relative shrink-0 w-28 sm:w-36 h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group select-none"
              >
                {/* Background Image */}
                <img
                  src={story.media_url}
                  alt={user.full_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

                {/* Creator Avatar with FB Blue Ring */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full p-0.5 bg-[#1877F2] ring-2 ring-white dark:ring-[#242526] shadow-md">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={user.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Creator Name & Caption */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <div className="text-xs font-bold text-white truncate drop-shadow-md">
                    {user.full_name}
                  </div>
                  {story.caption && (
                    <div className="text-[10px] text-gray-200 truncate mt-0.5 opacity-90">
                      {story.caption}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-[#3a3b3c] shadow-lg items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4e4f50] border border-gray-200 dark:border-gray-700 transition-all opacity-0 group-hover/row:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {selectedStoryIndex !== null && activeStory && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedStoryIndex(null)}
        >
          {/* Close Story Button */}
          <button
            onClick={() => setSelectedStoryIndex(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left / Right Nav Arrows */}
          <button
            onClick={handlePrevStory}
            disabled={selectedStoryIndex === 0}
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={handleNextStory}
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Story Container Card */}
          <div
            className="relative w-full max-w-sm sm:max-w-md h-[85vh] max-h-[750px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Progress Bar */}
            <div className="absolute top-0 inset-x-0 z-20 p-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex gap-1.5 mb-2.5">
                {stories.map((s, idx) => (
                  <div
                    key={s.id}
                    className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx < selectedStoryIndex
                            ? '100%'
                            : idx === selectedStoryIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story User Info Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      activeStory.user?.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeStory.user_id}`
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#1877F2]"
                  />
                  <div>
                    <div className="text-sm font-bold text-white drop-shadow-sm">
                      {activeStory.user?.full_name || 'User'}
                    </div>
                    <div className="text-[11px] text-gray-300">
                      {new Date(activeStory.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                {/* Pause/Play */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Story Media */}
            <div
              className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
              onClick={handleNextStory}
            >
              <img
                src={activeStory.media_url}
                alt="Story content"
                className="w-full h-full object-contain"
              />

              {activeStory.caption && (
                <div className="absolute bottom-20 inset-x-4 p-3 bg-black/60 backdrop-blur-md rounded-xl text-center text-white text-sm font-medium">
                  {activeStory.caption}
                </div>
              )}
            </div>

            {/* Bottom Interaction Bar */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
              <input
                type="text"
                placeholder={`Reply to ${activeStory.user?.full_name || 'story'}...`}
                className="flex-1 bg-white/20 border border-white/30 text-white placeholder-gray-300 rounded-full px-4 py-2 text-sm focus:outline-hidden focus:bg-white/30"
              />
              <button
                onClick={() => {
                  /* Like animation */
                }}
                className="p-2.5 rounded-full bg-white/20 hover:bg-red-500/80 text-white transition-colors"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
              <button className="p-2.5 rounded-full bg-[#1877F2] text-white hover:bg-blue-600 transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateModal && createImage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-[#393a3b] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Create Story Preview
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateImage(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="w-full h-72 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={createImage}
                  alt="Story preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Add a caption to your story..."
                  value={createCaption}
                  onChange={(e) => setCreateCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1877F2]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateImage(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handlePublishStory}
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  {isUploading ? (
                    'Sharing...'
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Share to Story
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
