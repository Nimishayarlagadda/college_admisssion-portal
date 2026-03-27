import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData.email, formData.password, formData.name, formData.phone);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="register-page">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">Create Account</h1>
            <p className="font-sans text-base text-slate-600">Start your admission journey today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm" data-testid="register-error">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                data-testid="name-input"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                data-testid="email-input"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                data-testid="phone-input"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                data-testid="password-input"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                data-testid="confirm-password-input"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={loading}
              data-testid="register-submit-button"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#002FA7] hover:underline font-medium" data-testid="login-link">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/34148af1-0cf9-44be-92b6-9e1854c7a26c/images/f2a9f5486f55472372e1ca3daf5eedaf36f49f748ed1b2d4ff072526abc543f5.png)'
          }}
        >
          <div className="absolute inset-0 bg-[#002FA7]/10"></div>
        </div>
      </div>
    </div>
  );
};
