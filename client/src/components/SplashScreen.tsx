import { useState, useEffect } from 'react';
import { Logo } from '../logo';
import { Progress } from '@/components/ui/progress';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Predictive AI Engine...");
  
  const loadingMessages = [
    "Initializing Predictive AI Engine...",
    "Loading historical match data...",
    "Calibrating neural networks...",
    "Establishing pitch parameters...",
    "Starting prediction modules..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    
    // Update progress bar
    interval = setInterval(() => {
      setProgress(prev => {
        // Change message at certain progress points
        if (prev === 20) {
          setLoadingText(loadingMessages[1]);
        } else if (prev === 40) {
          setLoadingText(loadingMessages[2]);
        } else if (prev === 60) {
          setLoadingText(loadingMessages[3]);
        } else if (prev === 80) {
          setLoadingText(loadingMessages[4]);
        }
        
        const newProgress = prev + 1;
        
        // When we reach 100%, clear intervals and finish
        if (newProgress >= 100) {
          clearInterval(interval);
          timer = setTimeout(() => {
            onFinish();
          }, 500);
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 50);

    // Cleanup
    return () => {
      clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="w-32 h-32 mb-8">
        <Logo />
      </div>
      <h1 className="text-3xl font-orbitron font-bold text-primary mb-8 neon-glow">Guru Gyan rAi</h1>
      <div className="w-64 mb-4">
        <Progress value={progress} className="h-2 animated-progress-bar" />
      </div>
      <p className="text-lg typing-animation">{loadingText}</p>
    </div>
  );
}
