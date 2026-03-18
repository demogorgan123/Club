import { User, Team, Channel, Task, Message, AppIntegration, Role } from '../types';
import { supabase } from '../lib/supabase';

const WORKSPACE_ID = '00000000-0000-0000-0000-000000000001';

export const api = {
    async getData() {
        if (!supabase) return { isInitialized: false };
        
        try {
            const { data, error } = await supabase
                .from('workspace_data')
                .select('*')
                .eq('id', WORKSPACE_ID)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    // No record found, return uninitialized state
                    return { isInitialized: false };
                }
                console.error('Supabase fetch error:', error);
                return { isInitialized: false };
            }
            
            return data?.data || { isInitialized: false };
        } catch (e) {
            console.error('Unexpected error fetching data:', e);
            return { isInitialized: false };
        }
    },

    async saveData(data: any) {
        if (!supabase) return { status: 'error' };
        
        try {
            const { error } = await supabase
                .from('workspace_data')
                .upsert({ id: WORKSPACE_ID, data: data });
            
            if (error) {
                console.error('Supabase save error:', error);
                return { status: 'error' };
            }
            return { status: 'ok' };
        } catch (e) {
            console.error('Unexpected error saving data:', e);
            return { status: 'error' };
        }
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
        if (supabase) {
            try {
                await supabase.from('workspace_data').delete().eq('id', WORKSPACE_ID);
            } catch (e) {
                console.error('Supabase reset error:', e);
            }
        }
        return { status: 'ok' };
    }
};
