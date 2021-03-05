//Path: web/client-dev/src/config.js
//Autor: Liam Benedetti
//Description: Manages Requets to the API

import {host} from "./config"
import {decodeToken} from "./jwt"

//sets the headers and options for POST requests
export async function post(route, body) {
    const key = getKey()

    let fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            "Auth": key
        },
        method: "POST",
        body: JSON.stringify(body)
    }

    const response = await fetch(host + route, fetchOptions)
    const jsonData = await response.json()

    return jsonData
}
//sets the headers and options for GET requests
export async function get(route) {
    const key = getKey()

    let fetchOptions = {
        headers: {
            "Content-Type": "application/json",
            "Auth": key
        },
        method: "GET",
    }

    const response = await fetch(host + route, fetchOptions)
    const jsonData = await response.json()

    return jsonData
}

//Gets the API key from localStorage
function getKey() {
    if (localStorage.jwt != undefined) {
        const jwt = localStorage.jwt
        const token = decodeToken(jwt)


        return token.key
    }
    else {
        return false
    }
}