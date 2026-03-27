import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/Button';

export const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/applications`,
        { withCredentials: true }
      );
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/applications/${appId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      await fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002FA7] mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="font-sans text-base text-slate-600">Manage all applications</p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="applications-table">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">Name</th>
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">Email</th>
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">Major</th>
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">GPA</th>
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">Status</th>
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">Submitted</th>
                  <th className="text-left py-3 px-4 font-sans text-xs uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8" data-testid="no-applications">
                      <p className="font-sans text-base text-slate-500">No applications found</p>
                    </td>
                  </tr>
                ) : (
                  applications.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                      data-testid={`application-row-${app.id}`}
                    >
                      <td className="py-4 px-4 font-sans text-sm text-slate-900">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="py-4 px-4 font-sans text-sm text-slate-600">{app.email}</td>
                      <td className="py-4 px-4 font-sans text-sm text-slate-600">{app.intended_major}</td>
                      <td className="py-4 px-4 font-sans text-sm text-slate-600">{app.gpa}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-4 px-4 font-sans text-sm text-slate-600">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <Select
                          value={app.status}
                          onValueChange={(value) => handleStatusUpdate(app.id, value)}
                          disabled={updating === app.id}
                        >
                          <SelectTrigger className="w-[180px]" data-testid={`status-select-${app.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="document_verification">Document Verification</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
