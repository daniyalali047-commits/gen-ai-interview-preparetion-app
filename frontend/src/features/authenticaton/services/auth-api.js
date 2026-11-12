import axios from 'axios'

// const instance = axios.create({
//     baseURL:'https://glowing-waddle-6vgj4v75xjxr2444x-3000.app.github.dev',
//     withCredentials:true
// })

export async function register({ username, email, password }) {
    const resp = await axios.post('https://glowing-waddle-6vgj4v75xjxr2444x-3000.app.github.dev/api/auth/register', {
        username, email, password
    }, {
        withCredentials: true
    })

    return resp.data
}

export async function login({ email, password }) {
    const resp = await axios.post('https://glowing-waddle-6vgj4v75xjxr2444x-3000.app.github.dev/api/auth/login', {
        email, password
    }, {
        withCredentials: true
    })

    return resp.data
}

export async function logout() {

    try {
        const resp = await axios.get('https://glowing-waddle-6vgj4v75xjxr2444x-3000.app.github.dev/api/auth/logout', {
            withCredentials:true
        })

        return resp.data

    } catch (error) {
        console.log(error);

    }
}

export async function getME() {
    try {
        const resp = await axios.get('https://glowing-waddle-6vgj4v75xjxr2444x-3000.app.github.dev/api/auth/get-me', {
            withCredentials: true
        })

        return resp.data
    } catch (error) {
        console.log(error)
        return null
    }
}