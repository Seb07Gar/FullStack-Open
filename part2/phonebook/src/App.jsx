import { useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Person'

const App = () => {
  
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }else if(persons.some(person => person.number === newNumber)){
      alert(`${newNumber} is already asigned to a person`)
    }else {
    const newContact = {name: newName, number: newNumber, id: String(persons.length+1)}
    setPersons(persons.concat(newContact))
    setNewName('')
    setNewNumber('')
    }
  }

  const personFiltered = filter
    ? persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    : persons
  
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}



export default App