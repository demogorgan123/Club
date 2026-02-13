import React, { useState } from 'react';
import { Channel, Team, User, Task, TaskStatus, Role } from '../types';
import { Plus, MoreHorizontal, CalendarDays } from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';

interface TaskViewProps {
  channel: Channel;
  currentUser: User;
  team?: Team;
  tasks: { [teamId: string]: Task[] };
  users: User[];
  onAddTask: (teamId: string, task: Task) => void;
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
  
  // Appending time to ensure date is treated locally or at least not previous day due to UTC
  const dueDate = task.dueDate ? new Date(`${task.dueDate}T12:00:00`) : null;
  const isOverdue = dueDate ? (dueDate.getTime() < today.getTime() && task.status !== TaskStatus.DONE) : false;

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border space-y-3 transition-colors ${isOverdue ? 'border-red-900/50 bg-red-900/5' : 'border-gray-700'}`}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <button className="text-gray-400 hover:text-white">
          <MoreHorizontal className="h-5 w-5"/>
        </button>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
      
      {dueDate && (
         <div className={`flex items-center text-xs space-x-1.5 font-medium ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Due {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            {isOverdue && <span className="text-red-500 font-bold ml-1">(Overdue)</span>}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          {assignedUser ? (
             <>
                <img src={assignedUser.avatarUrl} alt={assignedUser.name} className="h-6 w-6 rounded-full"/>
                <span className="text-xs text-gray-300">{assignedUser.name}</span>
             </>
          ) : (
             <span className="text-xs text-gray-500 italic">Unassigned</span>
          )}
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusStyles[task.status]}`}>{task.status}</span>
      </div>
    </div>
  );
};

const TaskView: React.FC<TaskViewProps> = ({ channel, currentUser, team, tasks: allTasks, users, onAddTask }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const teamTasks = team ? allTasks[team.id] || [] : [];
  
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

  const handleCreateTask = (title: string, description: string, assignedTo: string, dueDate: string) => {
    if (!team) return;
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        assignedTo,
        status: TaskStatus.TODO,
        dueDate: dueDate || undefined,
    };
    onAddTask(team.id, newTask);
  };

  if (!team) {
    return <div className="p-8 text-center text-gray-400">Tasks are available for teams only.</div>;
  }
  
  const tasksByStatus = {
    [TaskStatus.TODO]: teamTasks.filter(t => t.status === TaskStatus.TODO).sort(taskSort),
    [TaskStatus.IN_PROGRESS]: teamTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).sort(taskSort),
    [TaskStatus.DONE]: teamTasks.filter(t => t.status === TaskStatus.DONE).sort(taskSort),
  };
  
  // Filter users to only show members of the current team for assignment
  const teamMembers = users.filter(u => u.teamId === team.id);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <CreateTaskModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onCreate={handleCreateTask}
        members={teamMembers}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">{team.name} Tasks</h1>
        {canAssignTask && (
          <button 
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
          >
            <Plus className="h-5 w-5"/>
            <span>Assign Task</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(tasksByStatus) as TaskStatus[]).map(status => (
          <div key={status} className="bg-gray-950/50 rounded-lg p-4 h-fit">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center justify-between">
              <span>{status}</span>
              <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">{tasksByStatus[status].length}</span>
            </h2>
            <div className="space-y-4">
              {tasksByStatus[status].length > 0 ? (
                tasksByStatus[status].map(task => <TaskCard key={task.id} task={task} users={users} />)
              ) : (
                <div className="text-center py-8 text-sm text-gray-500 border-2 border-dashed border-gray-800 rounded-lg">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskView;