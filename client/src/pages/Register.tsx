import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const [_, setLocation] = useLocation();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data.username, data.password);
      setLocation('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-12 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto bg-card border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-orbitron text-primary">Create Account</CardTitle>
            <CardDescription>
              Register to save your predictions and access advanced features
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Choose a password" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          className="bg-background border-primary/30"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{' '}
                  <Link href="/login">
                    <a className="text-primary hover:underline">Login</a>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
