const API_KEY = require("../key.json").key

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