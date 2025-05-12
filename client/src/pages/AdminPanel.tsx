import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { User, Prediction, Message } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanel() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      setLocation('/');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
      });
    }
  }, [authLoading, isAuthenticated, user, setLocation, toast]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && user?.isAdmin
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery<Prediction[]>({
    queryKey: ['/api/admin/predictions'],
    enabled: isAuthenticated && user?.isAdmin
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/admin/messages'],
    enabled: isAuthenticated && user?.isAdmin
  });

  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const messageForm = useForm({
    defaultValues: {
      userId: '',
      message: ''
    }
  });

  const userForm = useForm({
    defaultValues: {
      username: '',
      password: '',
      isAdmin: false
    }
  });

  const sendMessage = async (data: { userId: string, message: string }) => {
    try {
      await apiRequest('POST', '/api/admin/messages', {
        userId: parseInt(data.userId),
        content: data.message,
        fromAdmin: true
      });
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
      });
      
      messageForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Message Failed",
        description: error instanceof Error ? error.message : "Could not send message",
      });
    }
  };

  const createUser = async (data: { username: string, password: string, isAdmin: boolean }) => {
    try {
      await apiRequest('POST', '/api/admin/users', data);
      
      toast({
        title: "User Created",
        description: `User ${data.username} has been created successfully`,
      });
      
      userForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "User Creation Failed",
        description: error instanceof Error ? error.message : "Could not create user",
      });
    }
  };

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

  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Welcome, <span className="text-primary">{user?.username}</span>. Manage users, view predictions, and handle messages.
          </p>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="create">Create User</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading users...</p>
                  </div>
                ) : users && users.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>
                            <Badge variant={user.isAdmin ? "secondary" : "outline"}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user.id)}
                            >
                              Message
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No users found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Prediction History</CardTitle>
                <CardDescription>
                  View all predictions made by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading predictions...</p>
                  </div>
                ) : predictions && predictions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Teams</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions.map((prediction) => (
                        <TableRow key={prediction.id}>
                          <TableCell>{prediction.id}</TableCell>
                          <TableCell>{prediction.userId}</TableCell>
                          <TableCell>
                            {prediction.teamA} vs {prediction.teamB}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {prediction.matchFormat}/{prediction.gender}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {prediction.teamAWinPercentage}% / {prediction.teamBWinPercentage}%
                          </TableCell>
                          <TableCell>{new Date(prediction.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No predictions found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Message Center</CardTitle>
                <CardDescription>
                  Send and manage messages to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle className="text-lg">Send Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...messageForm}>
                        <form onSubmit={messageForm.handleSubmit(sendMessage)} className="space-y-4">
                          <FormField
                            control={messageForm.control}
                            name="userId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recipient</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                  defaultValue={selectedUser?.toString() || ''}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {users?.map(user => (
                                      <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.username}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={messageForm.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Type your message here..." 
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-background">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {messagesLoading ? (
                        <div className="text-center py-4">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Loading messages...</p>
                        </div>
                      ) : messages && messages.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                          {messages.map((message) => (
                            <div 
                              key={message.id}
                              className={`p-3 rounded-lg ${
                                message.fromAdmin 
                                  ? 'bg-primary/10 ml-6' 
                                  : 'bg-muted mr-6'
                              }`}
                            >
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>
                                  {message.fromAdmin ? 'Admin' : `User #${message.userId}`}
                                </span>
                                <span>{new Date(message.createdAt).toLocaleString()}</span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No messages yet.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>
                  Add a new user to the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(createUser)} className="space-y-4 max-w-md mx-auto">
                    <FormField
                      control={userForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter username" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter password" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="isAdmin"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="w-4 h-4"
                            />
                          </FormControl>
                          <FormLabel>Admin User</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">Create User</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
