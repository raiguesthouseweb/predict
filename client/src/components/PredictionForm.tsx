import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PredictionFormValues, predictionFormSchema } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TeamAutoSuggest } from './TeamAutoSuggest';
import { StadiumAutoSuggest } from './StadiumAutoSuggest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface PredictionFormProps {
  onSubmit: (data: PredictionFormValues) => void;
  isLoading: boolean;
}

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [predictionMode, setPredictionMode] = useState<'pre-match' | 'post-innings'>('pre-match');
  
  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      teamA: '',
      teamB: '',
      matchFormat: 'T20',
      gender: 'Male',
      matchDate: format(new Date(), 'yyyy-MM-dd'),
      stadium: '',
      teamAScore: null,
      predictionMode: 'pre-match'
    }
  });

  const handleSubmit = (data: PredictionFormValues) => {
    // Ensure the predictionMode is correctly set
    data.predictionMode = predictionMode;
    onSubmit(data);
  };

  const handleReset = () => {
    form.reset();
  };

  const handlePredictionModeChange = (mode: 'pre-match' | 'post-innings') => {
    setPredictionMode(mode);
    form.setValue('predictionMode', mode);
  };

  return (
    <Card className="bg-card border-primary/20 shadow-lg">
      <CardHeader className="border-b border-primary/20 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="font-orbitron text-primary">Match Prediction Parameters</CardTitle>
          
          <div className="flex flex-col sm:flex-row sm:items-center text-xs text-muted-foreground gap-2">
            <span>Prediction Mode:</span>
            <div className="flex">
              <Button
                type="button"
                size="sm"
                variant={predictionMode === 'pre-match' ? "default" : "outline"}
                className={`rounded-l-md text-xs py-1 px-3 h-auto ${
                  predictionMode === 'pre-match' ? 'bg-primary/20 text-primary' : ''
                }`}
                onClick={() => handlePredictionModeChange('pre-match')}
              >
                Pre-Match
              </Button>
              <Button
                type="button"
                size="sm"
                variant={predictionMode === 'post-innings' ? "default" : "outline"}
                className={`rounded-r-md text-xs py-1 px-3 h-auto ${
                  predictionMode === 'post-innings' ? 'bg-primary/20 text-primary' : ''
                }`}
                onClick={() => handlePredictionModeChange('post-innings')}
              >
                Inning Break
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teamA"
                render={({ field }) => (
                  <FormItem>
                    <TeamAutoSuggest
                      id="team-a"
                      label="Team A"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.teamA?.message}
                    />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teamB"
                render={({ field }) => (
                  <FormItem>
                    <TeamAutoSuggest
                      id="team-b"
                      label="Team B"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.teamB?.message}
                    />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matchFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">Match Format</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="T20" />
                          </FormControl>
                          <FormLabel className="cursor-pointer">T20</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="ODI" />
                          </FormControl>
                          <FormLabel className="cursor-pointer">ODI</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="Male" />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="Female" />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matchDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-sm">Match Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-background border-primary/30"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stadium"
                render={({ field }) => (
                  <FormItem>
                    <StadiumAutoSuggest
                      id="stadium"
                      label="Stadium"
                      value={field.value}
                      onChange={field.onChange}
                      error={form.formState.errors.stadium?.message}
                      matchFormat={form.watch('matchFormat')}
                      gender={form.watch('gender')}
                    />
                  </FormItem>
                )}
              />
              
              {predictionMode === 'post-innings' && (
                <FormField
                  control={form.control}
                  name="teamAScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-sm">Team A Score</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-background border-primary/30"
                          placeholder="Enter first innings score"
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="mr-3 border-border text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-primary hover:from-blue-700 hover:to-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Start Prediction'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
