import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import PatientIntake from './components/PatientIntake';
import ClinicianDashboard from './components/ClinicianDashboard';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrapper to handle conditional rendering based on auth
const MainContent = () => {
  const [view, setView] = useState('intake'); // 'intake', 'dashboard', 'login'
  const { user, logout } = useAuth();

  const handleDashboardClick = () => {
    if (user) {
      setView('dashboard');
    } else {
      setView('login');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Healthcare Triage App
          </Typography>
          <Button color="inherit" onClick={() => setView('intake')}>
            Patient View
          </Button>
          <Button color="inherit" onClick={handleDashboardClick}>
            Clinician View
          </Button>
          {user && (
            <Button color="inherit" onClick={() => { logout(); setView('intake'); }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ py: 2 }}>
        {view === 'intake' && <PatientIntake />}
        {view === 'dashboard' && user && <ClinicianDashboard />}
        {view === 'login' && <Login onLoginSuccess={() => setView('dashboard')} />}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;

