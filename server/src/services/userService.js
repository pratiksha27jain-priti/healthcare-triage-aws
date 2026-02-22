const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const docClient = DynamoDBDocumentClient.from(client);
const USERS_TABLE = process.env.USERS_TABLE || 'HealthcareTriageUsers';

// In-memory fallback for demo
const users = [
    {
        username: 'clinician',
        passwordHash: '$2b$10$3Zy01n3r0.XxgOBF8LjPV.2gw19Fd2DYn46y/h092PVHDoD/psLtW', // password123
        role: 'clinician'
    }
];

const createUser = async (username, password, role = 'clinician') => {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { username, passwordHash, role };

    const command = new PutCommand({
        TableName: USERS_TABLE,
        Item: newUser
    });

    try {
        await docClient.send(command);
        return { username, role };
    } catch (error) {
        console.warn("DB Save Failed, using in-memory:", error.message);
        users.push(newUser);
        return { username, role };
    }
};

const findUser = async (username) => {
    const command = new GetCommand({
        TableName: USERS_TABLE,
        Key: { username }
    });

    try {
        const response = await docClient.send(command);
        if (response.Item) return response.Item;
    } catch (error) {
        // Fallback to in-memory
    }
    return users.find(u => u.username === username);
};

module.exports = { createUser, findUser };
