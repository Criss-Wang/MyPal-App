const express = require("express")
const contacts = express.Router()
const cors = require("cors")

const Contact = require("../models/Contact");
contacts.use(cors())

process.env.SECRET_KEY = 'secret'

contacts.get('/getcontact/:idx', (req, res) => {
    Contact.findOne({_id:req.params.idx}).then((contact)=> {
        res.json(contact.contact)}) 
}) 

contacts.post('/new/:idx', (req, res) => {
    Contact.findByIdAndUpdate({_id:req.params.idx},
            {$push: {contact: req.body}})
        .then(() => {
            Contact.findOne({_id:req.params.idx}).then((contact)=> {
            res.json(contact.contact)}) 
        })
/*     let contact = new Contact(req.body);
    contact.save()
        .then(() => {
            Contact.find({}).then((contacts)=> {
                res.json(contacts)}) 
        })
        .catch(err => {
            res.status(400).send('fails')
        }) */
})

contacts.post('/newContact', (req, res) => {
    let contact = new Contact({contact:[]});
    var id = contact._id
    contact.save()
        .then(() => {
            Contact.find({_id: id}).then((contact)=> {
                res.json(contact)}) 
        })
        .catch(err => {
            res.status(400).send('fails')
        })
})

contacts.put('/:idx/updatecontact/:id', (req, res) =>{
    var setted = {}
    Object.entries(req.body).forEach(entry => {
        setted[`contact.$.${entry[0]}`] = entry[1]
    })
    Contact.updateOne({'contact._id': req.params.id}, setted, 
        function(err) {})
        .then(() => {
            Contact.findOne({_id:req.params.idx}).then((contacts)=> {
                res.json(contacts.contact)}) 
        })
})

contacts.put('/synccontact/:id', (req, res) =>{
    Contact.updateOne({'contact._id': req.params.id}, {$push: {'contact.$.Group': req.body.gn}})
        .then(() => {
            console.log('sync successful')
            res.json('sync successful')
        })
})


contacts.put('/syncDelcontact/:id', (req, res) =>{
    Contact.updateOne({'contact._id': req.params.id}, {$pull: {'contact.$.Group': req.body.gn}})
        .then(() => {
            console.log('sync Del successful')
            res.json('sync Del successful')
        })
})

contacts.delete('/:idx/deletecontact/:id', (req, res) =>{
    Contact.updateOne({'contact._id': req.params.id}, 
                { "$pull": { "contact": { "_id": req.params.id } }}, 
                function(err) {console.log(err)})
    .then(() => {
        Contact.findOne({_id:req.params.idx}).then((contacts)=> {
            res.json(contacts.contact)}) 
    })
})

contacts.get('/getbefore', (req, res) => {
    Contact.find({}).then((contact)=> res.json(contact))
})
module.exports = contacts