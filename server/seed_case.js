const { saveCase } = require('./src/services/dbService');
const { v4: uuidv4 } = require('uuid');

const seedData = async () => {
    const caseData = {
        patientName: 'Test Patient',
        symptomsRaw: 'Severe headache and dizziness',
        aiSummary: 'Patient reports neurological symptoms.',
        suggestedUrgency: 3,
        suggestedSpecialist: 'Neurologist',
        aiData: {}
    };

    console.log("Seeding case...");
    const result = await saveCase(caseData);
    console.log("Seeded:", result);
};

seedData();
