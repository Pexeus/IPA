// Pfad: /cam/client/js/fetch.js
// Autor: Liam Benedetti
// Beschreibung: Übernimmt sämtliche Kommunikation mit dem Backend

// verbinde zum Websocket
const socket = io.connect("/")
// DOM, in das die Logs gerendert werden definieren
const logsContainer = vie.get("#logs")

// auf dem kanal "logs" hören
socket.on("logs", data => {
    // erstelle ein neues HTML Element "log" (typ param, id log, InnerHTML `[${data.type}] ${data.message}`)
    const log = vie.new("p", "#log", `[${data.type}] ${data.message}`)
    // log ins HTML einfügen
    logsContainer.appendChild(log)

    // automatisch zum unteren ende des HTML elements scrollen
    logsContainer.scrollTop = logsContainer.scrollHeight;
})

// konfiguration von server abrufen und in das HTML übernehmen
async function loadConfig() {
    // abrufen
    const config = await get("/getConfig")

    //keys des Objekts erhalten
    const keys = Object.keys(config)

    keys.forEach(key => {
        // 
        document.getElementById(key).value = config[key]
    })
}

async function updateConfig() {
    const config = await get("/getConfig")

    const keys = Object.keys(config)

    keys.forEach(key => {
        config[key] = document.getElementById(key).value
    })

    console.log(config);

    const response = await put("/setConfig", config)

    if (response.status == 200) {
        //alert("Stream wird mit neuer Konfiguration neugestartet. Dies kann einige Sekunden dauern.")
    }
    else {
        alert(response.status + " : " + response.statusText)
    }
}

loadConfig()