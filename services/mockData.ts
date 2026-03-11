import { User, Team, Channel, Message, Task, ChannelType, TaskStatus } from '../types';

// A pool of icons to be assigned to new teams
export const initializeWorkspaceData = (teamsToCreate: { name: string; iconId: string }[]) => {

    const teams: Team[] = teamsToCreate.map((teamData) => ({
      id: teamData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: teamData.name,
      iconId: teamData.iconId,
    }));

    // Start with only the Secretary (the person creating the workspace)
    const users: User[] = [
      { id: 'user-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/alex/40/40', role: 'Secretary', email: 'alex.j@example.com' },
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
      ],
      'announcements': [
        { id: 'msg-a1', text: 'IMPORTANT: First all-hands meeting is this Friday. Please be there!', userId: 'user-1', timestamp: '9:00 AM' },
      ]
    };
    return messages[channelId] || [];
}

export const USER_ID = 'user-1';