import { WeatherData } from "@shared/types";

// OpenWeatherMap API endpoint and key
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.OPENWEATHER_API_KEY || process.env.WEATHER_API_KEY || "default_key";

// Get current weather and forecast for a location
export async function getWeatherData(city: string, forecastHours: number): Promise<WeatherData> {
  try {
    // Fetch current weather
    const weatherResponse = await fetch(
      `${WEATHER_API_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.status} - ${await weatherResponse.text()}`);
    }
    
    const weatherData = await weatherResponse.json();
    
    // Fetch hourly forecast for rain probability
    const forecastResponse = await fetch(
      `${WEATHER_API_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.status} - ${await forecastResponse.text()}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Extract rain probability for the next few hours
    const rainProbability = forecastData.list
      .slice(0, forecastHours)
      .map((hour: any) => Math.round((hour.pop || 0) * 100)); // pop is probability of precipitation (0-1)
    
    return {
      city: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      conditions: weatherData.weather[0].main,
      rainProbability,
      forecastHours
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}
