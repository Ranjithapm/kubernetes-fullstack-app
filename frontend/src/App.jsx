import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    setLoading(true);
    setError(null);
    setWeatherData(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }
      
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header>
          <h1>WeatherCast</h1>
          <p>Real-time forecasts for any city</p>
        </header>
        
        <form onSubmit={fetchWeather} className="search-form">
          <input 
            type="text" 
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {weatherData && (
          <div className="weather-info fade-in">
            <h2>{weatherData.city}{weatherData.country ? `, ${weatherData.country}` : ''}</h2>
            
            <div className="current-weather">
              <div className="temp-large">
                {weatherData.current.temperature}°
              </div>
              <div className="weather-details">
                <p>Wind: {weatherData.current.windspeed} km/h</p>
              </div>
            </div>

            <div className="forecast-section">
              <h3>7-Day Forecast</h3>
              <div className="forecast-grid">
                {weatherData.daily.time.map((time, index) => (
                  <div key={time} className="forecast-card">
                    <p className="date">{new Date(time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</p>
                    <div className="temps">
                      <span className="max-temp">{weatherData.daily.temperature_2m_max[index]}°</span>
                      <span className="min-temp">{weatherData.daily.temperature_2m_min[index]}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
