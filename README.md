# Phonebook Frontend

## Summary
The code snippet is a functional component called `App` that represents the main component of a phonebook application. It manages the state of the phonebook, including the list of persons, the input fields for adding new persons, the filter for searching persons, and the notification message. It also handles the logic for adding, updating, and removing persons from the phonebook.

## Example Usage
```javascript
const App = () => {
  // state variables
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [info, setInfo] = useState({ message: null });

  // effect hook to fetch initial persons data
  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  // function to show notification message
  const notifyWith = (message, type = 'info') => {
    setInfo({
      message,
      type,
    });

    setTimeout(() => {
      setInfo({ message: null });
    }, 3000);
  };

  // function to clean the form input fields
  const cleanForm = () => {
    setNewName('');
    setNewNumber('');
  };

  // function to update an existing person
  const updatePerson = (person) => {
    // confirmation dialog
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the number?`
    );
    if (ok) {
      // update the person using the personService
      personService
        .update(person.id, { ...person, number: newNumber })
        .then((updatedPerson) => {
          // update the persons state with the updated person
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          );
          // show success notification
          notifyWith(`phone number of ${person.name} updated!`);
        })
        .catch(() => {
          // show error notification and remove the person from the list
          notifyWith(`${person.name} has already been removed`, 'error');
          setPersons(persons.filter((p) => p.id !== person.id));
        });

      // clean the form input fields
      cleanForm();
    }
  };

  // function to add a new person
  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find((p) => p.name === newName);

    if (person) {
      // if person already exists, update the person
      updatePerson(person);
      return;
    }

    // create a new person using the personService
    personService
      .create({
        name: newName,
        number: newNumber,
      })
      .then((createdPerson) => {
        // update the persons state with the new person
        setPersons(persons.concat(createdPerson));

        // show success notification
        notifyWith(`${createdPerson.name} added!`);

        // clean the form input fields
        cleanForm();
      });
  };

  // function to remove a person
  const removePerson = (person) => {
    // confirmation dialog
    const ok = window.confirm(`remove ${person.name} from phonebook?`);
    if (ok) {
      // remove the person using the personService
      personService.remove(person.id).then(() => {
        // update the persons state by filtering out the removed person
        setPersons(persons.filter((p) => p.id !== person.id));
        // show success notification
        notifyWith(`number of ${person.name} deleted!`);
      });
    }
  };

  // function to filter persons by name
  const byFilterField = (p) =>
    p.name.toLowerCase().includes(filter.toLowerCase());

  // filter the persons based on the filter input
  const personsToShow = filter ? persons.filter(byFilterField) : persons;

  // render the components and pass the necessary props
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
```

## Code Analysis
### Inputs
- `persons`: an array of objects representing the phonebook entries
- `newName`: a string representing the value of the name input field
- `newNumber`: a string representing the value of the number input field
- `filter`: a string representing the value of the filter input field
- `info`: an object containing the notification message and type
___
### Flow
- The code snippet defines a functional component `App` that manages the state of the phonebook application.
- It uses the `useState` hook to define state variables for `persons`, `newName`, `newNumber`, `filter`, and `info`.
- The `useEffect` hook is used to fetch the initial list of persons from the server and update the `persons` state.
- The `notifyWith` function is used to show notification messages with a specified message and type.
- The `cleanForm` function is used to reset the input fields for adding new persons.
- The `updatePerson` function is called when a person with the same name already exists in the phonebook. It prompts the user for confirmation and updates the person's number if confirmed.
- The `addPerson` function is called when the form is submitted to add a new person to the phonebook. It checks if the person already exists and updates the person if necessary, or creates a new person using the `personService` and updates the `persons` state.
- The `removePerson` function is called when the delete button is clicked to remove a person from the phonebook. It prompts the user for confirmation and removes the person using the `personService`.
- The `byFilterField` function is used to filter the persons based on the filter input.
- The `personsToShow` variable is used to store the filtered list of persons to be displayed.
- The component renders the necessary components (`Notification`, `Filter`, `PersonForm`, `Persons`) and passes the required props.
___
### Outputs
- The rendered JSX elements representing the phonebook application, including the list of persons, the input fields for adding new persons, the filter input field, and the notification message.
___

