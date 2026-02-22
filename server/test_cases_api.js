const axios = require('axios');
const jwt = require('jsonwebtoken');

// Mock context matching server
const JWT_SECRET = 'dev_secret_key_123'; // Hardcoded from auth.js for testing
const token = jwt.sign({ username: 'clinician', role: 'clinician' }, JWT_SECRET, { expiresIn: '1h' });

console.log("Generated Token:", token);

axios.get('http://localhost:3000/api/cases', {
    headers: { Authorization: `Bearer ${token}` }
})
    .then(res => {
        console.log("Status:", res.status);
        console.log("Data:", JSON.stringify(res.data, null, 2));
    })
    .catch(err => {
        console.error("Error:", err.message);
        if (err.response) {
            console.error("Response:", err.response.data);
        }
    });
