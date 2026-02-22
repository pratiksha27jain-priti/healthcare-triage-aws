const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || 'HealthcareTriageCases';

const casesFallback = [
    {
        id: 'dummy-case-1',
        timestamp: new Date().toISOString(),
        patientName: 'John Doe',
        symptomsRaw: 'Experiencing severe chest pain and shortness of breath.',
        aiSummary: 'Patient reports potential cardiac symptoms.',
        suggestedUrgency: 5,
        suggestedSpecialist: 'Cardiologist',
        aiData: {}
    },
    {
        id: 'dummy-case-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        patientName: 'Jane Smith',
        symptomsRaw: 'Mild headache and fatigue.',
        aiSummary: 'Patient reports common viral symptoms.',
        suggestedUrgency: 2,
        suggestedSpecialist: 'General Practitioner',
        aiData: {}
    }
];

const saveCase = async (caseData) => {
    const id = uuidv4();
    const newCase = {
        id,
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        ...caseData
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newCase
    });

    try {
        await docClient.send(command);
        return newCase;
    } catch (error) {
        console.warn("DynamoDB Save Failed, using in-memory:", error.message);
        casesFallback.push(newCase);
        return newCase;
    }
};

const getAllCases = async () => {
    const command = new ScanCommand({
        TableName: TABLE_NAME
    });

    try {
        const response = await docClient.send(command);
        return response.Items;
    } catch (error) {
        console.warn("DynamoDB Scan Failed, returning in-memory:", error.message);
        return casesFallback;
    }
};

module.exports = { saveCase, getAllCases };
