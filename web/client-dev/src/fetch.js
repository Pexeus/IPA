import {host} from "./config"

export async function post(route, body) {
    let fetchOptions = {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body)
    }

    const response = await fetch(host + route, fetchOptions)
    const jsonData = await response.json()

    return jsonData
}

export async function get(route) {
    const response = await fetch(host + route)
    const jsonData = await response.json()

    return jsonData
}