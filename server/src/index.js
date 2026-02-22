const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const path = require('path');

dotenv.config();

const helmet = require('helmet');

// ... imports

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Allow local frontend ports
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    // Sanitize log: Only log method and path, exclude query params if sensitive
    const safeUrl = req.url.split('?')[0];
    console.log(`Incoming request: ${req.method} ${safeUrl}`);
    next();
});

// Routes
console.log('Registering /api routes from index.js');
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
    res.send('Healthcare Triage API is running');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
