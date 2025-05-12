import { WeatherData } from "@shared/types";

// OpenWeatherMap API endpoint and keys
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

// Check if API key is available
function getApiKey(): string | null {
  const key = process.env.OPENWEATHER_API_KEY;
  return key || null;
}

// Get current weather and forecast for a location
export async function getWeatherData(city: string, forecastHours: number): Promise<WeatherData> {
  try {
    // Check if we have an API key
    const API_KEY = getApiKey();
    if (!API_KEY) {
      throw new Error("No OpenWeatherMap API key found. Please set OPENWEATHER_API_KEY environment variable.");
    }
    
    // Fetch current weather
    console.log(`Fetching weather data for city: ${city}`);
    const weatherResponse = await fetch(
      `${WEATHER_API_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error(`Weather API error: ${weatherResponse.status} - ${errorText}`);
      throw new Error(`Weather API error: ${weatherResponse.status} - ${errorText}`);
    }
    
    const weatherData = await weatherResponse.json();
    console.log(`Weather data received for: ${weatherData.name}`);
    
    // Fetch hourly forecast for rain probability
    const forecastResponse = await fetch(
      `${WEATHER_API_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error(`Forecast API error: ${forecastResponse.status} - ${errorText}`);
      throw new Error(`Forecast API error: ${forecastResponse.status} - ${errorText}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Extract rain probability for the next few hours
    const rainProbability = forecastData.list
      .slice(0, forecastHours)
      .map((hour: any) => Math.round((hour.pop || 0) * 100)); // pop is probability of precipitation (0-1)
    
    // Build and return the weather data object
    const result: WeatherData = {
      city: weatherData.name || city,
      temperature: Math.round(weatherData.main.temp),
      conditions: weatherData.weather[0].main,
      rainProbability: rainProbability,
      forecastHours
    };
    
    console.log(`Successfully processed weather data for ${result.city}`);
    return result;
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}
