import React, { useState, useMemo, useEffect } from 'react';
import { User, ActiveView, Channel, Team, Task, Role, ChannelType, AppIntegration } from './types';
import { initializeWorkspaceData, USER_ID } from './services/mockData';
import { AVAILABLE_APPS } from './services/appData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatView from './components/ChatView';
import TaskView from './components/TaskView';
import AppsView from './components/AppsView';
import OnboardingScreen from './components/OnboardingScreen';
import CreateTeamModal from './components/CreateTeamModal';
import MembersModal from './components/MembersModal';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [clubName, setClubName] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [tasks, setTasks] = useState<{ [teamId: string]: Task[] }>({});
  const [teamApps, setTeamApps] = useState<{ [teamId: string]: AppIntegration[] }>({});
  
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'channel', id: 'general' });
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCreateTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [isMembersModalOpen, setMembersModalOpen] = useState(false);

  useEffect(() => {
    // The user who creates the workspace is always user-1, the Secretary
    const creator = users.find(u => u.id === USER_ID);
    if(creator){
      setCurrentUser({...creator, role: 'Secretary'});
    } else {
      setCurrentUser(users.find(u => u.id === USER_ID));
    }
  }, [users]);

  const handleGenerateWorkspace = (name: string, newTeams: { name: string; icon: React.ElementType }[], onboardingTeamApps: { [teamName: string]: string[] }) => {
    const initialData = initializeWorkspaceData(newTeams);
    
    setClubName(name);
    setUsers(initialData.users);
    setTeams(initialData.teams);
    setChannels(initialData.channels);
    setTasks(initialData.tasks);

    // Map onboarding apps to full AppIntegration objects and by team ID
    const newTeamApps: { [teamId: string]: AppIntegration[] } = {};
    initialData.teams.forEach(team => {
        const appNames = onboardingTeamApps[team.name] || [];
        newTeamApps[team.id] = AVAILABLE_APPS.filter(app => appNames.includes(app.name));
    });
    setTeamApps(newTeamApps);
    
    setIsInitialized(true);
  };

  const handleCreateTeam = (teamName: string, headId: string, coHead1Id: string, coHead2Id: string, icon: React.ElementType) => {
    const newTeamId = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newTeam: Team = {
      id: newTeamId,
      name: teamName,
      icon: icon,
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

    setTeams(prev => [...prev, newTeam]);
    setChannels(prev => [...prev, newChannel]);
    setUsers(updatedUsers);
    setTasks(prev => ({...prev, [newTeamId]: []}));
    // Default to a basic set of apps for newly created teams
    setTeamApps(prev => ({...prev, [newTeamId]: AVAILABLE_APPS.slice(0, 4)}));
  };

  const handleInviteUser = (email: string) => {
    const newUserId = `user-${Date.now()}`;
    const userName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newUser: User = {
      id: newUserId,
      name: userName,
      avatarUrl: `https://picsum.photos/seed/${newUserId}/40/40`,
      role: 'Member',
      // FIX: Added email to the new user object.
      email: email,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUserRole = (userId: string, newRole: Role, teamId?: string) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, role: newRole, teamId: teamId || user.teamId } : user
    ));
  };


  const availableChannels = useMemo(() => {
    if (!currentUser) return [];
    if (['Secretary', 'Coordinator', 'Joint Coordinator'].includes(currentUser.role)) {
      return channels;
    }
    return channels.filter(c => c.type !== 'team' || c.teamId === currentUser.teamId);
  }, [currentUser, channels]);
  
  const activeChannel = useMemo(() => channels.find(c => c.id === activeView.id), [activeView.id, channels]);
  const activeTeam = useMemo(() => teams.find(t => t.id === activeChannel?.teamId), [activeChannel, teams]);
  const activeTeamApps = useMemo(() => activeTeam ? teamApps[activeTeam.id] || [] : [], [activeTeam, teamApps]);

  const renderActiveView = () => {
    if (!currentUser || !activeChannel) return <div className="p-8">Loading your workspace...</div>;
    
    switch (activeView.type) {
      case 'channel':
        return <ChatView channel={activeChannel} currentUser={currentUser} allUsers={users} />;
      case 'tasks':
        return <TaskView channel={activeChannel} currentUser={currentUser} team={activeTeam} tasks={tasks} users={users} />;
      case 'apps':
        return <AppsView channel={activeChannel} apps={activeTeamApps} />
      default:
        return null;
    }
  };

  if (!isInitialized) {
    return <OnboardingScreen onGenerateWorkspace={handleGenerateWorkspace} />;
  }

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-900 font-sans">
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
          channels={availableChannels}
          teams={teams}
          activeChannelId={activeView.id}
          onSelectChannel={(channelId) => {
              setActiveView({ type: 'channel', id: channelId });
              if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          onOpenCreateTeamModal={() => setCreateTeamModalOpen(true)}
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
        />
        <div className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
};

export default App;