/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const Filter = ({value, handleChange}) => {
  return(
  <div>
        Filter by name: <input value={value} onChange={handleChange}/>
      </div>
  )
}

const Form = ({onSubmit, nameValue, handleNameValue, nroValue, handleNroValue}) => {
  return(
  <div>
    <form onSubmit={onSubmit}>
        <div>
         name: <input value={nameValue} onChange={handleNameValue}/>
        </div>
        <div>
          nro: <input value={nroValue} onChange={handleNroValue}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  </div>
  )
}

const Persons = ({persons}) => {
  return(
    <div>
      {persons}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNro, setNewNro] = useState('')
  const [filterValue, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)


  useEffect(()=>{
    personService.getAll().then(response =>{
      console.log(response)
      setPersons(response.data)
    })
  }, [])

  const deletePerson = id => {
    const person = persons.find(n => n.id === id)
    if(window.confirm(`Delete ${person.name} ?`))
    {
      personService.deletePerson(id)
      .then(response => {console.log(response.data)})
      .catch(() => {
        setNotification(`Information of ${person.name} has already been removed from server`)
      })

      setPersons(persons.filter(persons => persons.id !== id))

      setNotification(`Successfully deleted ${person.name}`)
          setTimeout(() => {
          setNotification(null)
        }, 5000)
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObj = {
      name: newName,
      number: newNro
    }

    if(persons.find((elem) => elem.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook. Want to replace old number?`)) {
        const updatedPerson = persons.find((elem) => elem.name === newName)

        personService.update(updatedPerson.id, personObj)
        .then(response => {console.log(response.data)})
        .catch((err) => {
          setNotification(`${err.response.data}`)
        })

        setTimeout(() => {
          setNotification(`Number of ${newName} is changed`)
        }, 5000)
      }

    } else {
      personService.create(personObj)
      .then(response => {console.log(response.data)})
      .catch((err) => {
        setNotification(`${err.response.data}`)
      })

      setNotification(`Successfully added ${newName}`)
          setTimeout(() => {
          setNotification(null)
        }, 5000)
    }
  }


 const handleNewName = (event) =>{setNewName(event.target.value)}
 const handleNewNro = (event) =>{setNewNro(event.target.value)}  
 const handleNewFilter = (event) =>{setNewFilter(event.target.value)}


const filteredPersons = persons.map(elem => elem.name.toLowerCase().includes(filterValue.toLowerCase()))?
persons.filter(elem => elem.name.toLowerCase().includes(filterValue.toLowerCase())):persons

const allPersons = filteredPersons.map(person => {
   return( 
     <div key={person.id}>
      <p> {person.name} {person.number}</p> 
      <button type="button" onClick={() => deletePerson(person.id)}>Delete</button>
     </div> 
   )
  }
  )


  return (
    <div>
      <Notification message={notification} />
      <Filter value={filterValue} handleChange={handleNewFilter}/>
      <h2>Phonebook</h2>
      <Form onSubmit={addPerson} nameValue={newName} handleNameValue={handleNewName} nroValue={newNro} handleNroValue={handleNewNro} />
      <h2>Numbers</h2>
      <Persons persons={allPersons}/>
    </div>
  )

}

export default App