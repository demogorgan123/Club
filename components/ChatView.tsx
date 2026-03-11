import React, { useState, useRef, useEffect } from 'react';
import { Channel, User, Message } from '../types';
import { api } from '../services/api';
import { Paperclip, SendHorizonal, Smile, Loader, MoreVertical, Edit2, Trash2, Check, X as CloseIcon } from 'lucide-react';

interface ChatViewProps {
  channel: Channel;
  currentUser: User;
  allUsers: User[];
  onCreateNotification: (notif: any) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ channel, currentUser, allUsers, onCreateNotification }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages(channel.id);
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchMessages();
    
    // Polling for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [channel.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      userId: currentUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic update
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
        await api.addMessage(channel.id, message);
        
        // Check for mentions
        allUsers.forEach(user => {
            if (user.id !== currentUser.id && newMessage.includes(`@${user.name}`)) {
                onCreateNotification({
                    userId: user.id,
                    title: 'New Mention',
                    message: `${currentUser.name} mentioned you in #${channel.name}`,
                    type: 'mention',
                    link: { type: 'channel', id: channel.id }
                });
            }
        });
    } catch (error) {
        console.error('Failed to send message:', error);
    }
  };

  const handleReact = async (messageId: string, emoji: string) => {
    try {
        await api.reactToMessage(channel.id, messageId, emoji, currentUser.id);
        fetchMessages();
    } catch (error) {
        console.error('Failed to react:', error);
    }
  };

  const handleEdit = async (messageId: string) => {
    if (editingText.trim() === '') return;
    try {
        await api.editMessage(channel.id, messageId, editingText);
        setEditingMessageId(null);
        fetchMessages();
    } catch (error) {
        console.error('Failed to edit:', error);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
        await api.deleteMessage(channel.id, messageId);
        fetchMessages();
    } catch (error) {
        console.error('Failed to delete:', error);
    }
  };

  const getUserById = (userId: string) => allUsers.find(u => u.id === userId);

  const COMMON_EMOJIS = ['👍', '❤️', '🔥', '😂', '😮', '😢'];

  return (
    <div className="flex flex-col h-full bg-gray-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6">
        {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin h-8 w-8 text-primary-500" />
            </div>
        ) : (
            messages.map((message, index) => {
                const sender = getUserById(message.userId);
                const prevMessage = messages[index - 1];
                const showHeader = !prevMessage || prevMessage.userId !== message.userId;
                const isOwn = message.userId === currentUser.id;
      
                return sender ? (
                  <div key={message.id} className={`flex items-start space-x-2 md:space-x-4 group relative ${!showHeader ? 'mt-0.5 md:mt-1' : 'mt-3 md:mt-4'}`}>
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                      {showHeader && <img src={sender.avatarUrl} alt={sender.name} className="h-8 w-8 md:h-10 md:w-10 rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {showHeader && (
                        <div className="flex items-baseline space-x-2 mb-0.5 md:mb-1">
                          <p className="font-bold text-white text-sm md:text-base truncate">{sender.name}</p>
                          <p className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">{message.timestamp}</p>
                          {message.isEdited && <span className="text-[10px] text-gray-600 italic">(edited)</span>}
                        </div>
                      )}
                      
                      {editingMessageId === message.id ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <input 
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-1 bg-gray-800 border border-primary-500 rounded px-2 py-1 text-white text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEdit(message.id);
                                if (e.key === 'Escape') setEditingMessageId(null);
                            }}
                          />
                          <button onClick={() => handleEdit(message.id)} className="text-green-500 p-1 hover:bg-gray-800 rounded"><Check className="h-4 w-4"/></button>
                          <button onClick={() => setEditingMessageId(null)} className="text-red-500 p-1 hover:bg-gray-800 rounded"><CloseIcon className="h-4 w-4"/></button>
                        </div>
                      ) : (
                        <p className="text-gray-200 text-sm md:text-base break-words">{message.text}</p>
                      )}

                      {/* Reactions */}
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(message.reactions as { [emoji: string]: string[] }).map(([emoji, users]) => (
                            <button 
                              key={emoji}
                              onClick={() => handleReact(message.id, emoji)}
                              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs border ${users.includes(currentUser.id) ? 'bg-primary-900/30 border-primary-500 text-primary-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                            >
                              <span>{emoji}</span>
                              <span>{users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden">
                      <div className="flex items-center border-r border-gray-700 px-1">
                        {COMMON_EMOJIS.map(emoji => (
                          <button 
                            key={emoji} 
                            onClick={() => handleReact(message.id, emoji)}
                            className="p-1 hover:bg-gray-700 rounded text-sm"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      {isOwn && (
                        <div className="flex items-center">
                          <button 
                            onClick={() => {
                                setEditingMessageId(message.id);
                                setEditingText(message.text);
                            }} 
                            className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-white"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(message.id)} 
                            className="p-1.5 hover:bg-gray-700 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 md:p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="w-full bg-gray-800 rounded-lg py-2 md:py-3 pl-3 md:pl-4 pr-20 md:pr-28 resize-none border-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500 text-sm md:text-base"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 md:space-x-2">
            <button type="button" className="p-1.5 md:p-2 text-gray-400 hover:text-white">
              <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button type="button" className="p-1.5 md:p-2 text-gray-400 hover:text-white">
              <Smile className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button type="submit" className="p-1.5 md:p-2 text-primary-500 hover:text-primary-400 disabled:text-gray-600" disabled={!newMessage.trim()}>
              <SendHorizonal className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
