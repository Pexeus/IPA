// Path: /cam/server/logger.js
// Autor: Liam Benedetti
// Description: Logging web traffic

//log the most important information on every http request
module.exports = function logger(req, res, next) {
    console.log(`${req.url} : ${req.method}`);

    next()
}