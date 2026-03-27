import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Apply } from './pages/Apply';
import { Track } from './pages/Track';
import { Documents } from './pages/Documents';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/apply" 
              element={
                <ProtectedRoute>
                  <Apply />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/track" 
              element={
                <ProtectedRoute>
                  <Track />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/documents" 
              element={
                <ProtectedRoute>
                  <Documents />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
