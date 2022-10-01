import React from "react";

const Persons = ({ filteredResult, handleDeleteClick }) => {
  return (
    <div>
      {filteredResult.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDeleteClick(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
