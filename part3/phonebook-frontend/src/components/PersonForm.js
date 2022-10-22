import React from "react";

const PersonForm = ({
  handleSubmit,
  newName,
  handleNameInputChange,
  newNumber,
  handleNumberInputChange,
}) => {
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div>
        name:
        <input
          value={newName}
          onChange={(e) => handleNameInputChange(e.target.value)}
        />
      </div>
      <div>
        number:
        <input
          value={newNumber}
          onChange={(e) => handleNumberInputChange(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
