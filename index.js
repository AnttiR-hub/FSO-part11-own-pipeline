/* eslint-disable linebreak-style */
const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/people')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('body', (req) => JSON.stringify(req.body))




app.get('/', (req, res) => {
    res.send()
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(result => {
            console.log(result)
            res.json(result)
        }).catch(error => next(error))
})


app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person)
            }else{
                res.status(404).end()
            }
        }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        }).catch(error => next(error))
})

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.post('/api/persons', postMorgan, (req, res, next) => {
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number missing'
        })
    }else{
        const person = new Person({
            name: body.name,
            number: body.number,
        }) 

        person.save()
            .then(person => {
                res.json(person)
            }).catch(error => next(error))
    }
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Person.findByIdAndUpdate(
        req.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})


app.get('/info', (req, res, next) => {
    const date = new Date()
    Person.find({})
        .then(result => {
            res.send(
                `<p>Phonebook has info for ${result.length} persons</p>
             <br>
             <p>${date}</p>`
            )
        }).catch(error => next(error))
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})