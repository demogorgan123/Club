import React, { useMemo, useState } from 'react';
import { Channel, Team, User, ChannelType } from '../types';
import { Hash, MessageSquare, ListTodo, AppWindow, Menu, Users, MessageCircle, Bell, Search } from 'lucide-react';
import { getTeamIcon } from '../constants';

interface HeaderProps {
  channel?: Channel;
  team?: Team;
  activeViewType: 'channel' | 'tasks' | 'apps' | 'calendar' | 'events';
  onViewChange: (viewType: any) => void;
  currentUser: User;
  users: User[];
  onToggleSidebar: () => void;
  onOpenMembersModal: () => void;
  onOpenProfileModal: () => void;
  notifications: any[];
  onOpenNotifications: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ channel, team, activeViewType, onViewChange, currentUser, users, onToggleSidebar, onOpenMembersModal, onOpenProfileModal, notifications, onOpenNotifications, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const membersToDisplay = useMemo(() => {
    if (activeViewType === 'calendar' || activeViewType === 'events') return users.slice(0, 5);
    if (!channel) return [];

    if (channel.type === ChannelType.DIRECT && channel.memberIds) {
         return users.filter(u => channel.memberIds?.includes(u.id));
    }
    if (team) {
      return users.filter(u => u.teamId === team.id);
    }
    // For general channels, show top leadership
    return users.filter(u => ['Secretary', 'Coordinator', 'Joint Coordinator'].includes(u.role));
  }, [team, users, channel, activeViewType]);

  const renderTitle = () => {
      if (activeViewType === 'calendar') {
          return (
             <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">Calendar</h2>
            </div>
          )
      }
      if (activeViewType === 'events') {
          return (
             <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">Events</h2>
            </div>
          )
      }
      if (!channel) return null;

      if (channel.type === ChannelType.DIRECT) {
          const otherUserId = channel.memberIds?.find(id => id !== currentUser.id);
          const otherUser = users.find(u => u.id === otherUserId);
          return (
            <div className="flex items-center space-x-2">
                {otherUser ? <img src={otherUser.avatarUrl} className="h-6 w-6 rounded-full" /> : <MessageCircle className="h-6 w-6 text-gray-400" />}
                <h2 className="text-xl font-bold text-white truncate max-w-[120px] sm:max-w-none">{otherUser ? otherUser.name : 'Direct Message'}</h2>
            </div>
          )
      }

      return (
        <div className="flex items-center space-x-2 min-w-0">
            {team ? (() => {
                const Icon = getTeamIcon(team.iconId);
                return <Icon className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />;
            })() : <Hash className="h-5 w-5 md:h-6 md:w-6 text-gray-400 flex-shrink-0" />}
            <h2 className="text-lg md:text-xl font-bold text-white truncate">{channel.name}</h2>
        </div>
      );
  }

  return (
    <header className="flex-shrink-0 bg-gray-900 border-b border-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4 h-16 gap-4">
        <div className="flex items-center space-x-3 min-w-0">
          <button onClick={onToggleSidebar} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
          {renderTitle()}
        </div>

        <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input 
                    type="text"
                    placeholder="Search messages, tasks, members..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        onSearch(e.target.value);
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
            </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex -space-x-2 overflow-hidden cursor-pointer" onClick={onOpenProfileModal} title="Edit your profile">
             {membersToDisplay.slice(0, 3).map(user => (
               <img key={user.id} className={`inline-block h-8 w-8 rounded-full ring-2 ring-gray-800 ${user.id === currentUser.id ? 'ring-primary-500' : ''}`} src={user.avatarUrl} alt={user.name} title={user.name} />
             ))}
             {membersToDisplay.length > 3 && (
               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 ring-2 ring-gray-800 text-xs font-medium text-gray-300">
                 +{membersToDisplay.length - 3}
               </div>
             )}
          </div>
          {activeViewType !== 'calendar' && activeViewType !== 'events' && (
              <button onClick={onOpenMembersModal} className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-md text-sm">
                 <Users className="h-4 w-4"/>
                 <span className="hidden sm:inline">Members</span>
              </button>
          )}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-gray-900">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {team && activeViewType !== 'calendar' && channel?.type === ChannelType.TEAM && (
        <div className="px-4">
          <div className="flex border-b border-gray-800">
            <TabButton icon={MessageSquare} label="Chat" active={activeViewType === 'channel'} onClick={() => onViewChange('channel')} />
            <TabButton icon={ListTodo} label="Tasks" active={activeViewType === 'tasks'} onClick={() => onViewChange('tasks')} />
            <TabButton icon={AppWindow} label="Apps & Tools" active={activeViewType === 'apps'} onClick={() => onViewChange('apps')} />
          </div>
        </div>
      )}
    </header>
  );
};


interface TabButtonProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, active, onClick}) => {
    return (
        <button
          onClick={onClick}
          className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors duration-200
            ${active 
              ? 'border-primary-500 text-primary-500' 
              : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }
          `}
        >
          <Icon className="h-4 w-4 md:h-5 md:w-5"/>
          <span>{label}</span>
        </button>
    )
}


export default Header;