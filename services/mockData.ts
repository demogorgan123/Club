import { User, Team, Channel, Message, Task, ChannelType, TaskStatus } from '../types';

// A pool of icons to be assigned to new teams
export const initializeWorkspaceData = (teamsToCreate: { name: string; icon: React.ElementType }[]) => {

    const teams: Team[] = teamsToCreate.map((teamData) => ({
      id: teamData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: teamData.name,
      icon: teamData.icon,
    }));

    // FIX: Added email addresses to mock user data.
    const users: User[] = [
      // Club Leadership
      { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/alex/40/40', role: 'Secretary', email: 'alex.j@example.com' },
      { id: 'user-2', name: 'Brenda Smith', avatarUrl: 'https://picsum.photos/seed/brenda/40/40', role: 'Coordinator', email: 'brenda.s@example.com' },
      { id: 'user-3', name: 'Charlie Davis', avatarUrl: 'https://picsum.photos/seed/charlie/40/40', role: 'Joint Coordinator', email: 'charlie.d@example.com' },
      // General Members pool
      { id: 'user-4', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/40/40', role: 'Member', email: 'diana.p@example.com' },
      { id: 'user-5', name: 'Ethan Hunt', avatarUrl: 'https://picsum.photos/seed/ethan/40/40', role: 'Member', email: 'ethan.h@example.com' },
      { id: 'user-6', name: 'Fiona Glenanne', avatarUrl: 'https://picsum.photos/seed/fiona/40/40', role: 'Member', email: 'fiona.g@example.com' },
      { id: 'user-7', name: 'George Costanza', avatarUrl: 'https://picsum.photos/seed/george/40/40', role: 'Member', email: 'george.c@example.com' },
      { id: 'user-8', name: 'Hank Hill', avatarUrl: 'https://picsum.photos/seed/hank/40/40', role: 'Member', email: 'hank.h@example.com' },
      { id: 'user-9', name: 'Iris West', avatarUrl: 'https://picsum.photos/seed/iris/40/40', role: 'Member', email: 'iris.w@example.com' },
      { id: 'user-10', name: 'Jack Sparrow', avatarUrl: 'https://picsum.photos/seed/jack/40/40', role: 'Member', email: 'jack.s@example.com' },
      { id: 'user-11', name: 'Kara Danvers', avatarUrl: 'https://picsum.photos/seed/kara/40/40', role: 'Member', email: 'kara.d@example.com' },
      { id: 'user-12', name: 'Lois Lane', avatarUrl: 'https://picsum.photos/seed/lois/40/40', role: 'Member', email: 'lois.l@example.com' },
      { id: 'user-13', name: 'Mike Ross', avatarUrl: 'https://picsum.photos/seed/mike/40/40', role: 'Member', email: 'mike.r@example.com' },
    ];
    
    const generalChannels: Channel[] = [
      { id: 'general', name: 'general', type: ChannelType.GENERAL },
      { id: 'announcements', name: 'announcements', type: ChannelType.ANNOUNCEMENTS },
    ];

    const teamChannels: Channel[] = teams.map(team => ({
        id: `${team.id}-chat`,
        name: team.name.toLowerCase().replace(/\s+/g, '-'),
        type: ChannelType.TEAM,
        teamId: team.id,
    }));
    
    const channels = [...generalChannels, ...teamChannels];

    const tasks: { [teamId: string]: Task[] } = {};
    teams.forEach(team => {
        tasks[team.id] = [];
    });

    return { users, teams, channels, tasks };
}


export const getMessagesForChannel = (channelId: string) => {
    const messages: { [channelId: string]: Message[] } = {
      'general': [
        { id: 'msg-g1', text: 'Welcome to the club workspace!', userId: 'user-1', timestamp: '10:30 AM' },
        { id: 'msg-g2', text: 'Hey everyone, glad to be here.', userId: 'user-4', timestamp: '10:31 AM' },
      ],
      'announcements': [
        { id: 'msg-a1', text: 'IMPORTANT: First all-hands meeting is this Friday. Please be there!', userId: 'user-1', timestamp: '9:00 AM' },
      ],
    };
    return messages[channelId] || [];
}

export const USER_ID = 'user-1';