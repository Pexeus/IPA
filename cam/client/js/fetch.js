const host = ""

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

async function get(route) {
    return new Promise(async resolve => {
        const response = await fetch(host + route)
        const jsonData = await response.json()

        resolve(jsonData)
    })
}