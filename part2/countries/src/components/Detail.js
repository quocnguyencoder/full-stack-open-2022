import React from "react";
import WeatherInfo from "./WeatherInfo";

const Detail = ({ country }) => {
  const capital = country.capital[0];
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>{`capital ${capital}`}</p>
      <p>{`area ${country.area}`}</p>
      <h2>languages:</h2>
      <ul>
        {Object.keys(country.languages).map((code) => (
          <li key={code}>{country.languages[code]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`${country.name.common}'s flag`} />
      <WeatherInfo city={capital} />
    </div>
  );
};

export default Detail;
