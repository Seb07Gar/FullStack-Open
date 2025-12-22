const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const personsLength = persons.length
    const requestDate = new Date() 
    response.send(`<p>Phonebook has info for ${personsLength} people</p>
        <p>${requestDate}</p>`)
})

app.get('/api/persons/:id', (request, response) =>{

    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const nameExists = persons.some(person => person.name === name)

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const randomId = Math.floor(Math.random() * 50000) + 100

  const newPerson = {
    id: String(randomId),
    name,
    number
  }

  persons.push(newPerson)

  response.status(201).json(newPerson)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})