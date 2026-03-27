import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, Upload } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';

export const Dashboard = () => {
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, docsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/applications/me`, { withCredentials: true }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/documents/me`, { withCredentials: true })
      ]);
      setApplication(appRes.data);
      setDocuments(docsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="student-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">My Dashboard</h1>
          <p className="font-sans text-base text-slate-600">Track your application and manage documents</p>
        </div>

        {!application ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center py-12" data-testid="no-application-card">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-slate-900 mb-2">No Application Yet</h2>
              <p className="font-sans text-base text-slate-600 mb-6">
                You haven't submitted an application. Start your journey today!
              </p>
              <Link to="/apply" data-testid="start-application-button">
                <Button variant="primary" className="px-8 py-3">Start Application</Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Application Status */}
            <div className="lg:col-span-2 space-y-6">
              <Card data-testid="application-status-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-sans text-xl font-medium text-slate-900 mb-1">Application Status</h2>
                    <p className="font-sans text-sm text-slate-500">Application ID: {application.id}</p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-slate-500 mb-1">Name</p>
                      <p className="font-sans text-base text-slate-900">{application.first_name} {application.last_name}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-slate-500 mb-1">Intended Major</p>
                      <p className="font-sans text-base text-slate-900">{application.intended_major}</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-slate-500 mb-1">Submitted</p>
                      <p className="font-sans text-base text-slate-900">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-wider text-slate-500 mb-1">Last Updated</p>
                      <p className="font-sans text-base text-slate-900">
                        {new Date(application.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card data-testid="quick-actions-card">
                <h2 className="font-sans text-xl font-medium text-slate-900 mb-4">Next Steps</h2>
                <div className="space-y-3">
                  <Link to="/track" className="block" data-testid="view-timeline-link">
                    <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-sm hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-[#002FA7]" />
                        <span className="font-sans text-base text-slate-900">View Application Timeline</span>
                      </div>
                      <span className="text-slate-400">→</span>
                    </div>
                  </Link>
                  <Link to="/documents" className="block" data-testid="manage-documents-link">
                    <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-sm hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-5 w-5 text-[#002FA7]" />
                        <span className="font-sans text-base text-slate-900">Manage Documents</span>
                      </div>
                      <span className="text-slate-400">→</span>
                    </div>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card data-testid="documents-count-card">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#002FA7]" />
                  </div>
                  <div>
                    <p className="font-sans text-2xl font-bold text-slate-900">{documents.length}</p>
                    <p className="font-sans text-sm text-slate-500">Documents Uploaded</p>
                  </div>
                </div>
              </Card>

              <Card data-testid="status-info-card">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-sans text-lg font-semibold text-slate-900">Application Received</p>
                    <p className="font-sans text-sm text-slate-500">We're reviewing your application</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
