import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { X } from 'lucide-react';
import { TEAM_ICONS } from '../services/iconData';


interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (teamName: string, headId: string, coHead1Id: string, coHead2Id: string, icon: React.ElementType) => void;
  users: User[];
}

const IconPicker: React.FC<{ onSelect: (icon: React.ElementType) => void; onClose: () => void }> = ({ onSelect, onClose }) => (
    <div className="absolute top-full mt-2 left-0 bg-gray-800 rounded-lg p-4 w-64 border border-gray-700 shadow-xl z-10">
        <div className="grid grid-cols-5 gap-2">
            {TEAM_ICONS.map(iconInfo => (
                <button key={iconInfo.id} onClick={() => onSelect(iconInfo.icon)} className="flex items-center justify-center p-2 bg-gray-900 rounded-md hover:bg-primary-600 text-gray-400 hover:text-white transition-colors">
                    <iconInfo.icon className="h-5 w-5" />
                </button>
            ))}
        </div>
    </div>
);


const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreate, users }) => {
  const [teamName, setTeamName] = useState('');
  const [headId, setHeadId] = useState('');
  const [coHead1Id, setCoHead1Id] = useState('');
  const [coHead2Id, setCoHead2Id] = useState('');
  // FIX: Explicitly type useState to store a component (`React.ElementType`).
  // This prevents React from misinterpreting the component as a lazy initializer and executing it.
  const [selectedIcon, setSelectedIcon] = useState<React.ElementType>(TEAM_ICONS[0].icon);
  const [isIconPickerOpen, setIconPickerOpen] = useState(false);
  const [error, setError] = useState('');

  const availableMembers = useMemo(() => {
    return users.filter(u => u.role === 'Member');
  }, [users]);
  
  const handleSelectIcon = (icon: React.ElementType) => {
    setSelectedIcon(icon);
    setIconPickerOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teamName.trim() || !headId || !coHead1Id || !coHead2Id) {
      setError('All fields are required.');
      return;
    }

    const selectedIds = new Set([headId, coHead1Id, coHead2Id]);
    if (selectedIds.size !== 3) {
      setError('You must select three different members for the leadership roles.');
      return;
    }

    onCreate(teamName, headId, coHead1Id, coHead2Id, selectedIcon);
    // Reset form and close
    setTeamName('');
    setHeadId('');
    setCoHead1Id('');
    setCoHead2Id('');
    setSelectedIcon(TEAM_ICONS[0].icon);
    onClose();
  };

  if (!isOpen) return null;
  const SelectedIcon = selectedIcon;

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create a New Team</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">Team Name</label>
            <div className="flex items-center space-x-3">
               <div className="relative">
                 <button type="button" onClick={() => setIconPickerOpen(prev => !prev)} className="p-3 bg-gray-900 rounded-md border border-gray-600 hover:border-primary-500 text-gray-300 hover:text-primary-400 transition-colors">
                    <SelectedIcon className="h-5 w-5" />
                 </button>
                 {isIconPickerOpen && <IconPicker onSelect={handleSelectIcon} onClose={() => setIconPickerOpen(false)} />}
               </div>
                <input
                  id="teamName"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white"
                  required
                />
            </div>
          </div>
          
          {[
            { label: 'Team Head', value: headId, setter: setHeadId },
            { label: 'Team Co-Head 1', value: coHead1Id, setter: setCoHead1Id },
            { label: 'Team Co-Head 2', value: coHead2Id, setter: setCoHead2Id },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white appearance-none"
                required
              >
                <option value="" disabled>Select a member</option>
                {availableMembers.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          ))}

          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-sm font-semibold text-gray-300 hover:bg-gray-700">Cancel</button>
            <button type="submit" className="py-2 px-4 rounded-md text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white">Create Team</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;