const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("modjwt")

const API_KEY = require("../config.json").key

const db = require("../db/connection")

const router = express.Router()

const bcryptConf = {
    salt: 10
}

router.get("/hash/:plain", async (req, res) => {
    let result = await bcrypt.hash(req.params.plain, bcryptConf.salt)
    res.status(200).end(result)
})

router.post("/login", async (req, res) => {
    const credientals = req.body
    const users = await db("users").where({name: credientals.username})

    if(users.length > 0) {
        const pwCheck = await bcrypt.compare(credientals.password, users[0].password)

        if (pwCheck == true) {

            const token = await createToken(users[0], 7)
            res.status(200).json({status: true, message: "Login erfolgreich", token: token})
        }
        else {
            res.status(200).json({status: false, message: "Passwort inkorrekt!"})
        }
    }
    else {
        res.status(200).json({status: false, message: "Nutzername Inkorrekt"})
    }
})

async function createToken(user, lifetimeDays) {
    return new Promise(resolve => {
        const lifetime = 86400 * lifetimeDays
        const token = jwt.createToken({id: user.UID, name: user.name, role: user.role, key: API_KEY}, lifetime)

        resolve(token)
    })
}

module.exports = router