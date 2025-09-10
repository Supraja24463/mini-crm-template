
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DB_FILE = './db.json';
const JWT_SECRET = 'your_jwt_secret';

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
});

app.get('/api/leads', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, JWT_SECRET);
        const db = readDB();
        res.json(db.leads);
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.post('/api/leads', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    try {
        jwt.verify(token, JWT_SECRET);
        const db = readDB();
        const newLead = { id: Date.now(), ...req.body };
        db.leads.push(newLead);
        writeDB(db);
        res.json(newLead);
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
