import React, { useState, useMemo } from 'react';
import { User, Role, Team } from '../types';
import { X, Send, MessageCircle } from 'lucide-react';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onInviteUser: (email: string) => void;
  onUpdateUserRole: (userId: string, newRole: Role) => void;
  onMessageUser: (userId: string) => void;
  team?: Team; // The currently active team, if any
  teams: Team[]; // All teams
}

const ROLES_HIERARCHY: Role[] = ['Secretary', 'Coordinator', 'Joint Coordinator', 'Team Head', 'Team Co-Head', 'Member'];

const MembersModal: React.FC<MembersModalProps> = ({ isOpen, onClose, currentUser, users, onInviteUser, onUpdateUserRole, onMessageUser, team, teams }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      onInviteUser(inviteEmail);
      setInviteEmail('');
    }
  };

  const canEdit = (targetUser: User): boolean => {
    if (currentUser.id === targetUser.id) return false;
    if (currentUser.role === 'Secretary') return true;
    return false;
  };

  const getDesignation = (user: User): string => {
    if ((user.role === 'Team Head' || user.role === 'Team Co-Head') && user.teamId) {
        const teamName = teams.find(t => t.id === user.teamId)?.name;
        return teamName ? `${teamName} ${user.role}` : user.role;
    }
    return user.role;
  }

  const usersToDisplay = useMemo(() => {
      const userList = team ? users.filter(u => u.teamId === team.id) : users;
      return [...userList].sort((a, b) => ROLES_HIERARCHY.indexOf(a.role) - ROLES_HIERARCHY.indexOf(b.role));
  }, [users, team]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-700 shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">{team ? `${team.name} Members` : 'Club Members'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {currentUser.role === 'Secretary' && !team && (
          <form onSubmit={handleInvite} className="flex items-center space-x-2 mb-6 flex-shrink-0">
            <input
              type="email"
              placeholder="Invite new member by email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500"
            />
            <button type="submit" className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md disabled:bg-gray-600" disabled={!inviteEmail}>
              <Send className="h-4 w-4" />
              <span>Invite</span>
            </button>
          </form>
        )}
        
        <div className="overflow-y-auto pr-2 -mr-2">
          <div className="space-y-3">
            {usersToDisplay.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md group hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3">
                  <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                        {user.name}
                         {user.id === currentUser.id && <span className="text-xs text-gray-500">(You)</span>}
                    </p>
                    <p className="text-xs text-gray-400">{user.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {user.id !== currentUser.id && (
                       <button onClick={() => onMessageUser(user.id)} className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors" title="Send Direct Message">
                          <MessageCircle className="h-4 w-4" />
                       </button>
                  )}
                  {canEdit(user) ? (
                    <select
                      value={user.role}
                      onChange={(e) => onUpdateUserRole(user.id, e.target.value as Role)}
                      className="bg-gray-700 text-white text-sm rounded-md py-1 px-2 border border-gray-600 focus:ring-1 focus:ring-primary-500"
                    >
                      {ROLES_HIERARCHY.map(role => (
                         !['Team Head', 'Team Co-Head'].includes(role) && <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                     <span className="text-sm font-medium text-gray-300 bg-gray-700 px-3 py-1 rounded-full">{getDesignation(user)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersModal;