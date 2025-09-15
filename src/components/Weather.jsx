import React, { useState } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Vite

export default function Weather() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherByCity = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('City not found');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || 'Error fetching weather');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Unable to fetch weather for location');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || 'Error fetching weather');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    fetchWeatherByCity(city.trim());
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => setError('Unable to retrieve your location')
    );
  };

  return (
    <div className="weather-card">
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g. Mumbai)"
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleUseLocation}>Use my location</button>
      </form>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="result">
          <h2>{data.name}, {data.sys?.country}</h2>
          <div className="temp-block">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
            />
            <div>
              <p className="temp">{Math.round(data.main.temp)}°C</p>
              <p className="desc">{data.weather[0].description}</p>
              <p>Feels like: {Math.round(data.main.feels_like)}°C</p>
            </div>
          </div>

          <div className="more">
            <p>Humidity: {data.main.humidity}%</p>
            <p>Wind: {Math.round(data.wind.speed)} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}
