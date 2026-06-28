import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StaffDashboard from './StaffDashboard';
import CeoDashboard from './CeoDashboard';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Signup from './Signup';
import DashboardLayout from './DashboardLayout';

const LandingPage = () => (
  <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-sans">
    <div className="text-center space-y-8">
      <h1 className="text-4xl font-bold tracking-widest uppercase text-white">
        Randaframes <span className="text-zinc-600">Core</span>
      </h1>
      <div className="flex space-x-6 justify-center">
        <Link 
          to="/login" 
          className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300"
        >
          System Login
        </Link>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route 
  path="/staff" 
  element={
    <ProtectedRoute allowedRole="STAFF">
      <DashboardLayout>
        <StaffDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ceo" 
  element={
    <ProtectedRoute allowedRole="CEO">
      <DashboardLayout>
        <CeoDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  } 
/>
      </Routes>
    </Router>
  );
};

export default App;