import React from 'react';
import { User, Channel, Team, ChannelType } from '../types';
import { Hash, Megaphone, Settings, Plus, Calendar, MessageCircle } from 'lucide-react';

interface SidebarProps {
  clubName: string;
  currentUser: User;
  users: User[];
  channels: Channel[];
  teams: Team[];
  activeChannelId: string;
  activeViewType: string;
  onSelectChannel: (channelId: string) => void;
  onSelectCalendar: () => void;
  onOpenCreateTeamModal: () => void;
  onOpenMembersModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    clubName, 
    currentUser, 
    users,
    channels, 
    teams, 
    activeChannelId, 
    activeViewType,
    onSelectChannel, 
    onSelectCalendar,
    onOpenCreateTeamModal,
    onOpenMembersModal
}) => {

  const renderChannelIcon = (channel: Channel) => {
    if (channel.type === ChannelType.ANNOUNCEMENTS) {
      return <Megaphone className="h-5 w-5 text-gray-400" />;
    }
    if (channel.type === ChannelType.GENERAL) {
      return <Hash className="h-5 w-5 text-gray-400" />;
    }
    if (channel.type === ChannelType.TEAM) {
      const team = teams.find(t => t.id === channel.teamId);
      const Icon = team?.icon;
      return Icon ? <Icon className="h-5 w-5 text-gray-400" /> : <Hash className="h-5 w-5 text-gray-400" />;
    }
    if (channel.type === ChannelType.DIRECT) {
        return <MessageCircle className="h-5 w-5 text-gray-400" />;
    }
    return null;
  };

  const getChannelDisplayName = (channel: Channel) => {
      if (channel.type === ChannelType.DIRECT && channel.memberIds) {
          const otherUserId = channel.memberIds.find(id => id !== currentUser.id);
          const otherUser = users.find(u => u.id === otherUserId);
          return otherUser ? otherUser.name : 'Unknown User';
      }
      return channel.name;
  }
  
  const teamChannels = channels.filter(c => c.type === ChannelType.TEAM);
  const generalChannels = channels.filter(c => c.type !== ChannelType.TEAM && c.type !== ChannelType.DIRECT);
  const directChannels = channels.filter(c => c.type === ChannelType.DIRECT);
  
  const canCreateTeam = ['Secretary', 'Coordinator', 'Joint Coordinator'].includes(currentUser.role);

  return (
    <div className="w-64 bg-gray-950 flex flex-col h-full border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Club Workspace</h1>
        <p className="text-sm text-gray-400 truncate">{clubName}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">General</h2>
          {generalChannels.map(channel => (
            <a
              key={channel.id}
              href="#"
              onClick={(e) => { e.preventDefault(); onSelectChannel(channel.id); }}
              className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium ${
                activeChannelId === channel.id && activeViewType === 'channel' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {renderChannelIcon(channel)}
              <span>{channel.name}</span>
            </a>
          ))}
           <a
              href="#"
              onClick={(e) => { e.preventDefault(); onSelectCalendar(); }}
              className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium ${
                activeViewType === 'calendar' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>Calendar</span>
            </a>
        </div>
        
        <div>
           <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teams</h2>
              {canCreateTeam && (
                <button onClick={onOpenCreateTeamModal} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
          {teamChannels.map(channel => (
            <a
              key={channel.id}
              href="#"
              onClick={(e) => { e.preventDefault(); onSelectChannel(channel.id); }}
              className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium ${
                activeChannelId === channel.id && activeViewType === 'channel' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {renderChannelIcon(channel)}
              <span>{channel.name}</span>
            </a>
          ))}
        </div>

        <div>
           <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Direct Messages</h2>
               <button onClick={onOpenMembersModal} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700">
                  <Plus className="h-4 w-4" />
                </button>
            </div>
          {directChannels.map(channel => {
              const displayName = getChannelDisplayName(channel);
              const otherUserId = channel.memberIds?.find(id => id !== currentUser.id);
              const otherUser = users.find(u => u.id === otherUserId);
              
              return (
                <a
                key={channel.id}
                href="#"
                onClick={(e) => { e.preventDefault(); onSelectChannel(channel.id); }}
                className={`flex items-center space-x-3 px-2 py-2 rounded-md text-sm font-medium ${
                    activeChannelId === channel.id && activeViewType === 'channel' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                >
                {otherUser ? (
                    <img src={otherUser.avatarUrl} alt={otherUser.name} className="h-5 w-5 rounded-full" />
                ) : (
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className="truncate">{displayName}</span>
                </a>
             );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-10 w-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser.role}</p>
          </div>
          <div className="flex items-center text-gray-400">
             <Settings className="h-5 w-5 hover:text-white cursor-pointer"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;