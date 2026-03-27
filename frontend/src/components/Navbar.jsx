import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <GraduationCap className="h-8 w-8 text-[#002FA7]" />
            <span className="font-serif text-2xl font-bold text-slate-900">Admissions Portal</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!user || user === false ? (
              <>
                <Link to="/" className="text-slate-600 hover:text-slate-900 font-sans text-base transition-colors" data-testid="nav-home">Home</Link>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-sans text-base transition-colors" data-testid="nav-login">Login</Link>
                <Link to="/register" data-testid="nav-register">
                  <Button variant="primary">Apply Now</Button>
                </Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-slate-600 hover:text-slate-900 font-sans text-base transition-colors" data-testid="nav-admin">Admin Dashboard</Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 font-sans text-base transition-colors" data-testid="nav-dashboard">Dashboard</Link>
                    <Link to="/track" className="text-slate-600 hover:text-slate-900 font-sans text-base transition-colors" data-testid="nav-track">Track</Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-sans text-base transition-colors"
                  data-testid="logout-button"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
