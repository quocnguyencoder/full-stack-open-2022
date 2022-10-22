import React from "react";

const Filter = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      filter shown with
      <input
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default Filter;
