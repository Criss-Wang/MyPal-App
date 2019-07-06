const express = require("express")
const personals = express.Router()
const cors = require("cors")

const Personal = require("../models/Personal");
personals.use(cors())

process.env.SECRET_KEY = 'secret'

personals.get('/getPersonal/:id', (req, res) => {
  Personal.findById(req.params.id)
            .then((personal)=> {
                res.json(personal)}) 
}) 

personals.post('/new', (req, res) => {
    let personalInfo = new Personal(req.body);
    Personal.create(personalInfo)
        .then((personal) => {
            res.json(personal)}) 
})

personals.put('/updatePersonal/:id', (req, res) =>{
    Personal.findByIdAndUpdate({_id:req.params.id},req.body)
        .then(() => {
            Personal.find({}).then((personals)=> {
                res.json(personals)}) 
        })
}) 

module.exports = personals