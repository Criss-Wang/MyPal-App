const mongoose = require("mongoose")
const Schema = mongoose.Schema

 const SocialSchema = new Schema({
    Channel: {
        type: String,
    },
    Account: {
        type: String,
    },
})
const ContactSchema = new Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName: {
        type: String,
        required:true,
    },
    nickname: {
        type: String,
    },
    birthday: {
        type: String,
    },
    sex: {
        type: String,
        required:true,
    },
    Department: {
        type: String,
    },
    Major: {
        type: String,
    },
    Residence:{
        type: String,
    },
    YOS: {
        type: String,
    },
    Group:{
        type: [String],
        default:[],
    },
    Tags: {
        type: [String],
        default:[],
    },
    Recent_Event:{
        type:String,
    },
    Event_Date: {
        type: String,
    },
    Phone: {
        type: String,
    },
    Email: {
        type: String,
    },
    img: {
        type: String,
    },
    note: {
        type: String,
    },
    SocialAccount:[SocialSchema],
    date: {
        type: Date,
        default: Date.now()
    } 
}) 

module.exports = Contact = mongoose.model('contacts', ContactSchema)