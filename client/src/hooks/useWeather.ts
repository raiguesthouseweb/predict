import { useState, useEffect } from 'react';
import { WeatherData } from '@shared/types';
import { fetchWeatherData } from '../lib/weatherApi';

export function useWeather(stadium: string, matchFormat: 'ODI' | 'T20') {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeatherData = async () => {
      if (!stadium) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Extract city from stadium (e.g., "Wankhede Stadium, Mumbai" -> "Mumbai")
        const cityMatch = stadium.match(/,\s*([^,]+)$/);
        const city = cityMatch ? cityMatch[1].trim() : stadium.split(',')[0].trim();
        
        // Determine forecast hours based on match format
        const forecastHours = matchFormat === 'ODI' ? 10 : 4;
        
        const data = await fetchWeatherData(city, forecastHours);
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getWeatherData();
  }, [stadium, matchFormat]);

  return { weatherData, isLoading, error };
}
