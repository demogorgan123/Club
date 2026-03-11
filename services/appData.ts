import React from 'react';
import { FileText, FileSpreadsheet, Presentation, FolderOpen, Map, Image as ImageIcon, Github, Instagram, Linkedin, Twitter, ClipboardList, Calendar, Palette as PaletteIcon } from 'lucide-react';
import { AppIntegration } from '../types';

export const AVAILABLE_APPS: AppIntegration[] = [
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

export const getAppIcon = (iconId: string) => {
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
