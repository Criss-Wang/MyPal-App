var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var port = process.env.PORT || 5000
var path = require('path')

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
var LoginNUS = require('./routes/LoginNUS')

app.use('/users', Users)
app.use('/groups', Groups)
app.use('/contacts', Contacts)
app.use('/personals', Personals)
app.use('/auth', LoginNUS)

// Serve static assets if in production
if(process.env.NODE_ENV == 'production'){
    //Set static folder
    app.use(express.static('client/build'));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}   

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})