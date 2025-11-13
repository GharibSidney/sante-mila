import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

import LiveDispatchButton from '../components/dispatch/LiveDispatchButton';
import VoiceRecorder from '../components/dispatch/VoiceRecorder';
import RequestCard from '../components/dispatch/RequestCard';
import StatusTimeline from '../components/dispatch/StatusTimeline';

export default function Dashboard() {
  const [showRecorder, setShowRecorder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['dispatchRequests'],
    queryFn: () => base44.entities.DispatchRequest.list('-created_date', 50),
    initialData: [],
  });

  const activeRequests = requests.filter(
    req => !['completed', 'cancelled'].includes(req.status)
  );

  const handleRecordingComplete = async (audioFile) => {
    setIsProcessing(true);
    setError(null);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: audioFile });

      const newRequest = await base44.entities.DispatchRequest.create({
        voice_url: file_url,
        status: 'processing',
      });

      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI medical dispatcher. Analyze this voice recording and extract:
1. A transcript of what the person said
2. Urgency level (low, medium, high, or critical)
3. Category of professional needed (doctor, nurse, social_worker, psychiatrist, physical_therapist, emergency, or general)
4. Brief notes about the request

Be empathetic and thorough in your analysis.`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            transcript: { type: 'string' },
            urgency: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            category: { type: 'string', enum: ['doctor', 'nurse', 'social_worker', 'psychiatrist', 'physical_therapist', 'emergency', 'general'] },
            notes: { type: 'string' },
          },
        },
      });

      const professionals = await base44.entities.Professional.filter({ available: true });
      const matchingPro = professionals.find(p => p.role === aiResult.category) || professionals[0];

      await base44.entities.DispatchRequest.update(newRequest.id, {
        transcript: aiResult.transcript,
        urgency: aiResult.urgency,
        category: aiResult.category,
        notes: aiResult.notes,
        status: matchingPro ? 'assigned' : 'dispatching',
        assigned_professional_name: matchingPro?.full_name,
        assigned_professional_role: matchingPro?.role,
        estimated_response_time: matchingPro?.average_response_time || '15-30 mins',
      });

      queryClient.invalidateQueries({ queryKey: ['dispatchRequests'] });
      setShowRecorder(false);
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      console.error('Error processing recording:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--md-background)' }}>
      <div className="max-w-7xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6 material-elevation-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Live Dispatch Section */}
        {!showRecorder && (
          <div className="mb-8">
            <LiveDispatchButton onClick={() => setShowRecorder(true)} />
          </div>
        )}

        {/* Voice Recorder */}
        {showRecorder && (
          <div className="mb-8">
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              isProcessing={isProcessing}
            />
            {!isProcessing && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRecorder(false)}
                  className="material-button"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--md-text-primary)' }}>
                  Active Requests
                </h2>
                {isLoading ? (
                  <div className="material-card material-elevation-2 p-12 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--md-primary)' }} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeRequests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onClick={() => setSelectedRequest(request)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              {selectedRequest ? (
                <StatusTimeline currentStatus={selectedRequest.status} />
              ) : activeRequests.length > 0 ? (
                <StatusTimeline currentStatus={activeRequests[0].status} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
