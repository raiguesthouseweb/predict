import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AdminPanel from "@/pages/AdminPanel";
import { AuthProvider } from "./hooks/useAuth";
import { SplashScreen } from "./components/SplashScreen";
import { Toaster } from "./components/ui/toaster";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/prediction" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  // Check if we've shown the splash screen before in this session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);
  
  const handleSplashFinish = () => {
    setShowSplash(false);
    // Save to session storage so user doesn't see splash again in this tab session
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {showSplash ? (
            <SplashScreen onFinish={handleSplashFinish} />
          ) : (
            <Router />
          )}
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
