import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PredictionResult, WeatherData } from '@shared/types';
import { exportPredictionAsPDF } from '../lib/predictionEngine';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, AlertCircle, BarChart, MapPin, Users, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PredictionResultsProps {
  teamA: string;
  teamB: string;
  result: PredictionResult;
  weatherData?: WeatherData;
}

export function PredictionResults({ teamA, teamB, result, weatherData }: PredictionResultsProps) {
  const [showDetails, setShowDetails] = useState(false);
  
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
        <div className="flex justify-between items-center">
          <CardTitle className="font-orbitron text-primary">Prediction Results</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            className="h-8 px-2 text-muted-foreground hover:text-primary"
          >
            {showDetails ? (
              <><ChevronUp className="h-4 w-4 mr-1" /> Hide Analysis</>
            ) : (
              <><ChevronDown className="h-4 w-4 mr-1" /> Show Analysis</>
            )}
          </Button>
        </div>
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
            <div className="w-full bg-muted/50 rounded-lg p-4 border border-primary/10 mb-6">
              <h5 className="font-orbitron text-sm text-muted-foreground mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Weather Advisory:
              </h5>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-foreground">
                  Rain Probability in {weatherData.city} (next {weatherData.forecastHours} hrs): 
                  <span className="text-primary font-bold ml-2">
                    {Math.max(...weatherData.rainProbability)}%
                  </span>
                </p>
                <div className="text-foreground text-sm">
                  Temperature: <span className="text-primary font-bold">{weatherData.temperature}°C</span> | 
                  Conditions: <span className="text-primary font-bold">{weatherData.conditions}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Detailed Analysis Section */}
          {showDetails && (
            <div className="w-full mt-4 border-t border-primary/20 pt-4">
              <h5 className="font-orbitron text-base text-foreground mb-4 flex items-center">
                <BarChart className="h-4 w-4 mr-2" /> Detailed Performance Analysis
              </h5>
              
              <Tabs defaultValue="factors" className="w-full">
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="factors">Factors</TabsTrigger>
                  <TabsTrigger value="logs">Prediction Logs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="factors" className="space-y-4">
                  {/* Head to Head Factor */}
                  <div className="bg-background/60 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center text-foreground mb-2">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <h6 className="font-medium">Head-to-Head Record</h6>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span>{teamA} Wins: <span className="font-bold">{result.factors.headToHead.teamAWins}</span></span>
                      <span>{teamB} Wins: <span className="font-bold">{result.factors.headToHead.teamBWins}</span></span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-primary">{teamA} {result.factors.headToHead.teamAWinPercentage}%</div>
                        <div className="text-xs font-semibold text-primary">{teamB} {100 - result.factors.headToHead.teamAWinPercentage}%</div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                        <div style={{ width: `${result.factors.headToHead.teamAWinPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stadium Factor */}
                  <div className="bg-background/60 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center text-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <h6 className="font-medium">Stadium Performance</h6>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-primary">{teamA} {result.factors.stadiumAdvantage.teamAWinPercentage}%</div>
                        <div className="text-xs font-semibold text-primary">{teamB} {result.factors.stadiumAdvantage.teamBWinPercentage}%</div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                        <div style={{ width: `${result.factors.stadiumAdvantage.teamAWinPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Color Theory Factor */}
                  <div className="bg-background/60 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center text-foreground mb-2">
                      <div className="w-4 h-4 mr-2 rounded bg-gradient-to-r from-red-500 to-blue-500"></div>
                      <h6 className="font-medium">Color Theory Impact</h6>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-primary">{teamA} {result.factors.colorTheory.teamAPerformance}%</div>
                        <div className="text-xs font-semibold text-primary">{teamB} {result.factors.colorTheory.teamBPerformance}%</div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                        <div style={{ width: `${result.factors.colorTheory.teamAPerformance}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Seasonal Factor */}
                  <div className="bg-background/60 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center text-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <h6 className="font-medium">Seasonal Performance</h6>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-primary">{teamA} {result.factors.seasonalFactor.teamASeasonalAdvantage}%</div>
                        <div className="text-xs font-semibold text-primary">{teamB} {result.factors.seasonalFactor.teamBSeasonalAdvantage}%</div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                        <div style={{ width: `${result.factors.seasonalFactor.teamASeasonalAdvantage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* First Innings Score Pattern - only shown for post-innings predictions */}
                  {result.factors.scorePattern && (
                    <div className="bg-background/60 rounded-lg p-4 border border-primary/10">
                      <div className="flex items-center text-foreground mb-2">
                        <BarChart className="h-4 w-4 mr-2 text-primary" />
                        <h6 className="font-medium">First Innings Score Analysis</h6>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="text-xs font-semibold text-primary">{teamA} {result.factors.scorePattern.teamAWinProbability}%</div>
                          <div className="text-xs font-semibold text-primary">{teamB} {100 - result.factors.scorePattern.teamAWinProbability}%</div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                          <div style={{ width: `${result.factors.scorePattern.teamAWinProbability}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="logs">
                  <div className="bg-background/60 rounded-lg p-4 border border-primary/10 max-h-80 overflow-auto text-xs">
                    <Accordion type="single" collapsible className="w-full">
                      {result.logs.map((log, index) => {
                        // Check if log is a section header
                        const isHeader = log.includes("-----") || log.includes("FACTOR");
                        
                        if (isHeader) {
                          return (
                            <div key={index} className="text-primary font-bold mb-1 mt-2">
                              {log.replace(/-----+/g, "")}
                            </div>
                          );
                        } else {
                          return (
                            <div key={index} className="py-1 border-b border-primary/5 text-foreground">
                              {log}
                            </div>
                          );
                        }
                      })}
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>
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
