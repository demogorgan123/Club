import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { X, Save, User as UserIcon } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile: (name: string, role: Role) => void;
  onResetWorkspace: () => void;
}

const ROLES: Role[] = ['Secretary', 'Coordinator', 'Joint Coordinator', 'Team Head', 'Team Co-Head', 'Member'];

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateProfile, onResetWorkspace }) => {
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState<Role>(currentUser.role);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setRole(currentUser.role);
    setShowConfirmReset(false);
  }, [currentUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdateProfile(name.trim(), role);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md border border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary-500" />
            Edit Profile
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Position / Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white appearance-none"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Note: Changing your role may affect your permissions.</p>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-md transition-colors shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-4">Danger Zone</h3>
            {!showConfirmReset ? (
                <button 
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 font-semibold py-2 rounded-md transition-colors"
                >
                    Reset Workspace Data
                </button>
            ) : (
                <div className="space-y-3">
                    <p className="text-xs text-gray-400">This will permanently delete all club data, teams, and messages. This action cannot be undone.</p>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setShowConfirmReset(false)}
                            className="flex-1 bg-gray-700 text-white text-xs font-semibold py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onResetWorkspace}
                            className="flex-1 bg-red-600 text-white text-xs font-semibold py-2 rounded-md"
                        >
                            Confirm Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
