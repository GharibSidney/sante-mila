import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function VoiceRecorder({ onRecordingComplete, isProcessing }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordingComplete(file);
        
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start audio level monitoring
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      };
      updateAudioLevel();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="material-card material-elevation-4 p-8 text-center">
      <div className="max-w-md mx-auto">
        {/* Audio Visualization */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          {/* Outer ripple rings */}
          {isRecording && (
            <>
              <div 
                className="absolute inset-0 rounded-full smooth-transition"
                style={{
                  backgroundColor: 'var(--md-primary)',
                  opacity: 0.1,
                  transform: `scale(${1 + audioLevel * 0.5})`,
                }}
              />
              <div 
                className="absolute inset-4 rounded-full smooth-transition"
                style={{
                  backgroundColor: 'var(--md-primary)',
                  opacity: 0.15,
                  transform: `scale(${1 + audioLevel * 0.3})`,
                }}
              />
            </>
          )}
          
          {/* Center button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={cn(
              "absolute inset-8 rounded-full material-button flex items-center justify-center smooth-transition",
              isRecording ? "material-elevation-8" : "material-elevation-4"
            )}
            style={{
              backgroundColor: isRecording ? 'var(--md-error)' : 'var(--md-primary)',
              transform: isRecording ? `scale(${1 + audioLevel * 0.1})` : 'scale(1)',
            }}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            ) : isRecording ? (
              <Square className="w-12 h-12 text-white" fill="white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          {isProcessing ? (
            <>
              <h3 className="text-xl font-medium" style={{ color: 'var(--md-text-primary)' }}>
                Processing...
              </h3>
              <p className="text-sm" style={{ color: 'var(--md-text-secondary)' }}>
                AI is analyzing your voice message
              </p>
            </>
          ) : isRecording ? (
            <>
              <h3 className="text-xl font-medium" style={{ color: 'var(--md-error)' }}>
                Recording... {formatTime(recordingTime)}
              </h3>
              <p className="text-sm" style={{ color: 'var(--md-text-secondary)' }}>
                Tap to stop recording
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium" style={{ color: 'var(--md-text-primary)' }}>
                Ready to Record
              </h3>
              <p className="text-sm" style={{ color: 'var(--md-text-secondary)' }}>
                Tap the microphone to describe your needs
              </p>
            </>
          )}
        </div>

        {/* Visual Bars */}
        {isRecording && (
          <div className="flex justify-center gap-1 mt-6">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full smooth-transition"
                style={{
                  height: `${Math.random() * audioLevel * 40 + 10}px`,
                  backgroundColor: 'var(--md-primary)',
                  opacity: 0.6 + audioLevel * 0.4,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
