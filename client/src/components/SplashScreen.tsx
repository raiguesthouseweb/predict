import { useState, useEffect } from 'react';
import { Logo } from '../logo';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Predictive AI Engine...");
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [showStartButton, setShowStartButton] = useState(false);
  const [, setLocation] = useLocation();
  
  const loadingMessages = [
    "Initializing Predictive AI Engine...",
    "Loading historical match data...",
    "Calibrating neural networks...",
    "Analyzing team color patterns...",
    "Establishing pitch parameters...",
    "Building prediction modules..."
  ];

  // Matrix-inspired code animation
  useEffect(() => {
    const codeSymbols = 'ಠೱಹಬಜಝಞಟಠಡಢಣಥಧನಪಫಬಭಮಯರಲವಶಸಹ0123456789छजझञटठडढणतथदधपफबभय٠١٢٣٤٥٦٧٨٩';
    const maxLines = 15;
    let count = 0;
    
    const interval = setInterval(() => {
      if (count < 100) {
        const line = Array(Math.floor(Math.random() * 30) + 5)
          .fill(0)
          .map(() => codeSymbols[Math.floor(Math.random() * codeSymbols.length)])
          .join('');
        
        setCodeLines(prev => {
          const newLines = [...prev, line];
          return newLines.length > maxLines ? newLines.slice(newLines.length - maxLines) : newLines;
        });
        
        count++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    
    // Update progress bar
    interval = setInterval(() => {
      setProgress(prev => {
        // Change message at certain progress points
        if (prev === 15) {
          setLoadingText(loadingMessages[1]);
        } else if (prev === 30) {
          setLoadingText(loadingMessages[2]);
        } else if (prev === 50) {
          setLoadingText(loadingMessages[3]);
        } else if (prev === 70) {
          setLoadingText(loadingMessages[4]);
        } else if (prev === 85) {
          setLoadingText(loadingMessages[5]);
        }
        
        const newProgress = prev + 1;
        
        // When we reach 100%, clear intervals and finish
        if (newProgress >= 100) {
          clearInterval(interval);
          timer = setTimeout(() => {
            setShowStartButton(true);
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
  }, [loadingMessages]);

  const handleStart = () => {
    onFinish();
    setLocation('/prediction');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Matrix-style code background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="flex flex-wrap gap-4 p-4 text-green-500 font-mono text-xs">
          {codeLines.map((line, i) => (
            <div key={i} className="whitespace-nowrap animate-typing overflow-hidden">
              {line}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-xl px-4">
        <div className="w-32 h-32 mb-8">
          <Logo />
        </div>
        <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Guru Gyan
        </h1>
        <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          rAi
        </h2>
        
        <div className="w-full max-w-md mb-4 relative">
          <Progress value={progress} className="h-3 bg-gray-800 rounded-md" />
          <div 
            className="absolute h-3 top-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-md"
            style={{ width: `${progress}%`, opacity: 0.8 }}
          />
        </div>
        
        <p className="text-lg text-emerald-400 font-mono font-semibold mb-6 min-h-[28px]">
          {loadingText}
        </p>
        
        {showStartButton ? (
          <Button 
            onClick={handleStart}
            className="mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg shadow-emerald-900/20 transition-all hover:shadow-emerald-900/30"
          >
            Start Prediction
          </Button>
        ) : (
          <div className="h-[52px]"></div>
        )}
        
        <p className="text-xs text-gray-500 mt-8">Version 1.0.0 | © 2025 Guru Gyan rAi</p>
      </div>
    </div>
  );
}
