/**
 * Calculates urgency score (1-5) based on symptoms and AI analysis.
 * 1: Routine (Prescription refill, mild cold)
 * 2: Non-Urgent (Rash, low fever)
 * 3: Urgent (High fever, deep cut)
 * 4: Emergency (Chest pain, difficulty breathing)
 * 5: Critical (Unconscious, severe trauma)
 * 
 * @param {string} symptoms - The raw symptom text
 * @param {object} aiAnalysis - Structured data from AI
 * @returns {number} urgencyScore
 */
const calculateUrgency = (symptoms, aiAnalysis) => {
    let score = 2; // Default to Non-Urgent
    const lowerSymptoms = symptoms.toLowerCase();

    // Critical keywords
    const criticalKeywords = ['chest pain', 'heart attack', 'stroke', 'unconscious', 'not breathing', 'severe bleeding'];
    // Urgent keywords
    const urgentKeywords = ['high fever', 'broken bone', 'deep cut', 'difficulty breathing', 'severe pain'];

    // Check for critical keywords
    if (criticalKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
        return 5;
    }

    // Check for urgent keywords
    if (urgentKeywords.some(keyword => lowerSymptoms.includes(keyword))) {
        return 4; // Upgrade to Emergency if mainly urgent keys are found for safety
    }

    if (aiAnalysis && aiAnalysis.suggestedUrgency) {
        // Trust AI but cap at 4 unless critical keywords are present
        return Math.min(aiAnalysis.suggestedUrgency, 5);
    }

    return score;
};

module.exports = { calculateUrgency };
