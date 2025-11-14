import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TimelineStep {
  key: string;
  label: string;
}

const timelineSteps: TimelineStep[] = [
  { key: 'recording', label: 'Voice Recorded' },
  { key: 'processing', label: 'Processing Audio' },
  { key: 'analyzing', label: 'AI Analysis' },
  { key: 'dispatching', label: 'Finding Professional' },
  { key: 'assigned', label: 'Professional Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

interface StatusTimelineProps {
  currentStatus: string; 
}

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentIndex = timelineSteps.findIndex(step => step.key === currentStatus);

  return (
    <div className="material-card material-elevation-2 p-6">
      <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--md-text-primary)' }}>
        Request Progress
      </h3>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center smooth-transition ${
                    isCurrent ? 'material-elevation-2' : ''
                  }`}
                  style={{
                    backgroundColor: isCompleted
                      ? 'var(--md-success)'
                      : isCurrent
                      ? 'var(--md-primary)'
                      : 'var(--md-divider)',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 text-white animate-pulse" />
                  ) : (
                    <Circle className="w-5 h-5" style={{ color: 'var(--md-text-secondary)' }} />
                  )}
                </div>

                {index < timelineSteps.length - 1 && (
                  <div
                    className="absolute left-1/2 top-8 w-0.5 h-8 -translate-x-1/2 smooth-transition"
                    style={{
                      backgroundColor: isCompleted ? 'var(--md-success)' : 'var(--md-divider)',
                    }}
                  />
                )}
              </div>

              <div className="flex-1 pt-1">
                <p
                  className={`font-medium smooth-transition ${isCurrent ? 'text-base' : 'text-sm'}`}
                  style={{
                    color: isCompleted || isCurrent
                      ? 'var(--md-text-primary)'
                      : 'var(--md-text-secondary)',
                  }}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs mt-1" style={{ color: 'var(--md-text-secondary)' }}>
                    In progress...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
