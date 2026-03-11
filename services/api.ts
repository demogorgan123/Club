import { User, Team, Channel, Task, Message, AppIntegration, Role } from '../types';

const API_BASE = '/api';

async function handleResponse(res: Response) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error (${res.status}): ${text.slice(0, 100)}`);
    }
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${contentType || 'unknown'}: ${text.slice(0, 100)}`);
    }
    return res.json();
}

export const api = {
    async getData() {
        const res = await fetch(`${API_BASE}/data`);
        return handleResponse(res);
    },

    async saveData(data: any) {
        const res = await fetch(`${API_BASE}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(res);
    },

    async getMessages(channelId: string) {
        const res = await fetch(`${API_BASE}/messages/${channelId}`);
        return handleResponse(res);
    },

    async addMessage(channelId: string, message: Message) {
        const res = await fetch(`${API_BASE}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId, message })
        });
        return handleResponse(res);
    },

    async reactToMessage(channelId: string, messageId: string, emoji: string, userId: string) {
        const res = await fetch(`${API_BASE}/messages/react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId, messageId, emoji, userId })
        });
        return handleResponse(res);
    },

    async editMessage(channelId: string, messageId: string, text: string) {
        const res = await fetch(`${API_BASE}/messages/edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId, messageId, text })
        });
        return handleResponse(res);
    },

    async deleteMessage(channelId: string, messageId: string) {
        const res = await fetch(`${API_BASE}/messages/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ channelId, messageId })
        });
        return handleResponse(res);
    },

    async resetWorkspace() {
        const res = await fetch(`${API_BASE}/reset`, {
            method: 'POST'
        });
        return handleResponse(res);
    }
};
