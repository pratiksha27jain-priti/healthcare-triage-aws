import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const submitIntake = async (patientName, symptoms) => {
    try {
        const response = await axios.post(`${API_URL}/intake`, {
            patientName,
            symptoms
        });
        return response.data;
    } catch (error) {
        console.error("API Error Intake:", error);
        throw error;
    }
};

export const getCases = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/cases`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("API Error Cases:", error);
        throw error;
    }
};
