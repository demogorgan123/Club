import React from 'react';
import { Bot, Code, Lightbulb, Mic, BookOpen, Brush, Award, Mountain } from 'lucide-react';

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

export const clubData: ClubCategory[] = [
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

export const getTeamsForClubType = (clubName: string): string[] => {
    for (const category of clubData) {
        const club = category.clubs.find(c => c.name === clubName);
        if (club) {
            return [...club.defaultTeams]; // Return a copy
        }
    }
    // A sensible fallback if a type is not found
    return ['General Management', 'Events', 'Marketing'];
};
