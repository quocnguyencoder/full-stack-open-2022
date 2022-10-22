import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [notiType, setNotiType] = useState("");

  const handleNameInputChange = (value) => setNewName(value);
  const handleNumberInputChange = (value) => setNewNumber(value);

  const checkNameExists = (name) =>
    persons.some((person) => person.name === name);

  const handleShowNotification = (type, message) => {
    setErrorMessage(message);
    setNotiType(type);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };
  const resetInputs = () => {
    setNewName("");
    setNewNumber("");
  };

  const handleUpdatePerson = (data) => {
    const person = persons.find((p) => p.name === data.name);
    const changedPerson = { ...data, id: person.id };

    personService
      .update(person.id, data)
      .then((data) => {
        setPersons(persons.map((p) => (p.id === data.id ? changedPerson : p)));
        resetInputs();
        handleShowNotification("success", `Updated ${person.name}'s number`);
      })
      .catch((error) => {
        handleShowNotification("error", error.response.data.error);
      });
  };

  const handleCreatePerson = (newPerson) => {
    personService
      .create(newPerson)
      .then((data) => {
        setPersons(persons.concat(data));
        resetInputs();
        handleShowNotification("success", `Added ${newPerson.name}`);
      })
      .catch((error) => {
        handleShowNotification("error", error.response.data.error);
      });
  };

  const hasEmptyInput = newName.trim() === "" || newNumber.trim() === "";

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };
    const personExists = checkNameExists(newPerson.name);
    const confirmUpdate = () =>
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

    !hasEmptyInput
      ? personExists
        ? confirmUpdate() && handleUpdatePerson(newPerson)
        : handleCreatePerson(newPerson)
      : void 0;
  };

  const handleSearch = (input) => setSearchTerm(input);

  const isEmptySearch = searchTerm === "";

  const filteredResult = isEmptySearch
    ? persons
    : persons.filter((persons) =>
        persons.name
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
      );

  useEffect(() => {
    personService.getAll().then((data) => setPersons(data));
  }, []);

  const handleDeletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          handleShowNotification("success", `Deleted ${person.name}`);
        })
        .catch(() => {
          handleShowNotification(
            "error",
            `Person ${person.name} was already removed from server`
          );
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={notiType} message={errorMessage} />
      <Filter searchTerm={searchTerm} handleSearch={handleSearch} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameInputChange={handleNameInputChange}
        newNumber={newNumber}
        handleNumberInputChange={handleNumberInputChange}
      />
      <h2>Numbers</h2>
      <Persons
        filteredResult={filteredResult}
        handleDeleteClick={handleDeletePerson}
      />
    </div>
  );
};

export default App;
