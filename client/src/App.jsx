import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import Navbar from './components/Navbar.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FreelancerDashboard from './pages/FreelancerDashboard.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import CreateProject from './pages/CreateProject.jsx';
import AIGenerator from './pages/AIGenerator.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import Payments from './pages/Payments.jsx';
import Profile from './pages/Profile.jsx';

// Protected Route Guard
function ProtectedRoute({ children, allowedRole = null }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'} replace />;
  }

  return children;
}

// Smart Dashboard Redirection based on Role
function DashboardRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard Smart Redirection */}
                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Freelancer Protected Routes */}
                <Route
                  path="/dashboard/freelancer"
                  element={
                    <ProtectedRoute allowedRole="freelancer">
                      <FreelancerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/new"
                  element={
                    <ProtectedRoute allowedRole="freelancer">
                      <CreateProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-generator"
                  element={
                    <ProtectedRoute allowedRole="freelancer">
                      <AIGenerator />
                    </ProtectedRoute>
                  }
                />

                {/* Client Protected Routes */}
                <Route
                  path="/dashboard/client"
                  element={
                    <ProtectedRoute allowedRole="client">
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Protected Routes */}
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payments"
                  element={
                    <ProtectedRoute>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
