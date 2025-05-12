import { useLocation } from 'wouter';

export function Footer() {
  const [, setLocation] = useLocation();
  
  return (
    <footer className="py-4 px-6 bg-card border-t border-primary/20 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-xs text-muted-foreground mb-2 md:mb-0">
          © {new Date().getFullYear()} Guru Gyan rAi - Advanced Cricket Match Prediction System
        </div>
        <div className="flex items-center space-x-4">
          <span 
            className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => setLocation('/')}
          >
            Home
          </span>
          <span 
            className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => setLocation('/dashboard')}
          >
            Dashboard
          </span>
          <span 
            className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => setLocation('/login')}
          >
            Login
          </span>
        </div>
      </div>
    </footer>
  );
}
