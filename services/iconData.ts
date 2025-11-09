import React from 'react';
import { Briefcase, Palette, Share2, Users, Camera, Clapperboard, FlaskConical, Mic, BarChart, BookOpen, Code, Film, Megaphone, Bot, Lightbulb, Award, Mountain, Brush, Target, Drama, Music, Gamepad2, Rocket, Newspaper } from 'lucide-react';

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
