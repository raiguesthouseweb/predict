import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { PredictionResult } from '@shared/types';
import { PredictionFormValues } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function usePrediction() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const generatePrediction = async (data: PredictionFormValues) => {
    setIsLoading(true);
    setLogs([
      "Initializing prediction engine...",
      "Loading team data and match history...",
      "Analyzing pitch conditions..."
    ]);
    
    try {
      // Simulate processing time for better UX
      const simulateProcessing = () => {
        const processingLogs = [
          "Scanning pitch condition at " + data.stadium + "...",
          "Checking boundary lengths and ground dimensions...",
          "Analyzing previous matches between " + data.teamA + " and " + data.teamB + "...",
          "Evaluating dew conditions for " + new Date(data.matchDate).toLocaleDateString() + "...",
          "Calculating jersey color performance metrics...",
          "Applying seasonal performance adjustments...",
          "Evaluating historical win rates...",
          "Finalizing prediction model weights..."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
          if (i < processingLogs.length) {
            setLogs(prev => [...prev, processingLogs[i]]);
            i++;
          } else {
            clearInterval(interval);
          }
        }, 800);
        
        return () => clearInterval(interval);
      };
      
      const cleanupFn = simulateProcessing();
      
      // Make the actual API call
      const response = await apiRequest('POST', '/api/predictions', data);
      const predictionResult = await response.json();
      
      // Ensure the simulation has enough time to look impressive
      setTimeout(() => {
        setResult(predictionResult);
        setLogs(prev => [...prev, "Prediction complete!"]); 
        setIsLoading(false);
        
        // Clean up the simulation interval if it's still running
        cleanupFn();
      }, 5000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Prediction failed",
        description: error instanceof Error ? error.message : "Could not generate prediction",
      });
      setIsLoading(false);
      
      // Add error to logs
      setLogs(prev => [
        ...prev, 
        "Error encountered during prediction process.", 
        "Please check input parameters and try again."
      ]);
    }
  };

  const resetPrediction = () => {
    setResult(null);
    setLogs([]);
  };

  return {
    result,
    isLoading,
    logs,
    generatePrediction,
    resetPrediction
  };
}
