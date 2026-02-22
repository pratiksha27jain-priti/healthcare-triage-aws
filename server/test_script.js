const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testFlow() {
    try {
        console.log('--- TEST START ---');

        // 1. Test Intake Validation (Should Fail)
        console.log('\n1. Testing Intake Validation (Short symptoms)...');
        try {
            await axios.post(`${API_URL}/intake`, {
                patientName: 'Test Patient',
                symptoms: 'Too short'
            });
        } catch (error) {
            console.log('EXPECTED ERROR:', JSON.stringify(error.response?.data?.error || error.message));
        }

        // 2. Register & Login Clinician
        console.log('\n2. Testing Auth (Register/Login)...');
        const username = `doc_${Date.now()}`;
        const password = 'password123';

        await axios.post(`${API_URL}/auth/register`, { username, password });
        console.log('User registered:', username);

        const loginRes = await axios.post(`${API_URL}/auth/login`, { username, password });
        const token = loginRes.data.token;
        console.log('Login successful. Token received.');

        // 3. Access Protected Route
        console.log('\n3. Accessing Protected Route (/cases)...');
        const casesRes = await axios.get(`${API_URL}/cases`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Access granted. Cases count:', casesRes.data.length);

        console.log('\n--- TEST PASS ---');

    } catch (error) {
        console.error('\nTEST FAILED:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

testFlow();
