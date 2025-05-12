import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { AuthContextType, AuthUser } from '@shared/types';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to check authentication state
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Authentication check failed', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth on component mount
  useEffect(() => {
    checkAuth();
    
    // Also check auth when window gets focus
    const handleFocus = () => checkAuth();
    window.addEventListener('focus', handleFocus);
    
    // Handle storage events for cross-tab communication
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'auth_state_change') {
        await checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await res.json();
      setUser(userData);
      
      // Notify other tabs about the auth state change
      localStorage.setItem('auth_state_change', Date.now().toString());
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
      });
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await apiRequest('POST', '/api/auth/register', { username, password });
      const userData = await res.json();
      setUser(userData);
      
      // Notify other tabs about the auth state change
      localStorage.setItem('auth_state_change', Date.now().toString());
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.username}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setUser(null);
      
      // Notify other tabs about the auth state change
      localStorage.setItem('auth_state_change', Date.now().toString());
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return React.createElement(AuthContext.Provider, {
    value: {
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }
  }, children);
};

export const useAuth = () => useContext(AuthContext);
