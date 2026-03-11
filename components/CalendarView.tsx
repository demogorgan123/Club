import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, User, Team } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface CalendarViewProps {
  tasks: { [teamId: string]: Task[] };
  teams: Team[];
  users: User[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, teams, users }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Flatten tasks into a single array with team info
  const allTasks = useMemo(() => {
    const flatTasks: (Task & { teamName: string, teamColor: string })[] = [];
    Object.entries(tasks as { [key: string]: Task[] }).forEach(([teamId, teamTasks]) => {
      const team = teams.find(t => t.id === teamId);
      if (team) {
        // Generate a pseudo-random color based on team name length/char for consistency
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];
        const color = colors[team.name.length % colors.length];
        
        teamTasks.forEach(task => {
            if (task.dueDate) {
                flatTasks.push({ ...task, teamName: team.name, teamColor: color });
            }
        });
      }
    });
    return flatTasks;
  }, [tasks, teams]);

  const tasksByDate = useMemo(() => {
    const grouped: { [date: string]: typeof allTasks } = {};
    allTasks.forEach(task => {
        if(task.dueDate) {
            // task.dueDate is YYYY-MM-DD string
            const dateKey = task.dueDate; 
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(task);
        }
    });
    return grouped;
  }, [allTasks]);

  const renderCalendarDays = () => {
    const days = [];
    const emptyDays = firstDay; // 0 is Sunday

    for (let i = 0; i < emptyDays; i++) {
      days.push(<div key={`empty-${i}`} className="hidden md:block h-32 bg-gray-900/50 border border-gray-800"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasksByDate[dateString] || [];
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div key={day} className={`min-h-[5rem] md:h-32 p-1.5 md:p-2 border border-gray-800 relative group overflow-hidden ${isToday ? 'bg-gray-800/50' : 'bg-gray-900 hover:bg-gray-800/30'}`}>
          <div className="flex justify-between items-start mb-1">
            <span className={`text-xs md:text-sm font-semibold h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-gray-400'}`}>
                {day}
            </span>
            {dayTasks.length > 0 && <span className="text-[9px] md:text-xs text-gray-500">{dayTasks.length} <span className="hidden sm:inline">{dayTasks.length === 1 ? 'task' : 'tasks'}</span></span>}
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)] custom-scrollbar">
            {dayTasks.map(task => (
                <div key={task.id} className={`text-[9px] md:text-xs p-0.5 md:p-1 rounded border-l-2 truncate ${task.teamColor} bg-gray-800 text-gray-200 border-opacity-70 bg-opacity-20`}>
                   {task.status === TaskStatus.DONE ? <CheckCircle2 className="inline h-2 w-2 md:h-3 md:w-3 mr-1 text-green-400"/> : null}
                   {task.title}
                </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 p-4 md:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
             <CalendarIcon className="h-6 w-6 md:h-8 md:w-8 text-primary-500" />
             <h1 className="text-xl md:text-2xl font-bold text-white">Global Calendar</h1>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <span className="text-lg md:text-xl font-semibold text-white min-w-[120px] text-center">
            {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <div className="grid grid-cols-7 bg-gray-900 border-b border-gray-800">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="py-2 md:py-3 text-center text-[10px] md:text-sm font-semibold text-gray-400 uppercase tracking-wider">
              <span className="hidden md:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
              <span className="md:hidden">{d}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {renderCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;