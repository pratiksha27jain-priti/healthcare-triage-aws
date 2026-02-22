import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Alert,
    CircularProgress
} from '@mui/material';
import { submitIntake } from '../api/client';

const PatientIntake = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        symptoms: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await submitIntake(formData.patientName, formData.symptoms);
            setResult(response);
            setStatus('success');
            setFormData({ patientName: '', symptoms: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    Patient Intake
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please describe your symptoms in detail.
                </Typography>

                {status === 'success' && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Intake submitted! Your case ID: {result?.data?.id}
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Failed to submit intake. Please try again.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Full Name"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Describe your symptoms"
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        fullWidth
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <CircularProgress size={24} /> : 'Submit Symptoms'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default PatientIntake;
