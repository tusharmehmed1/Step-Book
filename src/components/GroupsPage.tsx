import React, { useState } from 'react';
import { Plus, Users, Globe, Lock, Check, Search, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GroupItem, UserProfile } from '../types';

interface GroupsPageProps {
  groups: GroupItem[];
  currentUser: UserProfile;
  onCreateGroup: (name: string, description: string, coverUrl?: string) => Promise<void>;
  onToggleMembership: (groupId: string) => Promise<void>;
}

export const GroupsPage: React.FC<GroupsPageProps> = ({
  groups,
  currentUser,
  onCreateGroup,
  onToggleMembership,
}) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'my_groups'>('discover');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myGroups = groups.filter((g) => g.is_member || g.created_by === currentUser.id);
  const discoverGroups = groups.filter((g) => !g.is_member && g.created_by !== currentUser.id);

  const displayedGroups = (activeTab === 'my_groups' ? myGroups : groups).filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateGroup(name.trim(), description.trim(), coverUrl.trim() || undefined);
      setName('');
      setDescription('');
      setCoverUrl('');
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#242526] p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-[#393a3b] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Groups</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Find communities of people with shared interests
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-create-group"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-sm shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Group
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-[#393a3b] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
            }`}
          >
            Discover All
          </button>
          <button
            onClick={() => setActiveTab('my_groups')}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              activeTab === 'my_groups'
                ? 'bg-[#1877F2] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
            }`}
          >
            Your Groups ({myGroups.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#393a3b] text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-[#242526] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#393a3b] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Cover Photo */}
              <div className="h-36 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                {group.cover_url && (
                  <img
                    src={group.cover_url}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1">
                  {group.privacy === 'public' ? (
                    <>
                      <Globe className="w-3 h-3" /> Public Group
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> Private Group
                    </>
                  )}
                </div>
              </div>

              {/* Group Body */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {group.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{group.members_count.toLocaleString()} members</span>
                </div>
                {group.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {group.description}
                  </p>
                )}
              </div>
            </div>

            {/* Group Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={() => onToggleMembership(group.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  group.is_member
                    ? 'bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    : 'bg-[#1877F2] hover:bg-blue-600 text-white'
                }`}
              >
                {group.is_member ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" /> Joined Group
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Join Group
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-[#393a3b] animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Create New Group
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangladesh Photography & Art"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1877F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="What is this group about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1877F2] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Cover Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#3a3b3c] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1877F2]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
