const express = require("express")
const contacts = express.Router()
const cors = require("cors")

const Contact = require("../models/Contact");
contacts.use(cors())

process.env.SECRET_KEY = 'secret'

contacts.get('/getcontact', (req, res) => {
  Contact.find({}).then((contacts)=> {
    res.json(contacts)}) 
}) 

contacts.post('/new', (req, res) => {
    let contact = new Contact(req.body);
    contact.save()
        .then(() => {
            Contact.find({}).then((contacts)=> {
                res.json(contacts)}) 
        })
        .catch(err => {
            res.status(400).send('fails')
        })
})

contacts.put('/updatecontact/:id', (req, res) =>{
    Contact.findByIdAndUpdate({_id:req.params.id},req.body)
        .then(() => {
            Contact.find({}).then((contacts)=> {
                res.json(contacts)}) 
        })
}) 

contacts.delete('/deletecontact/:id', (req, res) =>{
    Contact.findByIdAndDelete({_id:req.params.id})
        .then(() => {
            Contact.find({}).then((contacts)=> {
                res.json(contacts)}) 
        })
})

module.exports = contacts