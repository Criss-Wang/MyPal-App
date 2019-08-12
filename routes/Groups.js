const express = require("express")
const groups = express.Router()
const cors = require("cors")

const Group = require("../models/Group")
groups.use(cors())

process.env.SECRET_KEY = 'secret'

groups.get('/getgroup/:idx', (req, res) => {
  Group.findOne({_id:req.params.idx}).then((groups)=> {
    res.json(groups.group)}) 
})

groups.post('/new/:idx', (req, res) => {
    Group.findByIdAndUpdate({_id:req.params.idx},
                        {$push: {group: req.body}})
        .then(() => {
            Group.findOne({_id:req.params.idx}).then((groups)=> {
                res.json(groups.group)}) 
        })
})

groups.post('/newGroup', (req, res) => {
    let group = new Group({group:[]});
    var id = group._id
    group.save()
        .then(() => {
            Group.find({_id:id}).then((groups)=> {
                res.json(groups)}) 
        })
        .catch(err => {
            res.status(400).send('fails')
        })
})

groups.put('/:idx/updategroup/:id', (req, res) =>{
    var setted = {}
    Object.entries(req.body).forEach(entry => {
        setted[`group.$.${entry[0]}`] = entry[1]
    })
    Group.updateOne({'group._id': req.params.id}, setted)
        .then(() => {
            Group.findOne({_id:req.params.idx}).then((groups)=> {
                res.json(groups.group)}) 
        })
})

groups.delete('/:idx/deletegroup/:id', (req, res) =>{
    Group.updateOne({'group._id': req.params.id}, { "$pull": { "group": { "_id": req.params.id } }}
        )
        .then(() => {
            Group.findOne({_id:req.params.idx}).then((groups)=> {
                res.json(groups.group)}) 
        })
})

groups.get('/getbefore', (req, res) => {
    Group.find({}).then((group)=> res.json(group))
})

/* groups.put('/updategroup/:id', (req, res) =>{
    Group.findByIdAndUpdate({_id:req.params.id},req.body)
        .then(() => {
            Group.find({}).then((groups)=> {
                res.json(groups)}) 
        })
}) */

/* groups.delete('/deletegroup/:id', (req, res) =>{
    Group.findByIdAndDelete({_id:req.params.id})
        .then(() => {
            Group.find({}).then((groups)=> {
                res.json(groups)}) 
        })
}) */

module.exports = groups