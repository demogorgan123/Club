import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { User, ActiveView, Channel, Team, Task, Role, ChannelType, AppIntegration, Notification, Message, Event } from './types';
import { AVAILABLE_APPS } from './services/appData';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatView from './components/ChatView';
import TaskView from './components/TaskView';
import AppsView from './components/AppsView';
import CalendarView from './components/CalendarView';
import EventsView from './components/EventsView';
import OnboardingScreen from './components/OnboardingScreen';
import CreateTeamModal from './components/CreateTeamModal';
import MembersModal from './components/MembersModal';
import ProfileModal from './components/ProfileModal';
import NotificationsModal from './components/NotificationsModal';
import SearchResults from './components/SearchResults';

const USER_ID = 'user-1';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clubName, setClubName] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [tasks, setTasks] = useState<{ [teamId: string]: Task[] }>({});
  const [teamApps, setTeamApps] = useState<{ [teamId: string]: AppIntegration[] }>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [allMessages, setAllMessages] = useState<{ [channelId: string]: Message[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'channel', id: 'general' });
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isMembersModalOpen, setMembersModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isNotificationsModalOpen, setNotificationsModalOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getData();
        if (data && data.isInitialized) {
          setClubName(data.clubName);
          setUsers(data.users);
          setTeams(data.teams);
          setChannels(data.channels);
          setTasks(data.tasks);
          setTeamApps(data.teamApps);
          setNotifications(data.notifications || []);
          setEvents(data.events || []);
          setAllMessages(data.messages || {});
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const creator = users.find(u => u.id === USER_ID);
    if(creator){
      setCurrentUser({...creator, role: creator.role === 'Member' ? 'Secretary' : creator.role });
    } else {
      setCurrentUser(users.find(u => u.id === USER_ID));
    }
  }, [users]);

  const syncData = useCallback(async (updates: any) => {
    const currentData = {
        clubName,
        isInitialized,
        users,
        teams,
        channels,
        tasks,
        teamApps,
        notifications,
        events,
        ...updates
    };
    await api.saveData(currentData);
  }, [clubName, isInitialized, users, teams, channels, tasks, teamApps, notifications, events]);

  const handleGenerateWorkspace = async (name: string, newTeams: { name: string; iconId: string }[], onboardingTeamApps: { [teamName: string]: string[] }) => {
    // Initialize workspace data locally instead of using mockData
    const initialTeams: Team[] = newTeams.map((teamData) => ({
      id: teamData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: teamData.name,
      iconId: teamData.iconId,
    }));

    const initialUsers: User[] = [
      { id: USER_ID, name: 'Alex Johnson', avatarUrl: `https://picsum.photos/seed/${USER_ID}/40/40`, role: 'Secretary', email: 'alex.j@example.com' },
    ];
    
    const generalChannels: Channel[] = [
      { id: 'general', name: 'general', type: ChannelType.GENERAL },
      { id: 'announcements', name: 'announcements', type: ChannelType.ANNOUNCEMENTS },
    ];

    const teamChannels: Channel[] = initialTeams.map(team => ({
        id: `${team.id}-chat`,
        name: team.name.toLowerCase().replace(/\s+/g, '-'),
        type: ChannelType.TEAM,
        teamId: team.id,
    }));
    
    const initialChannels = [...generalChannels, ...teamChannels];

    const initialTasks: { [teamId: string]: Task[] } = {};
    initialTeams.forEach(team => {
        initialTasks[team.id] = [];
    });

    const newTeamApps: { [teamId: string]: AppIntegration[] } = {};
    initialTeams.forEach(team => {
        const appNames = onboardingTeamApps[team.name] || [];
        newTeamApps[team.id] = AVAILABLE_APPS.filter(app => appNames.includes(app.name));
    });

    const data = {
        clubName: name,
        isInitialized: true,
        users: initialUsers,
        teams: initialTeams,
        channels: initialChannels,
        tasks: initialTasks,
        teamApps: newTeamApps
    };

    setClubName(name);
    setUsers(data.users);
    setTeams(data.teams);
    setChannels(data.channels);
    setTasks(data.tasks);
    setTeamApps(newTeamApps);
    setIsInitialized(true);

    await api.saveData(data);
  };

  const handleCreateTeam = async (teamName: string, headId: string, coHead1Id: string, coHead2Id: string, iconId: string) => {
    const newTeamId = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newTeam: Team = {
      id: newTeamId,
      name: teamName,
      iconId: iconId,
    };
    
    const newChannel: Channel = {
      id: `${newTeamId}-chat`,
      name: teamName.toLowerCase().replace(/\s+/g, '-'),
      type: ChannelType.TEAM,
      teamId: newTeamId,
    };
    
    const updatedUsers = users.map(user => {
      if (user.id === headId) return { ...user, role: 'Team Head' as Role, teamId: newTeamId };
      if (user.id === coHead1Id || user.id === coHead2Id) return { ...user, role: 'Team Co-Head' as Role, teamId: newTeamId };
      return user;
    });

    const updatedTeams = [...teams, newTeam];
    const updatedChannels = [...channels, newChannel];
    const updatedTasks = {...tasks, [newTeamId]: []};
    const updatedTeamApps = {...teamApps, [newTeamId]: AVAILABLE_APPS.slice(0, 4)};

    setTeams(updatedTeams);
    setChannels(updatedChannels);
    setUsers(updatedUsers);
    setTasks(updatedTasks);
    setTeamApps(updatedTeamApps);

    await syncData({
        teams: updatedTeams,
        channels: updatedChannels,
        users: updatedUsers,
        tasks: updatedTasks,
        teamApps: updatedTeamApps
    });
  };

  const handleInviteUser = async (email: string) => {
    const newUserId = `user-${Date.now()}`;
    const userName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newUser: User = {
      id: newUserId,
      name: userName,
      avatarUrl: `https://picsum.photos/seed/${newUserId}/40/40`,
      role: 'Member',
      email: email,
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    await syncData({ users: updatedUsers });
  };

  const handleUpdateUserRole = async (userId: string, newRole: Role, teamId?: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole, teamId: teamId || user.teamId } : user
    );
    setUsers(updatedUsers);
    await syncData({ users: updatedUsers });
  };

  const handleUpdateProfile = async (name: string, role: Role) => {
    if (!currentUser) return;
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, name, role } : user
    );
    setUsers(updatedUsers);
    await syncData({ users: updatedUsers });
  };

  const handleResetWorkspace = async () => {
    await api.resetWorkspace();
    window.location.reload();
  };

  const handleAddTask = async (teamId: string, task: Task) => {
    const updatedTasks = {
        ...tasks,
        [teamId]: [...(tasks[teamId] || []), task]
    };
    setTasks(updatedTasks);

    // Create notification for assigned user
    if (task.assignedTo && task.assignedTo !== currentUser?.id) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            userId: task.assignedTo,
            title: 'New Task Assigned',
            message: `You have been assigned to: ${task.title}`,
            type: 'task_assignment',
            read: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            link: { type: 'tasks', id: `${teamId}-chat` }
        };
        const updatedNotifications = [...notifications, newNotification];
        setNotifications(updatedNotifications);
        await syncData({ tasks: updatedTasks, notifications: updatedNotifications });
    } else {
        await syncData({ tasks: updatedTasks });
    }
  };

  const handleCreateNotification = useCallback(async (notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
      const newNotification: Notification = {
          ...notif,
          id: `notif-${Date.now()}`,
          read: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updatedNotifications = [...notifications, newNotification];
      setNotifications(updatedNotifications);
      await syncData({ notifications: updatedNotifications });
  }, [notifications, syncData]);

  const handleMarkNotifRead = async (id: string) => {
      const updatedNotifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      setNotifications(updatedNotifications);
      await syncData({ notifications: updatedNotifications });
  };

  const handleMarkAllNotifsRead = async () => {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      await syncData({ notifications: updatedNotifications });
  };

  // Check for overdue tasks
  useEffect(() => {
      if (!isInitialized || !currentUser) return;

      const checkOverdue = () => {
          const now = new Date();
          const newNotifications: Notification[] = [];

          Object.entries(tasks as { [key: string]: Task[] }).forEach(([teamId, teamTasks]) => {
              teamTasks.forEach(task => {
                  if (task.assignedTo === currentUser.id && task.status !== 'Done' && task.dueDate) {
                      const dueDate = new Date(task.dueDate);
                      if (dueDate < now) {
                          // Check if we already notified about this today
                          const alreadyNotified = notifications.some(n => 
                              n.type === 'task_overdue' && 
                              n.message.includes(task.title) &&
                              new Date(n.timestamp).toDateString() === now.toDateString()
                          );

                          if (!alreadyNotified) {
                              newNotifications.push({
                                  id: `notif-overdue-${task.id}-${Date.now()}`,
                                  userId: currentUser.id,
                                  title: 'Task Overdue',
                                  message: `Task "${task.title}" is overdue!`,
                                  type: 'task_overdue',
                                  read: false,
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  link: { type: 'tasks', id: `${teamId}-chat` }
                              });
                          }
                      }
                  }
              });
          });

          if (newNotifications.length > 0) {
              setNotifications(prev => [...prev, ...newNotifications]);
              syncData({ notifications: [...notifications, ...newNotifications] });
          }
      };

      checkOverdue();
      const interval = setInterval(checkOverdue, 1000 * 60 * 60); // Check every hour
      return () => clearInterval(interval);
  }, [isInitialized, currentUser, tasks, notifications, syncData]);
  
  const handleOpenDM = async (targetUserId: string) => {
      if (!currentUser) return;
      
      const memberIds = [currentUser.id, targetUserId].sort();
      const existingChannel = channels.find(c => 
          c.type === ChannelType.DIRECT && 
          c.memberIds && 
          c.memberIds.length === 2 && 
          c.memberIds.every(id => memberIds.includes(id))
      );
      
      if (existingChannel) {
          setActiveView({ type: 'channel', id: existingChannel.id });
      } else {
          const newChannel: Channel = {
              id: `dm-${memberIds.join('-')}`,
              name: `dm-${memberIds.join('-')}`,
              type: ChannelType.DIRECT,
              memberIds: memberIds
          };
          const updatedChannels = [...channels, newChannel];
          setChannels(updatedChannels);
          setActiveView({ type: 'channel', id: newChannel.id });
          await syncData({ channels: updatedChannels });
      }
      setMembersModalOpen(false);
      if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleAddEvent = async (event: Event) => {
      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      await syncData({ events: updatedEvents });
  };

  const handleRSVP = async (eventId: string) => {
      if (!currentUser) return;
      const updatedEvents = events.map(e => {
          if (e.id === eventId) {
              const attendees = e.attendees.includes(currentUser.id)
                  ? e.attendees.filter(id => id !== currentUser.id)
                  : [...e.attendees, currentUser.id];
              return { ...e, attendees };
          }
          return e;
      });
      setEvents(updatedEvents);
      await syncData({ events: updatedEvents });
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
      const updatedEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      setEvents(updatedEvents);
      await syncData({ events: updatedEvents });
  };

  const handleSearch = (query: string) => {
      setSearchQuery(query);
  };

  const availableChannels = useMemo(() => {
    if (!currentUser) return [];
    const directChannels = channels.filter(c => c.type === ChannelType.DIRECT && c.memberIds?.includes(currentUser.id));
    let regularChannels: Channel[] = [];
    if (['Secretary', 'Coordinator', 'Joint Coordinator'].includes(currentUser.role)) {
      regularChannels = channels.filter(c => c.type !== ChannelType.DIRECT);
    } else {
      regularChannels = channels.filter(c => 
          c.type !== ChannelType.DIRECT && (c.type !== 'team' || c.teamId === currentUser.teamId)
      );
    }
    return [...regularChannels, ...directChannels];
  }, [currentUser, channels]);
  
  const activeChannel = useMemo(() => channels.find(c => c.id === activeView.id), [activeView.id, channels]);
  const activeTeam = useMemo(() => teams.find(t => t.id === activeChannel?.teamId), [activeChannel, teams]);
  const activeTeamApps = useMemo(() => activeTeam ? teamApps[activeTeam.id] || [] : [], [activeTeam, teamApps]);

  const renderActiveView = () => {
    if (!currentUser) return <div className="p-8">Loading...</div>;
    if (activeView.type === 'calendar') {
        return <CalendarView tasks={tasks} teams={teams} users={users} />;
    }
    if (activeView.type === 'events') {
        return (
            <EventsView 
                events={events} 
                currentUser={currentUser} 
                teams={teams} 
                onAddEvent={handleAddEvent} 
                onRSVP={handleRSVP} 
                onUpdateEvent={handleUpdateEvent}
            />
        );
    }
    if (!activeChannel) return <div className="p-8 text-gray-400">Select a channel...</div>;
    
    switch (activeView.type) {
      case 'channel':
        return (
            <ChatView 
                channel={activeChannel} 
                currentUser={currentUser} 
                allUsers={users} 
                onCreateNotification={handleCreateNotification}
            />
        );
      case 'tasks':
        return (
            <TaskView 
                channel={activeChannel} 
                currentUser={currentUser} 
                team={activeTeam} 
                tasks={tasks} 
                users={users} 
                onAddTask={handleAddTask}
            />
        );
      case 'apps':
        return <AppsView channel={activeChannel} apps={activeTeamApps} />
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div></div>;
  }

  if (!isInitialized) {
    return <OnboardingScreen onGenerateWorkspace={handleGenerateWorkspace} />;
  }

  if (!currentUser) {
    return <div className="h-screen w-full flex items-center justify-center bg-gray-950 text-white">User not found. Please refresh.</div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-900 font-sans overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setCreateTeamModalOpen(false)}
        onCreate={handleCreateTeam}
        users={users}
      />
      <MembersModal 
        isOpen={isMembersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onInviteUser={handleInviteUser}
        onUpdateUserRole={handleUpdateUserRole}
        onMessageUser={handleOpenDM}
        team={activeTeam}
        teams={teams}
      />
      <div className={`
        absolute top-0 left-0 h-full z-30
        transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          clubName={clubName}
          currentUser={currentUser}
          users={users}
          channels={availableChannels}
          teams={teams}
          activeChannelId={activeView.id}
          activeViewType={activeView.type}
          onSelectChannel={(channelId) => {
              setActiveView({ type: 'channel', id: channelId });
              if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onSelectCalendar={() => {
              setActiveView({ type: 'calendar', id: 'calendar' });
              if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onSelectEvents={() => {
              setActiveView({ type: 'events', id: 'events' });
              if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onOpenCreateTeamModal={() => setCreateTeamModalOpen(true)}
          onOpenMembersModal={() => setMembersModalOpen(true)}
          onOpenProfileModal={() => setProfileModalOpen(true)}
          onResetWorkspace={handleResetWorkspace}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          channel={activeChannel}
          team={activeTeam}
          activeViewType={activeView.type}
          onViewChange={(viewType) => setActiveView({ ...activeView, type: viewType })}
          currentUser={currentUser}
          users={users}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onOpenMembersModal={() => setMembersModalOpen(true)}
          onOpenProfileModal={() => setProfileModalOpen(true)}
          notifications={notifications.filter(n => n.userId === currentUser.id)}
          onOpenNotifications={() => setNotificationsModalOpen(true)}
          onSearch={handleSearch}
        />
        <div className="flex-1 overflow-y-auto relative">
          {searchQuery && (
              <SearchResults 
                query={searchQuery}
                users={users}
                messages={allMessages}
                tasks={tasks}
                events={events}
                channels={channels}
                onNavigate={(type, id) => {
                    setActiveView({ type, id });
                    setSearchQuery('');
                }}
                onClose={() => setSearchQuery('')}
              />
          )}
          {renderActiveView()}
        </div>
      </main>
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onResetWorkspace={handleResetWorkspace}
      />
      <NotificationsModal 
        isOpen={isNotificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        notifications={notifications.filter(n => n.userId === currentUser.id)}
        onMarkAsRead={handleMarkNotifRead}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onNavigate={(link) => {
            setActiveView({ type: link.type, id: link.id });
        }}
      />
    </div>
  );
};

export default App;
