import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Prediction } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Medal } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [_, setLocation] = useLocation();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const { data: predictions, isLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/predictions/user'],
    enabled: isAuthenticated
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Authenticating...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="text-primary">{user?.username}</span>. View your prediction history and account settings.
          </p>
        </div>
        
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="predictions">My Predictions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>
                  View and analyze your previous match predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading your predictions...</p>
                  </div>
                ) : predictions && predictions.length > 0 ? (
                  <div className="space-y-4">
                    {predictions.map((prediction) => (
                      <Card key={prediction.id} className="bg-background">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center mb-2 md:mb-0">
                              <Badge className="mr-2" variant={prediction.matchFormat === 'T20' ? 'default' : 'secondary'}>
                                {prediction.matchFormat}
                              </Badge>
                              <Badge variant="outline">
                                {prediction.gender}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="mr-4">{new Date(prediction.matchDate).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{new Date(prediction.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{prediction.stadium}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{prediction.teamA}</span>
                                <span className="text-primary font-bold">{prediction.teamAWinPercentage}%</span>
                              </div>
                              <Progress value={prediction.teamAWinPercentage} className="h-2" />
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{prediction.teamB}</span>
                                <span className="text-primary font-bold">{prediction.teamBWinPercentage}%</span>
                              </div>
                              <Progress value={prediction.teamBWinPercentage} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant="outline" className="text-xs">
                              {prediction.predictionMode === 'pre-match' ? 'Pre-Match Prediction' : 'Post-Innings Prediction'}
                              {prediction.teamAScore && ` (Score: ${prediction.teamAScore})`}
                            </Badge>
                            
                            <div className="flex items-center text-sm">
                              <Medal className="w-4 h-4 mr-1 text-yellow-500" />
                              <span className="font-medium">
                                Winner: {prediction.teamAWinPercentage > prediction.teamBWinPercentage ? prediction.teamA : prediction.teamB}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">You haven't made any predictions yet.</p>
                    <Button 
                      onClick={() => setLocation('/')}
                      className="bg-gradient-to-r from-blue-600 to-primary"
                    >
                      Make Your First Prediction
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communication between you and the admin team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No messages yet.</p>
                  <Button variant="outline">Contact Admin</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="current-username">
                      Current Username
                    </label>
                    <Input 
                      id="current-username" 
                      value={user?.username} 
                      disabled 
                      className="bg-background/50"
                    />
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
