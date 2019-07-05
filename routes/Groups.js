const express = require("express")
const groups = express.Router()
const cors = require("cors")

const Group = require("../models/Group")
groups.use(cors())

process.env.SECRET_KEY = 'secret'

groups.get('/getgroup', (req, res) => {
  Group.find({}).then((groups)=> {
    res.json(groups)}) 
})

groups.post('/new', (req, res) => {
    let group = new Group(req.body);
    group.save()
        .then(() => {
            Group.find({}).then((groups)=> {
                res.json(groups)}) 
        })
        .catch(err => {
            res.status(400).send('fails')
        })
})

groups.put('/updategroup/:id', (req, res) =>{
    Group.findByIdAndUpdate({_id:req.params.id},req.body)
        .then(() => {
            Group.find({}).then((groups)=> {
                res.json(groups)}) 
        })
})

groups.delete('/deletegroup/:id', (req, res) =>{
    Group.findByIdAndDelete({_id:req.params.id})
        .then(() => {
            Group.find({}).then((groups)=> {
                res.json(groups)}) 
        })
})

module.exports = groups