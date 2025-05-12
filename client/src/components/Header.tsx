import { Link, useLocation } from 'wouter';
import { Logo } from '../logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  return (
    <header className="py-3 px-4 border-b border-primary/30 flex items-center justify-between bg-card">
      <div className="flex items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => setLocation('/')}
        >
          <div className="w-10 h-10 mr-3">
            <Logo />
          </div>
          <h1 className="text-xl font-orbitron font-bold text-primary">Guru Gyan rAi</h1>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="bg-background rounded-full px-4 py-1.5 border border-primary/40 mr-4 text-sm">
          <span className="font-normal text-muted-foreground">Status:</span> 
          <span className="text-green-400">OPERATIONAL</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></div>
                <span className="text-sm">{user?.username}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
              
              {user?.isAdmin && (
                <Button variant="outline" size="sm" onClick={() => setLocation('/admin')}>
                  Admin Panel
                </Button>
              )}
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setLocation('/login')}>
              Login
            </Button>
          )}
          
          {isAuthenticated && (
            <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
              Dashboard
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
