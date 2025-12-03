import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LiveMonitor from './components/LiveMonitor';
import Forensics from './components/Forensics';
import { TrafficProvider } from './contexts/TrafficContext';

const App: React.FC = () => {
  return (
    <TrafficProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/monitor" element={<LiveMonitor />} />
            <Route path="/forensics" element={<Forensics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </TrafficProvider>
  );
};

export default App;