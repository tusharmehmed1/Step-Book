import React, { useState, useRef } from 'react';
import {
  Video,
  Image as ImageIcon,
  Smile,
  MapPin,
  Globe,
  Users,
  Lock,
  X,
  Palette,
  Sparkles,
  ChevronDown,
  Upload,
} from 'lucide-react';
import { UserProfile, PostItem } from '../types';
import { FEELING_OPTIONS, POPULAR_LOCATIONS, POST_GRADIENTS } from '../lib/mockData';

interface CreatePostBoxProps {
  currentUser: UserProfile;
  onCreatePost: (newPost: {
    content?: string;
    image_url?: string;
    video_url?: string;
    feeling?: { emoji: string; label: string };
    location?: string;
    privacy?: 'public' | 'friends' | 'only_me';
    bg_gradient?: string;
  }) => Promise<void>;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({
  currentUser,
  onCreatePost,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<{ emoji: string; label: string } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedPrivacy, setSelectedPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [selectedGradient, setSelectedGradient] = useState<string>('');
  const [mediaPreview, setMediaPreview] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenWith = (type?: 'image' | 'video' | 'feeling' | 'location') => {
    setIsOpen(true);
    if (type === 'image' || type === 'video') {
      setTimeout(() => fileInputRef.current?.click(), 200);
    } else if (type === 'feeling') {
      setShowFeelingPicker(true);
    } else if (type === 'location') {
      setShowLocationPicker(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (ev) => {
        setMediaPreview({
          type: isVideo ? 'video' : 'image',
          url: ev.target?.result as string,
        });
        setSelectedGradient(''); // reset gradient if image uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaPreview && !selectedFeeling) return;

    setIsSubmitting(true);
    try {
      await onCreatePost({
        content: content.trim() || undefined,
        image_url: mediaPreview?.type === 'image' ? mediaPreview.url : undefined,
        video_url: mediaPreview?.type === 'video' ? mediaPreview.url : undefined,
        feeling: selectedFeeling || undefined,
        location: selectedLocation || undefined,
        privacy: selectedPrivacy,
        bg_gradient: selectedGradient || undefined,
      });

      // Reset
      setContent('');
      setMediaPreview(null);
      setSelectedFeeling(null);
      setSelectedLocation(null);
      setSelectedGradient('');
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLocations = locationSearch.trim()
    ? POPULAR_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(locationSearch.toLowerCase())
      )
    : POPULAR_LOCATIONS;

  return (
    <div className="bg-white dark:bg-[#242526] rounded-2xl p-3 sm:p-4 shadow-xs border border-gray-200 dark:border-[#393a3b] mb-4 transition-colors">
      {/* Top row: Avatar + Trigger Button */}
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-[#393a3b]">
        <img
          src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
          alt={currentUser.full_name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <button
          id="btn-open-create-post"
          onClick={() => handleOpenWith()}
          className="flex-1 bg-[#F0F2F5] dark:bg-[#3a3b3c] hover:bg-gray-200/80 dark:hover:bg-[#4e4f50] text-gray-500 dark:text-gray-400 font-normal text-left px-4 py-2.5 rounded-full text-sm sm:text-base transition-colors cursor-pointer"
        >
          What's on your mind, {currentUser.full_name.split(' ')[0]}?
        </button>
      </div>

      {/* Bottom row: Live Video, Photo, Feeling buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => handleOpenWith('video')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Video className="w-5 h-5 text-red-500" />
          <span className="hidden xs:inline">Live video</span>
        </button>

        <button
          id="btn-trigger-photo-video"
          onClick={() => handleOpenWith('image')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <ImageIcon className="w-5 h-5 text-green-500" />
          <span>Photo/video</span>
        </button>

        <button
          id="btn-trigger-feeling-activity"
          onClick={() => handleOpenWith('feeling')}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Smile className="w-5 h-5 text-amber-500" />
          <span>Feeling/activity</span>
        </button>
      </div>

      {/* Create Post Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div
            className="bg-white dark:bg-[#242526] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-[#393a3b] flex flex-col animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between sticky top-0 bg-white dark:bg-[#242526] z-10">
              <div className="w-8" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center">
                Create post
              </h3>
              <button
                id="btn-close-create-post-modal"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-500 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3 flex-1">
              {/* User info + Audience selector */}
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`}
                  alt={currentUser.full_name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                    <span>{currentUser.full_name}</span>
                    {selectedFeeling && (
                      <span className="text-gray-600 dark:text-gray-400 font-normal text-xs">
                        is feeling {selectedFeeling.emoji} <strong className="text-gray-900 dark:text-white font-semibold">{selectedFeeling.label}</strong>
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="text-gray-600 dark:text-gray-400 font-normal text-xs">
                        at <strong className="text-blue-600 dark:text-blue-400 font-semibold">{selectedLocation}</strong>
                      </span>
                    )}
                  </div>

                  {/* Privacy dropdown selector */}
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 dark:bg-[#3a3b3c] rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {selectedPrivacy === 'public' && <Globe className="w-3 h-3" />}
                    {selectedPrivacy === 'friends' && <Users className="w-3 h-3" />}
                    {selectedPrivacy === 'only_me' && <Lock className="w-3 h-3" />}
                    <select
                      value={selectedPrivacy}
                      onChange={(e) => setSelectedPrivacy(e.target.value as any)}
                      className="bg-transparent text-xs font-semibold focus:outline-hidden cursor-pointer"
                    >
                      <option value="public" className="dark:bg-[#242526]">Public</option>
                      <option value="friends" className="dark:bg-[#242526]">Friends</option>
                      <option value="only_me" className="dark:bg-[#242526]">Only me</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Area / Gradient Text Block */}
              <div className="relative">
                {selectedGradient ? (
                  <div className={`rounded-xl ${selectedGradient} relative`}>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={`What's on your mind, ${currentUser.full_name.split(' ')[0]}?`}
                      className="w-full bg-transparent text-center text-white placeholder-white/80 focus:outline-hidden resize-none font-bold text-xl drop-shadow-md"
                      rows={4}
                    />
                    <button
                      onClick={() => setSelectedGradient('')}
                      className="absolute top-2 right-2 p-1 bg-black/40 text-white rounded-full hover:bg-black/60"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <textarea
                    id="textarea-post-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`What's on your mind, ${currentUser.full_name.split(' ')[0]}?`}
                    className="w-full text-base sm:text-lg text-gray-900 dark:text-white placeholder-gray-500 bg-transparent focus:outline-hidden resize-none min-h-[100px]"
                    rows={4}
                  />
                )}
              </div>

              {/* Media Preview Box */}
              {mediaPreview && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black max-h-72 flex items-center justify-center group">
                  {mediaPreview.type === 'image' ? (
                    <img
                      src={mediaPreview.url}
                      alt="Upload preview"
                      className="max-h-72 w-full object-contain"
                    />
                  ) : (
                    <video
                      src={mediaPreview.url}
                      controls
                      className="max-h-72 w-full object-contain"
                    />
                  )}
                  <button
                    onClick={() => setMediaPreview(null)}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Gradient Theme Switcher */}
              {!mediaPreview && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <button
                    onClick={() => setShowGradientPicker(!showGradientPicker)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Palette className="w-4 h-4 text-purple-500" />
                    <span>Backgrounds</span>
                  </button>
                  {showGradientPicker &&
                    POST_GRADIENTS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGradient(g.value)}
                        className={`w-7 h-7 rounded-lg shrink-0 border-2 transition-transform hover:scale-110 ${
                          g.value || 'bg-gray-100 dark:bg-gray-800'
                        } ${selectedGradient === g.value ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                        title={g.label}
                      />
                    ))}
                </div>
              )}

              {/* Feelings Picker Popup */}
              {showFeelingPicker && (
                <div className="p-3 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      How are you feeling?
                    </span>
                    <button
                      onClick={() => setShowFeelingPicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
                    {FEELING_OPTIONS.map((f) => (
                      <button
                        key={f.label}
                        onClick={() => {
                          setSelectedFeeling(f);
                          setShowFeelingPicker(false);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                          selectedFeeling?.label === f.label
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <span className="text-lg">{f.emoji}</span>
                        <span className="truncate">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Picker Popup */}
              {showLocationPicker && (
                <div className="p-3 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Add Location
                    </span>
                    <button
                      onClick={() => setShowLocationPicker(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search city, venue or location..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#242526] text-xs text-gray-900 dark:text-white focus:outline-hidden mb-2"
                  />
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationPicker(false);
                        }}
                        className="w-full flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-left"
                      >
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to your post Bar */}
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-[#393a3b] rounded-xl bg-white dark:bg-[#242526] shadow-xs">
                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                  Add to your post
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Photo/Video"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 text-green-500" />
                  </button>
                  <button
                    onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                    title="Feeling/Activity"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                  >
                    <Smile className="w-5 h-5 text-amber-500" />
                  </button>
                  <button
                    onClick={() => setShowLocationPicker(!showLocationPicker)}
                    title="Location"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Modal Footer Submit */}
            <div className="p-4 border-t border-gray-200 dark:border-[#393a3b]">
              <button
                id="btn-submit-post"
                onClick={handleSubmit}
                disabled={isSubmitting || (!content.trim() && !mediaPreview && !selectedFeeling)}
                className="w-full py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Publishing...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
