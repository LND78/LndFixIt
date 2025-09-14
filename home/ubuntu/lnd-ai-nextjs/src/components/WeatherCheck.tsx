"use client";
import React, { useState } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

const WeatherCheck = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getWeatherIcon = (weather: string) => {
    const icons: { [key: string]: string } = {
      'Sunny': '☀️',
      'Clear': '☀️',
      'Cloudy': '☁️',
      'Clouds': '☁️',
      'Rainy': '🌧️',
      'Rain': '🌧️',
      'Snowy': '❄️',
      'Snow': '❄️',
      'Thunderstorm': '⛈️'
    };
    return icons[weather] || '🌤️';
  };

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const handleGetWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=demo&units=metric`);

      if (!response.ok) {
        console.warn('Live weather API failed, using consistent mock data.');
        const citySeed = hashCode(city.toLowerCase());
        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const weatherTypes = ['Sunny', 'Cloudy', 'Rainy', 'Snowy'];
        const mockWeather: WeatherData = {
            name: city,
            main: {
                temp: Math.floor(seededRandom(citySeed) * 35) + 5,
                humidity: Math.floor(seededRandom(citySeed * 2) * 50) + 30
            },
            weather: [{
                main: weatherTypes[Math.floor(seededRandom(citySeed * 3) * weatherTypes.length)],
                description: 'pleasant weather (mock data)'
            }],
            wind: {
                speed: Math.floor(seededRandom(citySeed * 4) * 10) + 2
            }
        };
        setWeatherData(mockWeather);
        setIsLoading(false); // Manually set loading to false here
        return;
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      // Don't set loading to false if we already did in the mock data block
      if(weatherData === null) setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="results-title" style={{ marginBottom: '20px' }}>Weather Information</h3>
      <div className="form-group">
        <label htmlFor="cityName" className="form-label">City Name</label>
        <input type="text" id="cityName" className="prompt-input" style={{ minHeight: 'auto', padding: '15px' }} placeholder="Enter city name..." value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <button className="generate-btn" onClick={handleGetWeather} disabled={isLoading}>
        <span className="btn-icon">🌤️</span>
        {isLoading ? 'Fetching...' : 'Get Weather'}
      </button>
      {error && <div className="error-message" style={{marginTop: '20px'}}><span>❌</span><span style={{textTransform: 'capitalize'}}>{error}</span></div>}
      {weatherData && (
        <div id="weatherResult" style={{ marginTop: '20px' }}>
          <div className="results-section" style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '25px', marginTop: '20px' }}>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '15px' }}>{getWeatherIcon(weatherData.weather[0].main)} Weather in {weatherData.name}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', color: 'var(--accent-purple)' }}>{Math.round(weatherData.main.temp)}°C</div>
                <div style={{ color: 'var(--text-muted)' }}>Temperature</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--light-purple)' }}>{weatherData.main.humidity}%</div>
                <div style={{ color: 'var(--text-muted)' }}>Humidity</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-accent)' }}>{weatherData.wind.speed} m/s</div>
                <div style={{ color: 'var(--text-muted)' }}>Wind Speed</div>
              </div>
            </div>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-light)', fontWeight: 600 }}>{weatherData.weather[0].main}</div>
              <div style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{weatherData.weather[0].description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCheck;
