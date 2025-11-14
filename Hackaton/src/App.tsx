import { useState } from "react";
import StatusTimeline from '../components/dispatch/StatusTimeline';
import VoiceRecorder from '../components/dispatch/VoiceRecorder';

import "./App.css";

export default function App() {
  const [currentStatus, setCurrentStatus] = useState("recording");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingComplete = async (file: File) => {
    console.log("Recording complete:", file);

    // Simulate processing
    setIsProcessing(true);

    // Fake async processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);

    // Move to next status for demo purposes
    if (currentStatus === "recording") setCurrentStatus("processing");
    else if (currentStatus === "processing") setCurrentStatus("analyzing");
    else if (currentStatus === "analyzing") setCurrentStatus("dispatching");
    else if (currentStatus === "dispatching") setCurrentStatus("assigned");
    else if (currentStatus === "assigned") setCurrentStatus("in_progress");
    else if (currentStatus === "in_progress") setCurrentStatus("completed");
  };

  return (
    <div className="App p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dispatch Dashboard</h1>

      {/* Status Timeline */}
      <StatusTimeline currentStatus={currentStatus} />

      {/* Voice Recorder */}
      <VoiceRecorder
        onRecordingComplete={handleRecordingComplete}
        isProcessing={isProcessing}
      />
    </div>
  );
}
