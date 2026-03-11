import { User, Team, Channel, Task, Message, AppIntegration, Role } from '../types';

const API_BASE = '/api';

export const api = {
    async getData() {
        const res = await fetch(`${API_BASE}/data`);
        return res.json();
    },

    async saveData(data: any) {
        const res = await fetch(`${API_BASE}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },

    async addMessage(channelId: string, message: Message) {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId, message })
        });
        return res.json();
    }
};
