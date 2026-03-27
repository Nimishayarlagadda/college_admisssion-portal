import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">Welcome Back</h1>
            <p className="font-sans text-base text-slate-600">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm" data-testid="login-error">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                data-testid="email-input"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                data-testid="password-input"
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-sans text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#002FA7] hover:underline font-medium" data-testid="register-link">
                Create Account
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
