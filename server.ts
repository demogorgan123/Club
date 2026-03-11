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
        return JSON.parse(data);
    } catch (error) {
        // Return default structure if file doesn't exist
        return {
            clubName: '',
            isInitialized: false,
            users: [],
            teams: [],
            channels: [],
            tasks: {},
            messages: {
                'general': [
                    { id: 'msg-g1', text: 'Welcome to the club workspace!', userId: 'user-1', timestamp: '10:30 AM' },
                    { id: 'msg-g2', text: 'Hey everyone, glad to be here.', userId: 'user-4', timestamp: '10:31 AM' },
                ],
                'announcements': [
                    { id: 'msg-a1', text: 'IMPORTANT: First all-hands meeting is this Friday. Please be there!', userId: 'user-1', timestamp: '9:00 AM' },
                ],
                'dm-user-1-user-2': [
                    { id: 'msg-dm1', text: 'Hey Brenda, do you have the latest budget report?', userId: 'user-1', timestamp: '11:00 AM' },
                    { id: 'msg-dm2', text: 'Yes, sending it over shortly.', userId: 'user-2', timestamp: '11:05 AM' },
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
    await writeDB(req.body);
    res.json({ success: true });
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
