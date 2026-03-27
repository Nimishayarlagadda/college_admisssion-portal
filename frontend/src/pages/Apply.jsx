import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const Apply = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    high_school: '',
    gpa: '',
    graduation_year: '',
    intended_major: '',
    essay: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/applications`,
        { ...formData, gpa: parseFloat(formData.gpa), graduation_year: parseInt(formData.graduation_year) },
        { withCredentials: true }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="apply-page">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">Application Form</h1>
          <p className="font-sans text-base text-slate-600">Complete all fields to submit your application</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm" data-testid="application-error">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="application-form">
              {/* Personal Information */}
              <div>
                <h2 className="font-sans text-xl font-medium text-slate-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required data-testid="first-name-input" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required data-testid="last-name-input" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required data-testid="email-input" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required data-testid="phone-input" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required data-testid="dob-input" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="font-sans text-xl font-medium text-slate-900 mb-4">Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required data-testid="address-input" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required data-testid="city-input" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} required data-testid="state-input" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">Zip Code</Label>
                      <Input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} required data-testid="zip-input" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} required data-testid="country-input" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h2 className="font-sans text-xl font-medium text-slate-900 mb-4">Academic Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="high_school">High School</Label>
                    <Input id="high_school" name="high_school" value={formData.high_school} onChange={handleChange} required data-testid="high-school-input" className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gpa">GPA (0.0 - 4.0)</Label>
                      <Input id="gpa" name="gpa" type="number" step="0.01" min="0" max="4" value={formData.gpa} onChange={handleChange} required data-testid="gpa-input" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="graduation_year">Graduation Year</Label>
                      <Input id="graduation_year" name="graduation_year" type="number" value={formData.graduation_year} onChange={handleChange} required data-testid="graduation-year-input" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="intended_major">Intended Major</Label>
                    <Input id="intended_major" name="intended_major" value={formData.intended_major} onChange={handleChange} required data-testid="intended-major-input" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Essay */}
              <div>
                <h2 className="font-sans text-xl font-medium text-slate-900 mb-4">Personal Statement</h2>
                <div>
                  <Label htmlFor="essay">Why do you want to attend our college? (250-500 words)</Label>
                  <Textarea
                    id="essay"
                    name="essay"
                    value={formData.essay}
                    onChange={handleChange}
                    required
                    rows={8}
                    data-testid="essay-input"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} data-testid="cancel-button">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading} data-testid="submit-application-button">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
