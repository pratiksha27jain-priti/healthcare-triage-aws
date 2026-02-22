const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const extractSymptoms = async (text) => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
        // Mock response if no API key
        return {
            symptoms: ['Mock Symptom 1', 'Mock Symptom 2'],
            suggestedUrgency: 2,
            summary: 'Mock AI Summary: Patient reported mock symptoms.',
            specialist: 'General Practitioner'
        };
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a medical triage assistant. Extract symptoms, suggest an urgency score (1-5), summarize the condition, and recommend a specialist type. Return JSON." },
                { role: "user", content: `Patient complains of: ${text}` }
            ],
            functions: [
                {
                    name: "triage_patient",
                    description: "Extracts triage information",
                    parameters: {
                        type: "object",
                        properties: {
                            symptoms: { type: "array", items: { type: "string" } },
                            suggestedUrgency: { type: "integer", minimum: 1, maximum: 5 },
                            summary: { type: "string" },
                            specialist: { type: "string" }
                        },
                        required: ["symptoms", "suggestedUrgency", "summary", "specialist"]
                    }
                }
            ],
            function_call: { name: "triage_patient" }
        });

        const functionArgs = JSON.parse(completion.choices[0].message.function_call.arguments);
        return functionArgs;
    } catch (error) {
        console.error("OpenAI Error:", error);
        return {
            symptoms: [],
            suggestedUrgency: 1,
            summary: "Error processing with AI",
            specialist: "General Practice"
        };
    }
};

module.exports = { extractSymptoms };
