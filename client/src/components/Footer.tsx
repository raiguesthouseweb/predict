import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="py-4 px-6 bg-card border-t border-primary/20 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-xs text-muted-foreground mb-2 md:mb-0">
          © {new Date().getFullYear()} Guru Gyan rAi - Advanced Cricket Match Prediction System
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="text-xs text-muted-foreground hover:text-primary">Home</a>
          </Link>
          <Link href="/dashboard">
            <a className="text-xs text-muted-foreground hover:text-primary">Dashboard</a>
          </Link>
          <Link href="/login">
            <a className="text-xs text-muted-foreground hover:text-primary">Login</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
