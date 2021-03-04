import {host} from "./config"
import {decodeToken} from "./jwt"

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