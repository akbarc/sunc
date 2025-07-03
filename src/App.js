import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled, { createGlobalStyle } from 'styled-components';

// Components
import LandingPage from './components/LandingPage';
import ApplicationPage from './components/ApplicationPage';
import ApplicationSuccess from './components/ApplicationSuccess';
import CreatorDashboard from './components/CreatorDashboard';
import AdminConsole from './components/AdminConsole';
import AuthModal from './components/AuthModal';

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #000000;
    color: #ffffff;
    line-height: 1.6;
  }

  button {
    font-family: inherit;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/apply/success" element={<ApplicationSuccess />} />
          <Route path="/dashboard" element={<CreatorDashboard />} />
          <Route path="/admin" element={<AdminConsole />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid #333333',
            },
          }}
        />
      </AppContainer>
    </Router>
  );
}

export default App; 