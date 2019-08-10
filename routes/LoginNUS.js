const express = require("express")
const nusLogin = express.Router()
const cors = require("cors")
const passport = require('passport');
const nusStrategy = require('passportnext-nus-openid').Strategy;
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

nusLogin.use(cors())

process.env.SECRET_KEY = 'secret'

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const findOrCreate = (profile, func) => {
    // console.log("Profile: ", profile); //profile is an obj with displayName and nusNetID
    const name = profile.displayName;
    const nusNetID = profile.nusNetID;
    const email = profile.emails[0].value
    var newData = {username: name, email: email}
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                bcrypt.hash('test123', 10, (err, hash) => {
                    newData.password = hash
                    User.create(newData)
                })
                
            } else {
                console.log("User already created")
            }
        }).catch(err => console.log(err));
    func();
    return nusNetID;
}


passport.use(new nusStrategy({
    returnURL: `http://localhost:5000/auth/nus/return`,
    realm: "http://localhost:3000",
    profile: true,
    },
    function (identifier, profile, done) {
        profile.nusNetID = identifier.split("/")[3];
        findOrCreate(profile, function   (err, user) {
            done(err, profile);
        })
    }
));

nusLogin.use(passport.initialize());
nusLogin.use(passport.session());

nusLogin.get('/nus', passport.authenticate('nus-openid'));

nusLogin.get('/nus/return',
    function (req, res, next) {
        passport.authenticate('nus-openid', function (err, user, info) {
            console.log(user)
            var payload = {
                user: user.nusNetID,
                name: user.displayName, 
                email: user.emails[0].value
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 }); //modify secret value
            res.cookie('token', token, { httpOnly: false}); 
            res.redirect("http://localhost:3000/#/dashboard");
        })(req, res, next)
    });

module.exports = nusLogin;