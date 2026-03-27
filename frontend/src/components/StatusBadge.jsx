import React from 'react';
import { cn } from '../lib/utils';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    submitted: {
      label: 'Submitted',
      className: 'text-blue-800 bg-blue-100'
    },
    under_review: {
      label: 'Under Review',
      className: 'text-amber-800 bg-amber-100'
    },
    document_verification: {
      label: 'Document Verification',
      className: 'text-purple-800 bg-purple-100'
    },
    approved: {
      label: 'Approved',
      className: 'text-green-800 bg-green-100'
    },
    rejected: {
      label: 'Rejected',
      className: 'text-red-800 bg-red-100'
    }
  };

  const config = statusConfig[status] || statusConfig.submitted;

  return (
    <span
      className={cn(
        'rounded-full text-xs uppercase tracking-wider font-semibold px-2.5 py-1 inline-block',
        config.className
      )}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </span>
  );
};
