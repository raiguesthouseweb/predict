import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface TeamAutoSuggestProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function TeamAutoSuggest({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "Enter team name...",
  error
}: TeamAutoSuggestProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch teams when value changes
    const fetchTeams = async () => {
      if (!value || value.length < 1) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cricket/teams?search=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [value]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <Label htmlFor={id} className="text-muted-foreground text-sm mb-1 block">
        {label}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`bg-background border-primary/30 w-full ${error ? 'border-destructive' : ''}`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-primary opacity-70" />
          )}
        </div>
      </div>
      
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-card border border-primary/30 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((team, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm"
              onClick={() => {
                onChange(team);
                setShowSuggestions(false);
              }}
            >
              {team}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
