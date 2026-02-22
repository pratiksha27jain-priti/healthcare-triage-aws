const { z } = require('zod');

const intakeSchema = z.object({
    patientName: z.string().min(1, "Name is required"),
    symptoms: z.string().min(10, "Please describe symptoms in more detail (at least 10 chars)")
});

const validateIntake = (req, res, next) => {
    try {
        intakeSchema.parse(req.body);
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors });
    }
};

module.exports = { validateIntake };
