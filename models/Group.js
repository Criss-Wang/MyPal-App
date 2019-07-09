const mongoose = require("mongoose")
const Schema = mongoose.Schema

const EventSchema = new Schema({
    EventName: {
        type: String,
        default: 'event name'
    },
    EventDate: {
        type: Date,
        default: Date.now()
    },
    EventNote: {
        type: String,
        default: ""
    },
})
const GroupSchema = new Schema({
    name: {
        type: [String],
        required: true
    },
    img: {
        type: [String],
        default: []
    },
    id: {
        type: [String],
        default: []
    },
    Events: [EventSchema],
    GroupName: {
        type: String,
        required: true,
        default: "New Group"
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Group = mongoose.model('groups', GroupSchema)