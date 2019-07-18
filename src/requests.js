import {sha256} from "js-sha256"
import axios from "axios"

const ax = axios.create({
    baseURL: SERVICE_URL
})

/* Promises a login token on success, null on fail */
async function login(store, username, password) {
    const body = {
        "username": username,
        "password": hashPass(password)
    }

    const response = await request(store, "post", "/auth/login", body)
    if (!response) return null

    if (response.success) return response.token
    return null
}

async function checkToken(store) {
    const response = await request(store, "get", "/auth/check")
    if (!response) return {username: "", userHasAdmin: false}
    return response

}

const requests = {
    login,
    checkToken
}
export default requests

/* Utilities */

/*
Make a request to the API
*/
async function request(store, method, url, data = undefined) {
    const token = store.loginToken
    let headers = {}
    if (token) {
        headers = { "Authorization": "Bearer " + token }
    }

    try {
        const resp = await ax.request({ url, method, headers, data })
        return resp.data
    } catch (err) {
        if (store.loggedIn) {
            // user was "logged in"
            store.addFlashMessage("You have been logged out. Please log back in.", "warning")
            store.setLoginToken(null)
            store.setRedirectTo("/login")
        }

        if (err.response) {
            if (err.response.status !== 403) {
                // Unexpected response status, log it
                console.warn(
                    "Request error to " +
                    err.response.config.url +
                    ". Got status " + err.response.status +
                    ". Response body: \"" + JSON.stringify(err.response.data || "{}") + 
                    "\". Config used: \"" + JSON.stringify(err.response.config) + "\""
                )
            }
        } else {
            // unknown error, log it
            console.error("Caught unknown request error: " + err.message)
        }

        return null
    }
}

function hashPass(password) {
    return sha256(password)
}