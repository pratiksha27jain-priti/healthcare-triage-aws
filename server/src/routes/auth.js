const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUser } = require('../services/userService');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
console.log('Initializing Auth Routes in auth.js');
router.get('/ping', (req, res) => res.send('Auth Pong'));

router.post('/register', async (req, res) => {
    console.log('Hit /register endpoint');
    const { username, password } = req.body;
    if (!username || !password) return res.sendStatus(400);

    const existingUser = await findUser(username);
    if (existingUser) return res.status(409).send('User already exists');

    await createUser(username, password);
    res.status(201).send('User registered');
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await findUser(username);

    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(password, user.passwordHash || user.password); // specific fallback for in-mem vs DB
    if (!validPassword) return res.status(403).send('Invalid password');

    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
});

module.exports = router;
