import React from "react";

const ResultList = ({ results, setSearchTerm }) => {
  return (
    <div>
      {results.map((country) => (
        <p key={country.name.common}>
          {country.name.common}
          <button onClick={() => setSearchTerm(country.name.common)}>
            show
          </button>
        </p>
      ))}
    </div>
  );
};

export default ResultList;
