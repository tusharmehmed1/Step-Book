import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Send,
  Image as ImageIcon,
  Smile,
  ThumbsUp,
  Phone,
  Video,
  Info,
  CheckCheck,
  Sparkles,
  Users,
  ChevronDown,
  Search,
} from 'lucide-react';
import { DirectMessage, UserProfile } from '../types';

interface FloatingChatProps {
  partner: UserProfile;
  currentUser: UserProfile;
  messages: DirectMessage[];
  onSendMessage: (content: string, imageUrl?: string) => Promise<void>;
  onClose: () => void;
  allUsers?: UserProfile[];
  onSwitchPartner?: (user: UserProfile) => void;
}

const QUICK_PROMPTS = ['👋 Hello!', 'How are you doing?', 'Are you free today?', 'Let’s catch up! ☕', '👍 Sounds good!'];

export const FloatingChat: React.FC<FloatingChatProps> = ({
  partner,
  currentUser,
  messages,
  onSendMessage,
  onClose,
  allUsers = [],
  onSwitchPartner,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [switchSearch, setSwitchSearch] = useState('');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setShowUserSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const content = text.trim();
    setText('');
    setIsSending(true);
    try {
      await onSendMessage(content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendQuick = async (prompt: string) => {
    await onSendMessage(prompt);
  };

  const handleSendLike = async () => {
    await onSendMessage('👍');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          await onSendMessage('Sent a photo 📷', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallNotice(`Calling ${partner.full_name} (${type === 'audio' ? 'Voice' : 'Video'})...`);
    setTimeout(() => {
      setCallNotice(null);
    }, 3500);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-14 sm:bottom-4 right-3 sm:right-16 z-50 animate-in slide-in-from-bottom-2 duration-150">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl overflow-hidden border-2 border-[#1877F2] hover:scale-105 transition-transform cursor-pointer bg-white dark:bg-[#242526]"
          title={`Chat with ${partner.full_name}`}
        >
          <img
            src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
            alt={partner.full_name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-14 sm:bottom-0 right-2 sm:right-16 z-50 w-[calc(100vw-1rem)] sm:w-92 max-w-[370px] h-[440px] sm:h-[480px] bg-white dark:bg-[#242526] rounded-2xl sm:rounded-t-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-150">
      {/* Messenger Header */}
      <div className="p-2.5 px-3 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between shadow-xs relative">
        <div ref={switcherRef} className="relative min-w-0 flex-1 mr-2">
          <button
            onClick={() => setShowUserSwitcher(!showUserSwitcher)}
            className="flex items-center gap-2 min-w-0 text-left hover:bg-gray-100 dark:hover:bg-[#3a3b3c] p-1 rounded-xl transition-colors cursor-pointer w-full group"
            title="Click to switch conversation or view all friends"
          >
            <div className="relative shrink-0">
              <img
                src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
                alt={partner.full_name}
                className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 group-hover:border-blue-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white dark:border-[#242526] rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate flex items-center gap-1">
                <span>{partner.full_name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-transform" />
              </h4>
              <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Active now • Tap to switch</span>
              </div>
            </div>
          </button>

          {/* Quick contact switcher popover inside Floating Chat */}
          {showUserSwitcher && allUsers.length > 0 && onSwitchPartner && (
            <div className="absolute left-0 top-12 w-68 sm:w-72 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-72 flex flex-col">
              <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 dark:border-[#393a3b] pb-2 mb-1">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Switch Friend to SMS
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  {allUsers.filter((u) => u.id !== currentUser.id).length} contacts
                </span>
              </div>

              <div className="relative px-1 mb-1">
                <input
                  type="text"
                  placeholder="Search contact..."
                  value={switchSearch}
                  onChange={(e) => setSwitchSearch(e.target.value)}
                  className="w-full bg-[#F0F2F5] dark:bg-[#3a3b3c] rounded-lg px-2.5 py-1 text-xs text-gray-900 dark:text-gray-100 focus:outline-hidden"
                />
              </div>

              <div className="overflow-y-auto space-y-1 flex-1">
                {allUsers
                  .filter(
                    (u) =>
                      u.id !== currentUser.id &&
                      u.full_name.toLowerCase().includes(switchSearch.toLowerCase().trim())
                  )
                  .map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchPartner(u);
                        setShowUserSwitcher(false);
                        setSwitchSearch('');
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                        u.id === partner.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                          alt={u.full_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white dark:border-[#242526] rounded-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{u.full_name}</div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {u.location || 'Active on StepBook'}
                        </div>
                      </div>
                      {u.id === partner.id && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-0.5 text-[#1877F2] shrink-0">
          <button
            onClick={() => handleStartCall('audio')}
            title="Start voice call"
            className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/50 text-[#1877F2] transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleStartCall('video')}
            title="Start video call"
            className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/50 text-[#1877F2] transition-colors cursor-pointer"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize"
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close chat"
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notice bar for calls or system alert */}
      {callNotice && (
        <div className="p-2 bg-blue-50 dark:bg-blue-950/80 border-b border-blue-200 dark:border-blue-800 text-xs text-[#1877F2] font-semibold text-center animate-in fade-in">
          {callNotice}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-gray-50/50 dark:bg-[#18191a]/50 text-xs sm:text-sm">
        {/* Chat Intro Card */}
        <div className="py-4 text-center space-y-1.5">
          <img
            src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
            alt={partner.full_name}
            className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-[#1877F2]"
          />
          <div className="font-bold text-gray-900 dark:text-white text-sm">
            {partner.full_name}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            StepBook Private Messenger · End-to-end connected
          </p>
        </div>

        {/* Message Items */}
        {messages.map((m) => {
          const isMe = m.sender_id === currentUser.id;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-1.5 group`}
            >
              {!isMe && (
                <img
                  src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover mb-0.5 shrink-0"
                />
              )}
              <div className="max-w-[78%] flex flex-col">
                <div
                  className={`px-3.5 py-2 rounded-2xl break-words text-xs sm:text-sm shadow-2xs ${
                    isMe
                      ? 'bg-[#1877F2] text-white rounded-br-xs'
                      : 'bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white border border-gray-200/80 dark:border-[#4a4b4c] rounded-bl-xs'
                  }`}
                >
                  {m.image_url && (
                    <img
                      src={m.image_url}
                      alt="Attachment"
                      className="rounded-xl max-h-48 object-cover mb-1.5 w-full"
                    />
                  )}
                  <span>{m.content}</span>
                </div>
                {isMe && (
                  <div className="text-[10px] text-gray-400 self-end mt-0.5 flex items-center gap-0.5 opacity-80">
                    <CheckCheck className="w-3 h-3 text-[#1877F2]" /> Sent
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-2 py-1.5 bg-white dark:bg-[#242526] border-t border-gray-100 dark:border-[#393a3b] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendQuick(prompt)}
            className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-[11px] font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Emoji Picker Drawer */}
      {showEmojiPicker && (
        <div className="p-2 bg-gray-50 dark:bg-[#1e1f20] border-t border-gray-200 dark:border-[#393a3b] grid grid-cols-8 gap-1.5 text-center text-lg">
          {['❤️', '🔥', '👏', '😂', '🎉', '😍', '✨', '☕', '🚀', '💯', '🌸', '🍕', '🙏', '🥳', '😎', '👍'].map(
            (emoji, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                {emoji}
              </button>
            )
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Message Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-2 border-t border-gray-200 dark:border-[#393a3b] bg-white dark:bg-[#242526] flex items-center gap-1.5"
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Insert Emoji"
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors cursor-pointer"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder={`Message ${partner.full_name.split(' ')[0]}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3.5 py-1.5 rounded-full bg-[#F0F2F5] dark:bg-[#3a3b3c] text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden"
        />

        {text.trim() ? (
          <button
            type="submit"
            disabled={isSending}
            className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-blue-600 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSendLike}
            title="Send Like"
            className="p-2 rounded-full text-[#1877F2] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
