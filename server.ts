import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_PATH = path.resolve(process.cwd(), 'db.json');

app.use(cors());
app.use(express.json());

// Helper to read DB
async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        if (!data || data.trim() === '') throw new Error('Empty file');
        return JSON.parse(data);
    } catch (error) {
        // Return default structure if file doesn't exist or is invalid
        return {
            clubName: '',
            isInitialized: false,
            users: [],
            teams: [],
            channels: [],
            tasks: {},
            events: [],
            messages: {
                'general': [
                    { id: 'msg-g1', text: 'Welcome to the club workspace!', userId: 'user-1', timestamp: '10:30 AM' },
                ],
                'announcements': [
                    { id: 'msg-a1', text: 'IMPORTANT: First all-hands meeting is this Friday. Please be there!', userId: 'user-1', timestamp: '9:00 AM' },
                ]
            },
            teamApps: {}
        };
    }
}

// Helper to write DB
async function writeDB(data: any) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/data', async (req, res) => {
    const data = await readDB();
    if (!data) {
        return res.json({ isInitialized: false });
    }
    res.json(data);
});

app.post('/api/data', async (req, res) => {
    const newData = req.body;
    const oldData = await readDB();
    
    // Preserve messages if they exist in old data but not in new data
    if (oldData.messages && !newData.messages) {
        newData.messages = oldData.messages;
    }
    
    await writeDB(newData);
    res.json({ success: true });
});

app.post('/api/reset', async (req, res) => {
    try {
        await fs.unlink(DB_PATH);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: true }); // Already deleted or doesn't exist
    }
});

app.post('/api/messages', async (req, res) => {
    const { channelId, message } = req.body;
    const data = await readDB();
    if (data) {
        if (!data.messages) data.messages = {};
        if (!data.messages[channelId]) data.messages[channelId] = [];
        data.messages[channelId].push(message);
        await writeDB(data);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'DB not initialized' });
    }
});

app.post('/api/messages/react', async (req, res) => {
    const { channelId, messageId, emoji, userId } = req.body;
    const data = await readDB();
    if (data && data.messages && data.messages[channelId]) {
        const message = data.messages[channelId].find((m: any) => m.id === messageId);
        if (message) {
            if (!message.reactions) message.reactions = {};
            if (!message.reactions[emoji]) message.reactions[emoji] = [];
            
            const index = message.reactions[emoji].indexOf(userId);
            if (index > -1) {
                message.reactions[emoji].splice(index, 1);
                if (message.reactions[emoji].length === 0) delete message.reactions[emoji];
            } else {
                message.reactions[emoji].push(userId);
            }
            await writeDB(data);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

app.post('/api/messages/edit', async (req, res) => {
    const { channelId, messageId, text } = req.body;
    const data = await readDB();
    if (data && data.messages && data.messages[channelId]) {
        const message = data.messages[channelId].find((m: any) => m.id === messageId);
        if (message) {
            message.text = text;
            message.isEdited = true;
            await writeDB(data);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

app.post('/api/messages/delete', async (req, res) => {
    const { channelId, messageId } = req.body;
    const data = await readDB();
    if (data && data.messages && data.messages[channelId]) {
        data.messages[channelId] = data.messages[channelId].filter((m: any) => m.id !== messageId);
        await writeDB(data);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

app.get('/api/messages/:channelId', async (req, res) => {
    const { channelId } = req.params;
    const data = await readDB();
    if (data && data.messages) {
        res.json(data.messages[channelId] || []);
    } else {
        res.json([]);
    }
});

async function startServer() {
    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static('dist'));
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
