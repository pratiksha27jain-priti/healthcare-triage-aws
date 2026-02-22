import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    CircularProgress
} from '@mui/material';
import { getCases } from '../api/client';

import { useAuth } from '../context/AuthContext';

const ClinicianDashboard = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCases = async () => {
            if (!user || !user.token) return;
            try {
                const data = await getCases(user.token);
                setCases(data);
            } catch (error) {
                console.error("Failed to load cases");
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
        const interval = setInterval(fetchCases, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user]);

    const getUrgencyColor = (score) => {
        if (score >= 4) return 'error';     // Red for 4-5
        if (score === 3) return 'warning';  // Orange for 3
        return 'success';                   // Green for 1-2
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Clinician Triage Dashboard
            </Typography>

            {loading && cases.length === 0 ? (
                <Box display="flex" justifyItems="center">
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Urgency</strong></TableCell>
                                <TableCell><strong>Patient</strong></TableCell>
                                <TableCell><strong>Symptoms</strong></TableCell>
                                <TableCell><strong>AI Summary</strong></TableCell>
                                <TableCell><strong>Specialist</strong></TableCell>
                                <TableCell><strong>Time</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cases.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <Chip
                                            label={`Score: ${row.suggestedUrgency}`}
                                            color={getUrgencyColor(row.suggestedUrgency)}
                                            variant={row.suggestedUrgency >= 4 ? "filled" : "outlined"}
                                        />
                                    </TableCell>
                                    <TableCell>{row.patientName}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {row.symptomsRaw}
                                    </TableCell>
                                    <TableCell>{row.aiSummary}</TableCell>
                                    <TableCell>{row.suggestedSpecialist}</TableCell>
                                    <TableCell>{new Date(row.timestamp).toLocaleTimeString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ClinicianDashboard;
