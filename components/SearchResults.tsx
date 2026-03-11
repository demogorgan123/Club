import React from 'react';
import { User, Message, Task, Event, Channel } from '../types';
import { Search, MessageSquare, ListTodo, Calendar, Users, Hash } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  users: User[];
  messages: { [channelId: string]: Message[] };
  tasks: { [teamId: string]: Task[] };
  events: Event[];
  channels: Channel[];
  onNavigate: (type: any, id: string) => void;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, users, messages, tasks, events, channels, onNavigate, onClose }) => {
  if (!query.trim()) return null;

  const lowerQuery = query.toLowerCase();

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(lowerQuery) || u.email?.toLowerCase().includes(lowerQuery));
  
  const filteredMessages: { channel: Channel; message: Message }[] = [];
  Object.entries(messages as { [key: string]: Message[] }).forEach(([channelId, channelMessages]) => {
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
          channelMessages.forEach(m => {
              if (m.text.toLowerCase().includes(lowerQuery)) {
                  filteredMessages.push({ channel, message: m });
              }
          });
      }
  });

  const filteredTasks: { teamId: string; task: Task }[] = [];
  Object.entries(tasks as { [key: string]: Task[] }).forEach(([teamId, teamTasks]) => {
      teamTasks.forEach(t => {
          if (t.title.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery)) {
              filteredTasks.push({ teamId, task: t });
          }
      });
  });

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(lowerQuery) || e.description.toLowerCase().includes(lowerQuery));

  const totalResults = filteredUsers.length + filteredMessages.length + filteredTasks.length + filteredEvents.length;

  return (
    <div className="absolute top-16 left-0 right-0 bottom-0 bg-gray-950/95 z-40 overflow-y-auto p-4 md:p-8 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Search className="h-6 w-6 text-primary-500" />
                Search Results for "{query}"
                <span className="text-sm font-normal text-gray-500 ml-2">({totalResults} found)</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white font-semibold">Close Search</button>
        </div>

        {totalResults === 0 ? (
            <div className="text-center py-20">
                <Search className="h-16 w-16 text-gray-800 mx-auto mb-4" />
                <p className="text-gray-500 text-xl">No results found for your query.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-8">
                {/* Users */}
                {filteredUsers.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Members
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="bg-gray-900 border border-gray-800 p-3 rounded-lg flex items-center space-x-3 hover:border-primary-500/50 transition-colors cursor-pointer">
                                    <img src={user.avatarUrl} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Events */}
                {filteredEvents.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Events
                        </h3>
                        <div className="space-y-2">
                            {filteredEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    onClick={() => onNavigate('events', event.id)}
                                    className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-primary-500/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors">{event.title}</h4>
                                        <span className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{event.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Tasks */}
                {filteredTasks.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <ListTodo className="h-4 w-4" />
                            Tasks
                        </h3>
                        <div className="space-y-2">
                            {filteredTasks.map(({ teamId, task }) => (
                                <div 
                                    key={task.id} 
                                    onClick={() => onNavigate('tasks', `${teamId}-chat`)}
                                    className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-primary-500/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors">{task.title}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                            task.status === 'Done' ? 'bg-green-600/20 text-green-400' : 
                                            task.status === 'In Progress' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-700 text-gray-300'
                                        }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Messages */}
                {filteredMessages.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Messages
                        </h3>
                        <div className="space-y-2">
                            {filteredMessages.map(({ channel, message }) => (
                                <div 
                                    key={message.id} 
                                    onClick={() => onNavigate('channel', channel.id)}
                                    className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-primary-500/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center space-x-2">
                                            <Hash className="h-3 w-3 text-gray-500" />
                                            <span className="text-xs font-bold text-primary-500">{channel.name}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500">{message.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 line-clamp-2">{message.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
