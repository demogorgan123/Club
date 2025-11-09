import { FileText, FileSpreadsheet, Presentation, FolderOpen, Map, Image as ImageIcon, Github, Palette, Instagram, Linkedin, Twitter, ClipboardList, Calendar } from 'lucide-react';
import { AppIntegration } from '../types';

export const AVAILABLE_APPS: AppIntegration[] = [
    // Google Suite
    { name: 'Docs', icon: FileText, color: 'text-blue-400' },
    { name: 'Sheets', icon: FileSpreadsheet, color: 'text-green-400' },
    { name: 'Slides', icon: Presentation, color: 'text-yellow-400' },
    { name: 'Drive', icon: FolderOpen, color: 'text-gray-400' },
    { name: 'Forms', icon: ClipboardList, color: 'text-purple-400' },
    { name: 'Calendar', icon: Calendar, color: 'text-red-400' },
    // Developer
    { name: 'GitHub', icon: Github, color: 'text-gray-200' },
    // Design
    { name: 'Canva', icon: Palette, color: 'text-indigo-400' },
    { name: 'Photos', icon: ImageIcon, color: 'text-pink-400' },
    // Social
    { name: 'Instagram', icon: Instagram, color: 'text-rose-500' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-sky-500' },
    { name: 'X (Twitter)', icon: Twitter, color: 'text-gray-300' },
     // Misc
    { name: 'Maps', icon: Map, color: 'text-teal-400' },
];
