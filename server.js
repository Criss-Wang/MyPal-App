var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))

const db = require('./config/keys').MongoURI;
mongoose.set('useFindAndModify', false);
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))



var Users = require('./routes/Users')
var Groups = require('./routes/Groups')
var Contacts = require('./routes/Contacts')
var Personals = require('./routes/Personals')

app.use('/users', Users)
app.use('/groups', Groups)
app.use('/contacts', Contacts)
app.use('/personals', Personals)

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})