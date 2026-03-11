import React, { useState, useRef, useEffect } from 'react';
import { Channel, User, Message } from '../types';
import { api } from '../services/api';
import { Paperclip, SendHorizonal, Smile, Loader } from 'lucide-react';

interface ChatViewProps {
  channel: Channel;
  currentUser: User;
  allUsers: User[];
}

const ChatView: React.FC<ChatViewProps> = ({ channel, currentUser, allUsers }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.getData();
      if (data && data.messages) {
        setMessages(data.messages[channel.id] || []);
      }
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
    } catch (error) {
        console.error('Failed to send message:', error);
        // Rollback or show error
    }
  };

  const getUserById = (userId: string) => allUsers.find(u => u.id === userId);

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin h-8 w-8 text-primary-500" />
            </div>
        ) : (
            messages.map((message, index) => {
                const sender = getUserById(message.userId);
                const prevMessage = messages[index - 1];
                const showHeader = !prevMessage || prevMessage.userId !== message.userId;
      
                return sender ? (
                  <div key={message.id} className={`flex items-start space-x-4 ${!showHeader ? 'mt-1' : 'mt-4'}`}>
                    <div className="w-10 h-10">
                      {showHeader && <img src={sender.avatarUrl} alt={sender.name} className="h-10 w-10 rounded-full" />}
                    </div>
                    <div className="flex-1">
                      {showHeader && (
                        <div className="flex items-baseline space-x-2 mb-1">
                          <p className="font-bold text-white">{sender.name}</p>
                          <p className="text-xs text-gray-500">{message.timestamp}</p>
                        </div>
                      )}
                      <p className="text-gray-200">{message.text}</p>
                    </div>
                  </div>
                ) : null;
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="w-full bg-gray-800 rounded-lg py-3 pl-4 pr-28 resize-none border-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-500"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button type="button" className="p-2 text-gray-400 hover:text-white">
              <Paperclip className="h-5 w-5" />
            </button>
            <button type="button" className="p-2 text-gray-400 hover:text-white">
              <Smile className="h-5 w-5" />
            </button>
            <button type="submit" className="p-2 text-primary-500 hover:text-primary-400 disabled:text-gray-600" disabled={!newMessage.trim()}>
              <SendHorizonal className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
