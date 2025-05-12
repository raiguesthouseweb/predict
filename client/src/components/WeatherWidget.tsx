import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@shared/types';
import { Cloud, CloudRain, Droplets, Sun, Thermometer } from 'lucide-react';

interface WeatherWidgetProps {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

export function WeatherWidget({ weatherData, isLoading, error }: WeatherWidgetProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardHeader className="border-b border-primary/20 px-4 py-3">
          <CardTitle className="font-orbitron text-primary">Weather Advisory</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex justify-center items-center h-32">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-sm">Loading weather data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-primary/20 shadow-lg">
        <CardHeader className="border-b border-primary/20 px-4 py-3">
          <CardTitle className="font-orbitron text-primary">Weather Advisory</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-destructive text-sm">
            Error loading weather data: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return null;
  }

  // Get weather icon based on conditions
  const getWeatherIcon = (conditions: string) => {
    if (conditions.toLowerCase().includes('rain')) {
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    } else if (conditions.toLowerCase().includes('cloud')) {
      return <Cloud className="w-6 h-6 text-gray-400" />;
    } else if (conditions.toLowerCase().includes('sun') || conditions.toLowerCase().includes('clear')) {
      return <Sun className="w-6 h-6 text-yellow-400" />;
    } else {
      return <Cloud className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-card border-primary/20 shadow-lg">
      <CardHeader className="border-b border-primary/20 px-4 py-3">
        <CardTitle className="font-orbitron text-primary">Weather Advisory</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 mb-3">
          {getWeatherIcon(weatherData.conditions)}
          <div>
            <h3 className="font-semibold">{weatherData.city}</h3>
            <div className="text-sm text-muted-foreground">{weatherData.conditions}</div>
          </div>
          <div className="ml-auto flex items-center">
            <Thermometer className="w-4 h-4 mr-1 text-red-400" />
            <span>{weatherData.temperature}°C</span>
          </div>
        </div>
        
        <div className="bg-background p-3 rounded-md border border-primary/10">
          <div className="flex items-center mb-1">
            <Droplets className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-sm">Rain Probability (next {weatherData.forecastHours} hrs):</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mt-2">
            {weatherData.rainProbability.map((prob, i) => (
              <div 
                key={i} 
                className="text-center py-1 px-2 rounded bg-blue-900/20 border border-blue-900/30"
              >
                <div className="text-xs text-muted-foreground">+{i+1}hr</div>
                <div className={`text-sm font-medium ${prob > 50 ? 'text-blue-400' : 'text-foreground'}`}>
                  {prob}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
