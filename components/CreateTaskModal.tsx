import React, { useState } from 'react';
import { User } from '../types';
import { X, Calendar } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string, assignedTo: string, dueDate: string) => void;
  members: User[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate, members }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
        onCreate(title, description, assignedTo, dueDate);
        // Reset form
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setDueDate('');
        onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-950 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Assign New Task</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 text-white placeholder-gray-500"
              placeholder="e.g. Update budget spreadsheet"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 text-white resize-none h-24 placeholder-gray-500"
              placeholder="Add details about this task..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
                <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-gray-900 rounded-md py-2 px-3 border border-gray-600 focus:ring-1 focus:ring-primary-500 text-white appearance-none"
                >
                <option value="">Unassigned</option>
                {members.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <div className="relative">
                    <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-gray-900 rounded-md py-2 px-3 pl-10 border border-gray-600 focus:ring-1 focus:ring-primary-500 text-white [color-scheme:dark]"
                    />
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="py-2 px-4 rounded-md text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;