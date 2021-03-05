//Path: web/server/middleware/auth.js
//Autor: Liam Benedetti
//Description: authentification middleware for all express routes

const API_KEY = require("../config.json").key

//take a request and check the key
//if the key is correct, call next()
//if not, return a status
module.exports = (req, res, next) => {
    const key = req.headers.auth
    if (key == undefined) {
        res.json({
            authentification: false,
            message: "authentification required"
        })
    }
    else if (key != API_KEY) {
        res.json({
            authentification: false,
            message: "authentification failed"
        })
    }
    else if (key == API_KEY) {
        next()
    }
}