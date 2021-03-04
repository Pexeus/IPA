// Pfad: /cam/client/js/fetch.js
// Autor: Liam Benedetti
// Beschreibung: Übernimmt sämtliche Kommunikation mit dem Backend

// der Host wird definier, leer lassen falls der selbe Host auf die Statischen Files hostet.
const host = ""

// stellt POST anfragen und gibt über einen Promise die responses zurück.
// header, sowie formatierungen werden automatisch übernommen
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

// stellt PUT anfragen und gibt über einen Promise die responses zurück.
// header, sowie formatierungen werden automatisch übernommen
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

// stellt GET anfragen und gibt über einen Promise die responses zurück.
async function get(route) {
    return new Promise(async resolve => {
        const response = await fetch(host + route)
        const jsonData = await response.json()

        resolve(jsonData)
    })
}