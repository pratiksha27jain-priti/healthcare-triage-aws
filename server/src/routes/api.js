const express = require('express');
const router = express.Router();
const { extractSymptoms } = require('../services/aiService');
const { calculateUrgency } = require('../utils/triageLogic');
const { saveCase, getAllCases } = require('../services/dbService');
const { authenticateToken } = require('../middleware/auth');
const authRoutes = require('./auth');

// Auth Routes
// Auth Routes
console.log('Mounting /auth routes');
router.use('/auth', authRoutes);

const { validateIntake } = require('../middleware/validation');

// POST /api/intake - Patient submits symptoms (Public)
router.post('/intake', validateIntake, async (req, res) => {
    try {
        const { patientName, symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: 'Symptoms are required' });
        }

        // 1. AI Extraction
        const aiAnalysis = await extractSymptoms(symptoms);

        // 2. Risk Scoring (Triage)
        const urgencyScore = calculateUrgency(symptoms, aiAnalysis);

        // 3. Construct Case Data
        const caseData = {
            patientName: patientName || 'Anonymous',
            symptomsRaw: symptoms,
            aiSummary: aiAnalysis.summary,
            suggestedUrgency: urgencyScore,
            suggestedSpecialist: aiAnalysis.specialist,
            aiData: aiAnalysis // Store full AI response for debugging
        };

        // 4. Save to DB
        const savedCase = await saveCase(caseData);

        res.status(201).json({
            message: 'Intake processed successfully',
            data: savedCase
        });

    } catch (error) {
        console.error('Intake Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/cases - Clinician dashboard data (Protected)
router.get('/cases', authenticateToken, async (req, res) => {
    try {
        const cases = await getAllCases();
        // Sort by urgency (descending)
        cases.sort((a, b) => b.suggestedUrgency - a.suggestedUrgency);
        res.json(cases);
    } catch (error) {
        console.error('Get Cases Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

