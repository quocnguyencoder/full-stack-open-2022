import axios from "axios";
import React, { useEffect, useState } from "react";

const WeatherInfo = ({ city }) => {
  const [weather, setWeather] = useState();

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`
      )
      .then((res) => setWeather(res.data));
  }, [city]);

  return (
    <>
      <h2>Weather in {city}</h2>
      {weather ? (
        <>
          <p>{`temperature ${weather.main.temp} Celsius`}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p>{`wind ${weather.wind.speed} m/s`}</p>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default WeatherInfo;
