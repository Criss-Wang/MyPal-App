const mongoose = require("mongoose")
const Schema = mongoose.Schema

const EventSchema = new Schema({
    EventName: {
        type: String,
        required: true,
        default: 'event name'
    },
    EventDate: {
        type: Date,
        required: true,
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