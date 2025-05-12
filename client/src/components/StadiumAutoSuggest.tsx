import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface StadiumAutoSuggestProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  matchFormat: string;
  gender: string;
}

export function StadiumAutoSuggest({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder = "Enter stadium name...",
  error,
  matchFormat,
  gender
}: StadiumAutoSuggestProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch stadiums when value, matchFormat, or gender changes
    const fetchStadiums = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        return;
      }
      
      if (!matchFormat || !gender) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/cricket/stadiums?search=${encodeURIComponent(value)}&format=${matchFormat}&gender=${gender}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching stadiums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiums();
  }, [value, matchFormat, gender]);

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
            <MapPin className="w-4 h-4 text-primary opacity-70" />
          )}
        </div>
      </div>
      
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-card border border-primary/30 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((stadium, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm"
              onClick={() => {
                onChange(stadium);
                setShowSuggestions(false);
              }}
            >
              {stadium}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
