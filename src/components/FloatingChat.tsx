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
} from 'lucide-react';
import { DirectMessage, UserProfile } from '../types';

interface FloatingChatProps {
  partner: UserProfile;
  currentUser: UserProfile;
  messages: DirectMessage[];
  onSendMessage: (content: string) => Promise<void>;
  onClose: () => void;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({
  partner,
  currentUser,
  messages,
  onSendMessage,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage(text.trim());
      setText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendLike = async () => {
    await onSendMessage('👍');
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-150">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative w-14 h-14 rounded-full shadow-2xl overflow-hidden border-2 border-[#1877F2] hover:scale-105 transition-transform cursor-pointer"
        >
          <img
            src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
            alt={partner.full_name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-4 sm:right-16 z-50 w-80 sm:w-88 h-96 bg-white dark:bg-[#242526] rounded-t-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-150">
      {/* Messenger Header */}
      <div className="p-2.5 px-3 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
              alt={partner.full_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white dark:border-[#242526] rounded-full" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {partner.full_name}
            </h4>
            <div className="text-[10px] text-green-600 dark:text-green-400 font-medium">
              Active now
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#1877F2]">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-500 dark:text-gray-300 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#3a3b3c] text-gray-500 dark:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50/50 dark:bg-[#18191a]/50 text-xs sm:text-sm">
        {messages.map((m) => {
          const isMe = m.sender_id === currentUser.id;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-1.5`}
            >
              {!isMe && (
                <img
                  src={partner.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.id}`}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover mb-0.5 shrink-0"
                />
              )}
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl break-words ${
                  isMe
                    ? 'bg-[#1877F2] text-white rounded-br-xs'
                    : 'bg-gray-200 dark:bg-[#3a3b3c] text-gray-900 dark:text-white rounded-bl-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <form
        onSubmit={handleSend}
        className="p-2 border-t border-gray-200 dark:border-[#393a3b] bg-white dark:bg-[#242526] flex items-center gap-1.5"
      >
        <input
          type="text"
          placeholder="Aa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-[#3a3b3c] text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden"
        />
        {text.trim() ? (
          <button
            type="submit"
            disabled={isSending}
            className="p-1.5 rounded-full text-[#1877F2] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSendLike}
            className="p-1.5 rounded-full text-[#1877F2] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
