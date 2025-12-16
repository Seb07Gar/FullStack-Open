import { useState, useEffect } from "react";
import axios from "axios";

const Country = ({ country, isButton, handleBack }) => {
  const [weather, setWeather] = useState(null);

 
  const languages = country.languages
    ? Object.entries(country.languages).map(([id, value]) => ({
        id,
        value,
      }))
    : [];

  
  const api_key = import.meta.env.VITE_WEATHER_KEY;
  console.log("API key:", import.meta.env.VITE_WEATHER_KEY);


  
  useEffect(() => {
    if (!country.capital || country.capital.length === 0) return;

    const capital = country.capital[0];
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;

    axios
      .get(url)
      .then((response) => {
        setWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setWeather(null);
      });
  }, [country.capital, api_key]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {languages.map((l) => (
          <li key={l.id}>{l.value}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt="country flag" />

      {weather ? (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="weather icon"
          />
        </div>
      ) : (
        <p>Loading weather...</p>
      )}

      {isButton && (
        <button onClick={handleBack} style={{ marginTop: "10px" }}>
          Back to list
        </button>
      )}
    </div>
  );
};

export default Country;
