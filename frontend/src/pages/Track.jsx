import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, FileCheck, Award } from 'lucide-react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';

export const Track = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/applications/me`,
        { withCredentials: true }
      );
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { id: 'submitted', label: 'Application Submitted', icon: CheckCircle2, description: 'Your application has been received' },
    { id: 'under_review', label: 'Under Review', icon: Clock, description: 'Our team is reviewing your application' },
    { id: 'document_verification', label: 'Document Verification', icon: FileCheck, description: 'Verifying submitted documents' },
    { id: 'approved', label: 'Final Decision', icon: Award, description: 'Admission decision has been made' }
  ];

  const getStageIndex = (status) => {
    const index = stages.findIndex(s => s.id === status);
    return index >= 0 ? index : 0;
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

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="track-page-no-application">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
            <h2 className="font-serif text-2xl text-slate-900 mb-2">No Application Found</h2>
            <p className="font-sans text-base text-slate-600">You haven't submitted an application yet.</p>
          </Card>
        </div>
      </div>
    );
  }

  const currentStageIndex = getStageIndex(application.status);

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8" data-testid="track-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-slate-900 mb-2">Track Application</h1>
          <p className="font-sans text-base text-slate-600">Monitor your application progress</p>
        </div>

        <Card className="mb-6" data-testid="application-info-card">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-sans text-sm text-slate-500 mb-1">Application ID</p>
              <p className="font-sans text-lg font-medium text-slate-900">{application.id}</p>
            </div>
            <StatusBadge status={application.status} />
          </div>
        </Card>

        <Card className="p-8" data-testid="timeline-card">
          <div className="space-y-8">
            {stages.map((stage, index) => {
              const isCompleted = index < currentStageIndex || (index === currentStageIndex && application.status !== 'rejected');
              const isCurrent = index === currentStageIndex;
              const Icon = stage.icon;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                  data-testid={`timeline-stage-${stage.id}`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted || isCurrent ? (
                      <div className="w-12 h-12 bg-[#002FA7] rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Circle className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 pb-8 border-l-2 border-gray-200 pl-6 ml-6 -mt-1">
                    <h3 className={`font-sans text-lg font-medium mb-1 ${
                      isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {stage.label}
                    </h3>
                    <p className={`font-sans text-sm ${
                      isCompleted || isCurrent ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {stage.description}
                    </p>
                    {isCurrent && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-[#002FA7] text-xs font-semibold rounded-full">
                          Current Stage
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {application.status === 'rejected' && (
          <Card className="mt-6 bg-red-50 border-red-200" data-testid="rejection-notice">
            <h3 className="font-sans text-lg font-medium text-red-900 mb-2">Application Status Update</h3>
            <p className="font-sans text-sm text-red-700">
              We regret to inform you that your application was not successful at this time. We encourage you to reapply in the future.
            </p>
          </Card>
        )}

        {application.status === 'approved' && (
          <Card className="mt-6 bg-green-50 border-green-200" data-testid="approval-notice">
            <h3 className="font-sans text-lg font-medium text-green-900 mb-2">✓ Congratulations!</h3>
            <p className="font-sans text-sm text-green-700">
              Your application has been approved! You will receive further instructions via email.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
