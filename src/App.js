import { useState, useEffect } from 'react';

import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Filter from './components/Filter';
import Notification from './components/Notification';

import personService from './services/persons';

/*The `App` function is the main component of the phonebook application.
 It manages the state of the application, including the list of persons,
 the input fields for adding new persons, the filter for searching persons,
 and the notification message. It also handles the logic for adding, updating,
 and removing persons from the phonebook*/

const App = () => {
  // State variables
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [info, setInfo] = useState({ message: null });

  // Fetch initial persons data from server
  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  // Function to show notification message
  const notifyWith = (message, type = 'info') => {
    setInfo({
      message,
      type,
    });

    setTimeout(() => {
      setInfo({ message: null });
    }, 3000);
  };

  // Function to clean the input fields
  const cleanForm = () => {
    setNewName('');
    setNewNumber('');
  };

  // Function to update an existing person
  const updatePerson = (person) => {
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the number?`
    );
    if (ok) {
      personService
        .update(person.id, { ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          );
          notifyWith(`phone number of ${person.name} updated!`);
        })
        .catch(() => {
          notifyWith(`${person.name} has already been removed`, 'error');
          setPersons(persons.filter((p) => p.id !== person.id));
        });

      cleanForm();
    }
  };

  // Function to add a new person
  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find((p) => p.name === newName);

    if (person) {
      updatePerson(person);
      return;
    }

    personService
      .create({
        name: newName,
        number: newNumber,
      })
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson));

        notifyWith(`${createdPerson.name} added!`);

        cleanForm();
      })
      .catch(function (error) {
        const errorMessage = error.response.data.error;
        console.log(error.response.data.error);
        notifyWith(errorMessage, 'error');
      });
  };

  // Function to remove a person
  const removePerson = (person) => {
    const ok = window.confirm(`remove ${person.name} from phonebook?`);
    if (ok) {
      personService.remove(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
        notifyWith(`number of ${person.name} deleted!`);
      });
    }
  };

  // Function to filter persons by name
  const byFilterField = (p) =>
    p.name.toLowerCase().includes(filter.toLowerCase());

  // Filter the persons based on the filter value
  const personsToShow = filter ? persons.filter(byFilterField) : persons;

  // Render the components
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification info={info} />

      <Filter filter={filter} setFilter={setFilter} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h3>Phone numbers</h3>

      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  );
};

export default App;
