import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Zap, Radio } from 'lucide-react';

export default function LiveDispatchButton({ onClick }) {
  return (
    <div className="material-card material-elevation-8 p-8 md:p-12 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full animate-pulse"
          style={{ 
            backgroundColor: 'var(--md-accent)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full animate-pulse"
          style={{ 
            backgroundColor: 'var(--md-primary)',
            animationDelay: '1s',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          {/* Live Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="relative flex items-center">
              <Radio 
                className="w-5 h-5 animate-pulse" 
                style={{ color: 'var(--md-accent)' }}
              />
              <span 
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: 'var(--md-accent)' }}
              />
            </div>
            <span 
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: 'var(--md-accent)' }}
            >
              Live Dispatch System Active
            </span>
          </div>

          {/* Main Heading */}
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--md-text-primary)' }}
          >
            Real-Time Medical Assistance
          </h2>
          
          <p 
            className="text-lg md:text-xl mb-8"
            style={{ color: 'var(--md-text-secondary)' }}
          >
            Connect with healthcare professionals instantly. Your voice message is processed and dispatched in <span className="font-bold" style={{ color: 'var(--md-accent)' }}>real time</span>.
          </p>
        </div>

        {/* Main CTA Button */}
        <div className="flex justify-center">
          <Button
            onClick={onClick}
            className="material-button material-elevation-4 hover:material-elevation-8 px-12 py-8 text-xl md:text-2xl font-bold rounded-2xl smooth-transition group"
            style={{ 
              backgroundColor: 'var(--md-accent)',
              color: 'var(--md-text-primary)'
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center group-hover:scale-110 smooth-transition"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
              >
                <Mic className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span>Start Voice Request</span>
              <Zap className="w-6 h-6 md:w-7 md:h-7 animate-pulse" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}