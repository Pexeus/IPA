// Pfad: /cam/client/js/fetch.js
// Autor: Liam Benedetti
// Beschreibung: Übernimmt sämtliche Kommunikation mit dem Backend

// der Host wird definier, leer lassen falls der selbe Host auf die Statischen Files hostet.
const host = ""

// takes a route, as well as a request body as JS Object
// formats the body and sets all required headers
async function post(route, body) {
    return new Promise (async resolve => {
        let fetchOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(body)
        }
    
        const response = await fetch(route, fetchOptions)
    
        resolve(response)
    })
}

// takes a route, as well as a request body as JS Object
// formats the body and sets all required headers
async function put(route, body) {
    return new Promise (async resolve => {
        let fetchOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(body)
        }
    
        const response = await fetch(route, fetchOptions)
        
        console.log(response);

        resolve(response)
    })
}

//takes a GET route and returns the response using a Promise
async function get(route) {
    return new Promise(async resolve => {
        const response = await fetch(host + route)
        const jsonData = await response.json()

        resolve(jsonData)
    })
}