//Path: web/client-dev/src/config.js
//Autor: Liam Benedetti
//Description: Manages WebTokens

//decodes the token saved in LocalStorage and returns it as a Object
export function decodeToken(token) {
    let payload = token.replace(/-/g, '+').replace(/_/g, '/').split('.')[1]
    payload = JSON.parse(Buffer.from(payload, 'base64').toString())
    return payload
}