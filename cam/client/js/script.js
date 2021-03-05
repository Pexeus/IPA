// Pfad: /cam/client/js/fetch.js
// Autor: Liam Benedetti
// Beschreibung: Übernimmt sämtliche Kommunikation mit dem Backend

// connect to the websocket that has the same IP as the host for the static files
const socket = io.connect("/")
// get the DOM to put the logs in
const logsContainer = vie.get("#logs")

// listen for data on Channel "logs"
socket.on("logs", data => {
    // Create a new log HTML Object using vie.js
    const log = vie.new("p", "#log", `[${data.type}] ${data.message}`)
    // Append the data to the log container
    logsContainer.appendChild(log)

    // Scroll to the Bottom of the logs Container
    logsContainer.scrollTop = logsContainer.scrollHeight;
})

// request the current configuration from the server and load it into the DOM
async function loadConfig() {
    // request config
    const config = await get("/getConfig")

    // get the keys of the config
    const keys = Object.keys(config)

    keys.forEach(key => {
        // for each key, get the element with the same ID as the key
        // the insert the value into it
        document.getElementById(key).value = config[key]
    })
}

// reads the Values from the input fields and forms an object
async function updateConfig() {
    // request the current config
    const config = await get("/getConfig")

    // get the keys of the config
    const keys = Object.keys(config)

    // for each key in the current config, get the assigned HTML input value and replace the current value with it
    keys.forEach(key => {
        config[key] = document.getElementById(key).value
    })

    console.log(config);

    // send the edited config to the server
    const response = await put("/setConfig", config)

    // notify the user
    if (response.status == 200) {
        alert("Stream wird mit neuer Konfiguration neugestartet. Dies kann einige Sekunden dauern.")
    }
    else {
        alert(response.status + " : " + response.statusText)
    }
}

loadConfig()