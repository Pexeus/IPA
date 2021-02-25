const socket = io.connect("/")
const logsContainer = vie.get("#logs")

socket.on("logs", data => {
    console.log(data);

    const log = vie.new("p", "#log", `[${data.type}] ${data.message}`)
    logsContainer.appendChild(log)

    logsContainer.scrollTop = logsContainer.scrollHeight;
})

async function loadConfig() {
    const config = await get("/getConfig")

    const keys = Object.keys(config)

    keys.forEach(key => {
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