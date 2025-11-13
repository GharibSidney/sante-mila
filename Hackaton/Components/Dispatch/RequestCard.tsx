import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  recording: { color: 'var(--md-text-secondary)', icon: Clock, label: 'Recording' },
  processing: { color: 'var(--md-accent)', icon: Clock, label: 'Processing' },
  analyzing: { color: 'var(--md-accent)', icon: Clock, label: 'Analyzing' },
  dispatching: { color: 'var(--md-primary)', icon: Clock, label: 'Dispatching' },
  assigned: { color: 'var(--md-primary)', icon: User, label: 'Assigned' },
  in_progress: { color: 'var(--md-primary)', icon: Clock, label: 'In Progress' },
  completed: { color: 'var(--md-success)', icon: CheckCircle2, label: 'Completed' },
  cancelled: { color: 'var(--md-error)', icon: AlertCircle, label: 'Cancelled' },
};

const urgencyConfig = {
  low: { color: 'var(--md-success)', label: 'Low Priority' },
  medium: { color: 'var(--md-accent)', label: 'Medium Priority' },
  high: { color: '#FF6F00', label: 'High Priority' },
  critical: { color: 'var(--md-error)', label: 'Critical' },
};

export default function RequestCard({ request, onClick }) {
  const status = statusConfig[request.status] || statusConfig.processing;
  const urgency = urgencyConfig[request.urgency] || urgencyConfig.medium;
  const StatusIcon = status.icon;

  return (
    <div
      onClick={onClick}
      className="material-card material-elevation-2 hover:material-elevation-4 p-5 cursor-pointer smooth-transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center material-elevation-1"
            style={{ backgroundColor: status.color + '20' }}
          >
            <StatusIcon className="w-5 h-5" style={{ color: status.color }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--md-text-primary)' }}>
              {status.label}
            </h3>
            <p className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>
              {format(new Date(request.created_date), 'MMM d, yyyy • h:mm a')}
            </p>
          </div>
        </div>
        
        {request.urgency && (
          <Badge
            variant="secondary"
            className="material-elevation-1"
            style={{
              backgroundColor: urgency.color + '20',
              color: urgency.color,
              border: 'none'
            }}
          >
            {urgency.label}
          </Badge>
        )}
      </div>

      {request.transcript && (
        <div className="mb-3 p-3 rounded" style={{ backgroundColor: 'var(--md-background)' }}>
          <div className="flex items-start gap-2 mb-1">
            <FileText className="w-4 h-4 mt-0.5" style={{ color: 'var(--md-text-secondary)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--md-text-secondary)' }}>
              Transcript
            </p>
          </div>
          <p className="text-sm line-clamp-2" style={{ color: 'var(--md-text-primary)' }}>
            {request.transcript}
          </p>
        </div>
      )}

      {request.category && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium" style={{ color: 'var(--md-text-secondary)' }}>
            Category:
          </span>
          <span className="text-xs font-semibold px-2 py-1 rounded" style={{ 
            backgroundColor: 'var(--md-primary)',
            color: 'white'
          }}>
            {request.category.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      )}

      {request.assigned_professional_name && (
        <div className="flex items-center gap-2 p-3 rounded material-elevation-1" style={{ backgroundColor: 'var(--md-surface)' }}>
          <User className="w-4 h-4" style={{ color: 'var(--md-primary)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--md-text-primary)' }}>
              {request.assigned_professional_name}
            </p>
            <p className="text-xs" style={{ color: 'var(--md-text-secondary)' }}>
              {request.assigned_professional_role}
            </p>
          </div>
          {request.estimated_response_time && (
            <span className="ml-auto text-xs" style={{ color: 'var(--md-text-secondary)' }}>
              ETA: {request.estimated_response_time}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
