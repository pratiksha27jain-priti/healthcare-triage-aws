const axios = require('axios');

async function seedUser() {
    try {
        const username = 'clinician';
        const password = 'password123';

        console.log(`Attempting to register user: ${username}`);
        await axios.post('http://localhost:3000/api/auth/register', { username, password });
        console.log('SUCCESS: User registered.');
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.log('User already exists (clinician).');
        } else {
            console.error('Registration Failed:', error.message);
        }
    }
}

seedUser();
