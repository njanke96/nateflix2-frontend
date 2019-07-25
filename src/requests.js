import {sha256} from "js-sha256"
import axios from "axios"

const ax = axios.create({
    baseURL: SERVICE_URL
})

/* Promises a login token on success, null on fail */
async function login(store, username, password) {
    const body = {
        "username": username,
        "password": password
    }

    const response = await request(store, "post", "/auth/login", body)
    if (!response) return null

    if (response.success) return response.token
    return null
}

/* Returns {username, userHasAdmin} */
async function checkToken(store) {
    const response = await request(store, "get", "/auth/check")
    if (!response) return {username: "", userHasAdmin: false}
    return response
}

/* Returns Success bool */
async function register(store, username, password) {
    const response = await request(store, "post", "/auth/register", {
        username,
        password
    })
    if (!response) return false
    return response.success
}

/* Returns success bool */
async function recoverPassword(store, email, url) {
    const body = {
        email,
        url
    }
    const response = await request(store, "post", "auth/resetpassword", body)
    if (!response) return false
    return response.success
}

/* Returns success bool */
async function resetPassword(store, resetToken, newPassword) {
    const body = {resetToken, newPassword: newPassword}
    const response = await request(store, "patch", "auth/resetpassword", body)
    if (!response) return false
    return response.success
}

/* returns true if completed false if not completed null if failed */
async function getCompletedRegistration(store) {
    const url = "users/" + store.loginUsername + "/completeregistration" 
    const response = await request(store, "get", url)
    if (!response) return null
    return response.completed
}

/* returns success bool */
async function completeRegistration(store, email, newpassword) {
    const url = "users/" + store.loginUsername + "/completeregistration"
    const response = await request(store, "post", url, {
        email,
        newpassword: newpassword
    })
    if (!response) return false
    return response.success
}

/* returns user object or null */
async function getUser(store, username) {
    const response = await request(store, "get", `/users/${username}`)
    if (!response) return null
    return response
}

/* Returns success bool */
async function postUser(store, username, newUser) {
    const response = await request(store, "post", `/users/${username}`, newUser)
    if (!response) return false
    return response.success
}

/* Returns success bool */
async function deleteUser(store, username) {
    const response = await request(store, "delete", `/users/${username}`)
    if (!response) return false
    return response.success
}

/* Returns array of user documents */
async function getAllUsers(store) {
    const response = await request(store, "get", "/users")
    if (!response) return []
    return response
}

const requests = {
    login,
    checkToken,
    register,
    recoverPassword,
    resetPassword,
    getCompletedRegistration,
    completeRegistration,
    getUser,
    postUser,
    deleteUser,
    getAllUsers
}
export default requests

/* Utilities */

/*
Make a request to the API, returns null on fail
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
            } else {
                // 403 error, assume expired token
                if (store.loggedIn) {
                    // user was "logged in"
                    store.addFlashMessage("You have been logged out. Please log back in.", "warning")
                    store.setLoginToken(null)
                    store.setRedirectTo("/login")
                }
            }
        } else {
            // unknown error, log it
            console.error("Caught unknown request error: " + err.message)
        }

        return null
    }
}
