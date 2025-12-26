import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Person'
import personService from './services/persons'
import './index.css'


const App = () => {
  
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)


  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)){
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          setNotification(`Information of ${name} has already been removed from server`)
          setNotificationType('error')

          setTimeout(() => {
            setNotification(null)
          }, 3000);
          setNewName('')
        })
    }
  }
  
  useEffect(() => {
    //console.log("effect")
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

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

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmReplace) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(updatedPerson => {
            setPersons(
              persons.map(p =>
                p.id !== existingPerson.id ? p : updatedPerson
              )
            )
            setNewName('')
            setNewNumber('')
        })
        .catch(error => {
        setNotification(error.response.data.error)
        setNotificationType('error')
        setTimeout(() => {
          setNotification(null)
        }, 5000);
    })

    }

  } else {
    const newContact = {
      name: newName,
      number: newNumber
    }

      personService
      .create(newContact)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))

        setNotification(`Added ${newPerson.name}`)
        setNotificationType('success')

        setTimeout(() => {
          setNotification(null)
        }, 3000);
        setNewName('')
        setNewNumber('')
    })
    .catch(error => {
      setNotification(error.response.data.error)
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000);
    })

  }
}

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType}/>
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
      <Persons persons={persons} filter={filter} onDelete={deletePerson} />
    </div>
  )
}



export default App