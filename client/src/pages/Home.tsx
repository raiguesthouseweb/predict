import { useState } from 'react';
import { SplashScreen } from '@/components/SplashScreen';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PredictionForm } from '@/components/PredictionForm';
import { PredictionResults } from '@/components/PredictionResults';
import { SystemLogs } from '@/components/SystemLogs';
import { WeatherWidget } from '@/components/WeatherWidget';
import { usePrediction } from '@/hooks/usePrediction';
import { useWeather } from '@/hooks/useWeather';
import { PredictionFormValues } from '@shared/schema';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [formData, setFormData] = useState<PredictionFormValues | null>(null);
  const { result, isLoading, logs, generatePrediction, resetPrediction } = usePrediction();
  
  // Only fetch weather when we have valid form data
  const { weatherData, isLoading: weatherLoading, error: weatherError } = useWeather(
    formData?.stadium || '',
    formData?.matchFormat as 'ODI' | 'T20' || 'T20'
  );

  const handlePredictionSubmit = (data: PredictionFormValues) => {
    setFormData(data);
    generatePrediction(data);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Get current date and time
  const now = new Date();
  const formattedDateTime = `${now.toISOString().slice(0, 10)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
        {/* System Status */}
        <div className="mb-8 font-orbitron">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>AI SYSTEM BOOTED</span>
            <span>|</span>
            <span>{formattedDateTime}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Cricket Match Prediction Dashboard</h2>
          <p className="text-muted-foreground text-sm">Advanced prediction system utilizing machine learning and historical match data analysis</p>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <PredictionForm 
              onSubmit={handlePredictionSubmit} 
              isLoading={isLoading} 
            />
            
            {/* Display results if available */}
            {result && formData && (
              <PredictionResults 
                teamA={formData.teamA} 
                teamB={formData.teamB} 
                result={result} 
                weatherData={weatherData || undefined}
              />
            )}
            
            {/* Weather widget if available */}
            {(weatherData || weatherLoading || weatherError) && (
              <WeatherWidget 
                weatherData={weatherData} 
                isLoading={weatherLoading} 
                error={weatherError} 
              />
            )}
          </div>
          
          {/* Right Panel: System Logs */}
          <div className="lg:col-span-1">
            <SystemLogs logs={logs} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
