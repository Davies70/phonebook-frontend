# Phonebook Frontend

## Summary
The frontend application uses a functional component called `App` that represents the main component of a phonebook application. It manages the state of the phonebook, including the list of persons, the input fields for adding new persons, the filter for searching persons, and the notification message. It also handles the logic for adding, updating, and removing persons from the phonebook.

The services module exports four functions: getAll, create, remove, and update. These functions make HTTP requests using the axios library to interact with a REST API. The getAll function sends a GET request to the '/api/persons' endpoint and returns the response data. The create function sends a POST request to the same endpoint with a new object as the request body and returns the response data. The remove function sends a DELETE request to the '/api/persons/{id}' endpoint with the provided id and returns the response data. The update function sends a PUT request to the same endpoint with the provided id and updated object as the request body and returns the response data.

___

### Outputs
- The rendered JSX elements representing the phonebook application, including the list of persons, the input fields for adding new persons, the filter input field, and the notification message.
___

