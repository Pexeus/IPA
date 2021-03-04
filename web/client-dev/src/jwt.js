export function decodeToken(token) {
    let payload = token.replace(/-/g, '+').replace(/_/g, '/').split('.')[1]
    payload = JSON.parse(Buffer.from(payload, 'base64').toString())
    return payload
}