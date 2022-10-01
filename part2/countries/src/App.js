import axios from "axios";
import React, { useEffect, useState } from "react";
import Detail from "./components/Detail";
import ResultList from "./components/ResultList";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((res) => {
      setCountries(res.data);
    });
  }, []);

  useEffect(() => {
    const emptySearch = searchTerm === "";
    if (emptySearch) {
      setResults([]);
    } else {
      const filteredCountries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredCountries);
    }
  }, [countries, searchTerm]);

  const manyResults = results.length > 10;
  const oneResult = results.length === 1;

  return (
    <div>
      <div>
        {"find countries "}
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {manyResults ? (
        <p>Too many matches, specify another filter</p>
      ) : oneResult ? (
        <Detail country={results[0]} />
      ) : (
        <ResultList results={results} setSearchTerm={setSearchTerm} />
      )}
    </div>
  );
};

export default App;
