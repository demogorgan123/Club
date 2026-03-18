import React from 'react';
import { 
    FileText, FileSpreadsheet, Presentation, FolderOpen, Map, 
    Image as ImageIcon, Github, Instagram, Linkedin, Twitter, 
    ClipboardList, Calendar, Palette as PaletteIcon,
    Bot, Code, Lightbulb, Mic, BookOpen, Brush, Award, Mountain,
    Briefcase, Palette, Share2, Users, Camera, Clapperboard, FlaskConical, 
    BarChart, Film, Megaphone, Target, Drama, Music, Gamepad2, Rocket, Newspaper
} from 'lucide-react';
import { AppIntegration } from './types';

export const AVAILABLE_APPS_LIST: AppIntegration[] = [
    // Google Suite
    { name: 'Docs', iconId: 'file-text', color: 'text-blue-400' },
    { name: 'Sheets', iconId: 'file-spreadsheet', color: 'text-green-400' },
    { name: 'Slides', iconId: 'presentation', color: 'text-yellow-400' },
    { name: 'Drive', iconId: 'folder-open', color: 'text-gray-400' },
    { name: 'Forms', iconId: 'clipboard-list', color: 'text-purple-400' },
    { name: 'Calendar', iconId: 'calendar', color: 'text-red-400' },
    // Developer
    { name: 'GitHub', iconId: 'github', color: 'text-gray-200' },
    // Design
    { name: 'Canva', iconId: 'palette', color: 'text-indigo-400' },
    { name: 'Photos', iconId: 'image', color: 'text-pink-400' },
    // Social
    { name: 'Instagram', iconId: 'instagram', color: 'text-rose-500' },
    { name: 'LinkedIn', iconId: 'linkedin', color: 'text-sky-500' },
    { name: 'X (Twitter)', iconId: 'twitter', color: 'text-gray-300' },
     // Misc
    { name: 'Maps', iconId: 'map', color: 'text-teal-400' },
];

export const getAppIconById = (iconId: string) => {
    const icons: { [key: string]: React.ElementType } = {
        'file-text': FileText,
        'file-spreadsheet': FileSpreadsheet,
        'presentation': Presentation,
        'folder-open': FolderOpen,
        'map': Map,
        'image': ImageIcon,
        'github': Github,
        'palette': PaletteIcon,
        'instagram': Instagram,
        'linkedin': Linkedin,
        'twitter': Twitter,
        'clipboard-list': ClipboardList,
        'calendar': Calendar
    };
    return icons[iconId] || FileText;
};

export interface ClubType {
    name: string;
    description: string;
    icon: React.ElementType;
    defaultTeams: string[];
}

export interface ClubCategory {
    name: string;
    clubs: ClubType[];
}

export const CLUB_CATEGORIES: ClubCategory[] = [
    {
        name: 'Technical & Professional',
        clubs: [
            {
                name: 'Robotics and Automation Club',
                description: 'Design, build, and program intelligent systems and robots.',
                icon: Bot,
                defaultTeams: ['Mechanical Design', 'Electronics & Circuitry', 'Software & AI']
            },
            {
                name: 'Coding & Programming Club',
                description: 'Nurture algorithmic thinking and software development skills.',
                icon: Code,
                defaultTeams: ['Competitive Programming', 'Development & Projects', 'Workshop Team']
            },
            {
                name: 'Entrepreneurship Cell (E-Cell)',
                description: 'Promote and support the startup ecosystem on campus.',
                icon: Lightbulb,
                defaultTeams: ['Events & Outreach', 'Incubation & Mentorship', 'Content & Marketing']
            },
        ]
    },
    {
        name: 'Cultural & Literary',
        clubs: [
             {
                name: 'Dramatics Club',
                description: 'Dedicated to the art of theatre and performance.',
                icon: Mic,
                defaultTeams: ['Actors\' Troupe', 'Scriptwriting & Direction', 'Production & Backstage']
            },
            {
                name: 'Literary & Debating Society',
                description: 'Enhance critical thinking, rhetoric, and writing skills.',
                icon: BookOpen,
                defaultTeams: ['Debate Team', 'Publications Team', 'Quizzing Team']
            },
            {
                name: 'Music and Fine Arts Club',
                description: 'Foster artistic talent in music, painting, and visual media.',
                icon: Brush,
                defaultTeams: ['Music Production', 'Visual Arts', 'Live Performance']
            },
        ]
    },
    {
        name: 'Sports & Wellness',
        clubs: [
            {
                name: 'Sports Clubs (General)',
                description: 'Manage and train college-level sports teams like Cricket, Football, etc.',
                icon: Award,
                defaultTeams: ['Team Selection & Training', 'Match Management', 'Intramural Events']
            },
            {
                name: 'Adventure and Wellness Club',
                description: 'Focus on outdoor activities, physical conditioning, and mental well-being.',
                icon: Mountain,
                defaultTeams: ['Trekking & Expedition', 'Fitness & Yoga', 'Awareness Campaigns']
            }
        ]
    },
];

export const getTeamsByClubName = (clubName: string): string[] => {
    for (const category of CLUB_CATEGORIES) {
        const club = category.clubs.find(c => c.name === clubName);
        if (club) {
            return [...club.defaultTeams];
        }
    }
    return ['General Management', 'Events', 'Marketing'];
};

interface IconInfo {
    id: string;
    icon: React.ElementType;
}

export const TEAM_ICONS: IconInfo[] = [
    { id: 'briefcase', icon: Briefcase },
    { id: 'palette', icon: Palette },
    { id: 'share', icon: Share2 },
    { id: 'users', icon: Users },
    { id: 'camera', icon: Camera },
    { id: 'clapperboard', icon: Clapperboard },
    { id: 'flask', icon: FlaskConical },
    { id: 'mic', icon: Mic },
    { id: 'barchart', icon: BarChart },
    { id: 'book', icon: BookOpen },
    { id: 'code', icon: Code },
    { id: 'film', icon: Film },
    { id: 'megaphone', icon: Megaphone },
    { id: 'bot', icon: Bot },
    { id: 'lightbulb', icon: Lightbulb },
    { id: 'award', icon: Award },
    { id: 'mountain', icon: Mountain },
    { id: 'brush', icon: Brush },
    { id: 'target', icon: Target },
    { id: 'drama', icon: Drama },
    { id: 'music', icon: Music },
    { id: 'gamepad', icon: Gamepad2 },
    { id: 'rocket', icon: Rocket },
    { id: 'newspaper', icon: Newspaper },
];

export const getTeamIcon = (iconId: string) => {
    return TEAM_ICONS.find(i => i.id === iconId)?.icon || TEAM_ICONS[0].icon;
};
