import axios from "axios";

const routes = {
    "/login": "/src/views/login.html",
    "/register": "/src/views/register.html",
    "/notFound": "/src/views/notFound.html",
    "/": "/src/views/home.html",
}

const apiURL = "http://localhost:3000"

export async function renderRouter() {
    const user = JSON.parse(localStorage.getItem("user"))
    const app = document.getElementById("app")
    const path = location.hash.replace("#", "") // /login, /, /register...
    
    const file = routes[path]
    if(!file){
        location.hash = "#/notFound"
        return
    }

    if (!user && path !== "/login") {
        location.hash = "#/login"
        return
    }
    if (user && (path === '/login' || path === '/register')) {
        location.hash = "#/"
        return
    }
    try {
        const route = await fetch(file)
        const content = await route.text()
        app.innerHTML = content

        if (path === '/login') {
            document.getElementById("loginForm").addEventListener("submit", async (event) => {
                event.preventDefault();
                const username = document.getElementById("username").value
                const password = document.getElementById("password").value
                if (!username || !password) {
                    alert("Usuario y contraseña son requeridos.");
                    return;
                }

                const resp = await axios.get(`${apiURL}/users?username=${username}&password=${password}`)
                const data = await resp.data

                if (data.length === 0) {
                    alert("crendenciales invalidas.");
                    return;
                }

                localStorage.setItem("user", JSON.stringify(data[0]));
                location.hash = "/";
            })
        }
        if (path === '/register') {
            document.getElementById("registerForm").addEventListener("submit", async (event) => {
                event.preventDefault();
                const username = document.getElementById("username").value
                const password = document.getElementById("password").value
                const name = document.getElementById("name").value
                const lastname = document.getElementById("lastname").value
                const email = document.getElementById("email").value

                if (!username || !password || !name || !lastname || !email) {
                    alert("Todos los campos son requeridos.");
                    return;
                }

                const params = {
                    "username": username,
                    "password": password,
                    "name": name,
                    "lastname": lastname,
                    "email": email,
                    "role": "user",
                }

                const resp = await axios.post(`${apiURL}/users`, params)

                if (resp) {
                    location.hash = "/login";
                }
            })
        }
        if (path === '/') {
            const saludoContainer = document.getElementById("saludo")
            const container = document.getElementById("container")
            if (user.role === "admin") {
                saludoContainer.innerText = `Bienvenido de nuevo ${user.name} ${user.lastname}`
                const response = await axios.get(`${apiURL}/tasks`)
                const data = await response.data

                container.innerText = data
            } else {
                saludoContainer.innerText = `Hola ${user.name} ${user.lastname}`
                const response = await axios.get(`${apiURL}/tasks?user_id=${user.id}`)
                const data = await response.data

                container.innerText = data
            }
        }
    } catch (error) {
        console.log(error);

        app.innerHTML = `<h2>No se pudo cargar la vista</h2>`
    }
}