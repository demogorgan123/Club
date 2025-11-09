import React, { useState } from 'react';
// FIX: Imported the `Role` type to resolve 'Cannot find name Role' errors.
import { Channel, Team, User, Task, TaskStatus, Role } from '../types';
import { Plus, MoreHorizontal, CalendarDays } from 'lucide-react';

interface TaskViewProps {
  channel: Channel;
  currentUser: User;
  team?: Team;
  tasks: { [teamId: string]: Task[] };
  users: User[];
}

const statusStyles: { [key in TaskStatus]: string } = {
  [TaskStatus.TODO]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [TaskStatus.DONE]: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const TaskCard: React.FC<{ task: Task, users: User[] }> = ({ task, users }) => {
  const assignedUser = users.find(u => u.id === task.assignedTo);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate ? (dueDate.getTime() < today.getTime() && task.status !== TaskStatus.DONE) : false;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-3">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal className="h-5 w-5"/>
        </button>
      </div>
      <p className="text-sm text-gray-400">{task.description}</p>
      
      {dueDate && (
         <div className={`flex items-center text-xs space-x-1.5 font-medium ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          {assignedUser && (
            <img src={assignedUser.avatarUrl} alt={assignedUser.name} className="h-6 w-6 rounded-full"/>
          )}
          <span className="text-xs text-gray-300">{assignedUser?.name || 'Unassigned'}</span>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusStyles[task.status]}`}>{task.status}</span>
      </div>
    </div>
  );
};

const TaskView: React.FC<TaskViewProps> = ({ channel, currentUser, team, tasks: allTasks, users }) => {
  const [tasks] = useState<Task[]>(team ? allTasks[team.id] || [] : []);
  
  const clubLeadershipRoles: Role[] = ['Secretary', 'Coordinator', 'Joint Coordinator'];
  const teamLeadershipRoles: Role[] = ['Team Head', 'Team Co-Head'];

  const canAssignTask = team && (
    clubLeadershipRoles.includes(currentUser.role) ||
    (teamLeadershipRoles.includes(currentUser.role) && currentUser.teamId === team.id)
  );

  const taskSort = (a: Task, b: Task) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  };

  if (!team) {
    return <div className="p-8 text-center text-gray-400">Tasks are available for teams only.</div>;
  }
  
  const tasksByStatus = {
    [TaskStatus.TODO]: tasks.filter(t => t.status === TaskStatus.TODO).sort(taskSort),
    [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).sort(taskSort),
    [TaskStatus.DONE]: tasks.filter(t => t.status === TaskStatus.DONE).sort(taskSort),
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{team.name} Tasks</h1>
        {canAssignTask && (
          <button className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md text-sm">
            <Plus className="h-5 w-5"/>
            <span>Assign Task</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(tasksByStatus) as TaskStatus[]).map(status => (
          <div key={status} className="bg-gray-950/50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
              {status} <span className="ml-2 text-xs bg-gray-700 text-gray-400 rounded-full px-2 py-0.5">{tasksByStatus[status].length}</span>
            </h2>
            <div className="space-y-4">
              {tasksByStatus[status].length > 0 ? (
                tasksByStatus[status].map(task => <TaskCard key={task.id} task={task} users={users} />)
              ) : (
                <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">No tasks in this category.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskView;