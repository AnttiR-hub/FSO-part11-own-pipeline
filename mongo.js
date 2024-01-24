const mongoose = require('mongoose') 


if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://AnttiR:${password}@phonebookdb.sqmjfsv.mongodb.net/PhonebookDB?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
  
const peopleSchema = new mongoose.Schema({
    name: String,
    number: String
})
  
const People = mongoose.model('person', peopleSchema)
  
if(process.argv.length===3){
    
    People.find({}).then(result => {
        console.log('phonebook: ')
        result.forEach(people => {
            console.log(`${people.name} ${people.number}`)
        })
        mongoose.connection.close()
    })
  
}else{
    const people = new People({
        name: process.argv[3],
        number: process.argv[4],
    }) 
    
    people.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}