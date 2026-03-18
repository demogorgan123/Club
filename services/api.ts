import { User, Team, Channel, Task, Message, AppIntegration, Role } from '../types';
import { supabase } from '../lib/supabase';
import { mockWorkspaceData } from './mockData';

const STORAGE_KEY = 'club_workspace_data';

// Helper to get data from LocalStorage
const getLocalData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
};

// Helper to save data to LocalStorage
const saveLocalData = (data: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const api = {
    async getData() {
        if (supabase) {
            try {
                const { data, error } = await supabase.from('workspace_data').select('*').single();
                if (!error && data) return data.content;
            } catch (e) {
                console.error('Supabase fetch error:', e);
            }
        }
        
        // Fallback to LocalStorage
        const localData = getLocalData();
        if (localData) return localData;

        // Default to Mock Data
        return mockWorkspaceData;
    },

    async saveData(data: any) {
        if (supabase) {
            try {
                const { error } = await supabase.from('workspace_data').upsert({ id: 1, content: data });
                if (!error) return { status: 'ok' };
            } catch (e) {
                console.error('Supabase save error:', e);
            }
        }
        
        // Fallback to LocalStorage
        saveLocalData(data);
        return { status: 'ok' };
    },

    async getMessages(channelId: string) {
        const data = await this.getData();
        if (!data || !data.messages) return [];
        return data.messages[channelId] || [];
    },

    async addMessage(channelId: string, message: Message) {
        const data = await this.getData();
        if (!data) return { status: 'error' };
        
        if (!data.messages) data.messages = {};
        if (!data.messages[channelId]) data.messages[channelId] = [];
        
        data.messages[channelId].push(message);
        return this.saveData(data);
    },

    async reactToMessage(channelId: string, messageId: string, emoji: string, userId: string) {
        const data = await this.getData();
        if (!data || !data.messages || !data.messages[channelId]) return { status: 'error' };
        
        const message = data.messages[channelId].find((m: Message) => m.id === messageId);
        if (message) {
            if (!message.reactions) message.reactions = {};
            if (!message.reactions[emoji]) message.reactions[emoji] = [];
            
            const userIndex = message.reactions[emoji].indexOf(userId);
            if (userIndex === -1) {
                message.reactions[emoji].push(userId);
            } else {
                message.reactions[emoji].splice(userIndex, 1);
            }
        }
        
        return this.saveData(data);
    },

    async editMessage(channelId: string, messageId: string, text: string) {
        const data = await this.getData();
        if (!data || !data.messages || !data.messages[channelId]) return { status: 'error' };
        
        const message = data.messages[channelId].find((m: Message) => m.id === messageId);
        if (message) {
            message.text = text;
            message.isEdited = true;
        }
        
        return this.saveData(data);
    },

    async deleteMessage(channelId: string, messageId: string) {
        const data = await this.getData();
        if (!data || !data.messages || !data.messages[channelId]) return { status: 'error' };
        
        data.messages[channelId] = data.messages[channelId].filter((m: Message) => m.id !== messageId);
        return this.saveData(data);
    },

    async resetWorkspace() {
        localStorage.removeItem(STORAGE_KEY);
        if (supabase) {
            try {
                await supabase.from('workspace_data').delete().eq('id', 1);
            } catch (e) {
                console.error('Supabase reset error:', e);
            }
        }
        return { status: 'ok' };
    }
};
