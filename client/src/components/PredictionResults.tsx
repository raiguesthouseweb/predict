import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PredictionResult, WeatherData } from '@shared/types';
import { exportPredictionAsPDF } from '../lib/predictionEngine';
import { Progress } from '@/components/ui/progress';

interface PredictionResultsProps {
  teamA: string;
  teamB: string;
  result: PredictionResult;
  weatherData?: WeatherData;
}

export function PredictionResults({ teamA, teamB, result, weatherData }: PredictionResultsProps) {
  const handleExport = () => {
    exportPredictionAsPDF(
      teamA,
      teamB,
      result.teamAWinPercentage,
      result.teamBWinPercentage,
      weatherData
    );
  };

  return (
    <Card className="mt-6 bg-card border-primary/20 shadow-lg">
      <CardHeader className="border-b border-primary/20 px-4 py-3">
        <CardTitle className="font-orbitron text-primary">Prediction Results</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-4">
          <h4 className="text-xl font-orbitron text-foreground mb-6 text-center">Guru Gyan Prediction says:</h4>
          
          <div className="flex flex-col md:flex-row w-full justify-between mb-8 space-y-6 md:space-y-0 md:space-x-4">
            {/* Team A Prediction */}
            <div className="w-full md:w-1/2 bg-background rounded-lg p-4 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="font-orbitron text-lg font-bold">{teamA}</div>
                <div className="text-primary font-bold text-xl neon-glow">{result.teamAWinPercentage}%</div>
              </div>
              <Progress value={result.teamAWinPercentage} className="h-3 bg-muted" />
            </div>
            
            {/* Team B Prediction */}
            <div className="w-full md:w-1/2 bg-background rounded-lg p-4 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="font-orbitron text-lg font-bold">{teamB}</div>
                <div className="text-primary font-bold text-xl neon-glow">{result.teamBWinPercentage}%</div>
              </div>
              <Progress value={result.teamBWinPercentage} className="h-3 bg-muted" />
            </div>
          </div>
          
          {/* Weather Information */}
          {weatherData && (
            <div className="w-full bg-muted/50 rounded-lg p-4 border border-primary/10">
              <h5 className="font-orbitron text-sm text-muted-foreground mb-2">Weather Advisory:</h5>
              <p className="text-foreground">
                Rain Probability in {weatherData.city} (next {weatherData.forecastHours} hrs): 
                <span className="text-primary font-bold ml-2">
                  {Math.max(...weatherData.rainProbability)}%
                </span>
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handleExport}
            variant="outline" 
            className="border-primary/40 text-primary hover:bg-primary/10"
          >
            Export Prediction
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
