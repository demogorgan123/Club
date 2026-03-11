import React from 'react';
import { Notification } from '../types';
import { X, Bell, Check, ExternalLink, AlertCircle, UserPlus, MessageSquare } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (link: { type: 'channel' | 'tasks' | 'calendar'; id: string }) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onNavigate
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_assignment': return <UserPlus className="h-5 w-5 text-blue-400" />;
      case 'task_overdue': return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'mention': return <MessageSquare className="h-5 w-5 text-green-400" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg border border-gray-700 shadow-xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button 
                onClick={onMarkAllAsRead}
                className="text-xs text-primary-400 hover:text-primary-300 font-medium"
              >
                Mark all as read
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-all ${
                    notification.read 
                      ? 'bg-gray-900/30 border-gray-800 opacity-70' 
                      : 'bg-gray-900 border-gray-700 ring-1 ring-primary-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold text-sm ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="mt-3 flex items-center space-x-3">
                        {notification.link && (
                          <button 
                            onClick={() => {
                              onNavigate(notification.link!);
                              onMarkAsRead(notification.id);
                              onClose();
                            }}
                            className="flex items-center space-x-1 text-xs text-primary-400 hover:text-primary-300 font-medium"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View details</span>
                          </button>
                        )}
                        {!notification.read && (
                          <button 
                            onClick={() => onMarkAsRead(notification.id)}
                            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white font-medium"
                          >
                            <Check className="h-3 w-3" />
                            <span>Mark as read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
