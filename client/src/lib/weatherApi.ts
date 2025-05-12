import { WeatherData } from '@shared/types';

export async function fetchWeatherData(city: string, forecastHours: number): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&hours=${forecastHours}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}
