const axios = require("axios");
const key = require("../key.json").key

function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, time * 1000);
    })
}

async function sampleData(numSets) {
    for(i = 0; i <= numSets; i++) {
        let event

        if (Math.random() > 0.5) {
            event = "enter"
        }
        else {
            event = "exit"
        }

        const set = {
            location: "raspberrypi",
            event: event,
            time: Date.now()
        }

        const response = await axios.post("/api/traffic/register", set)
        if (response.data == "ok") {
            console.log("Inserted set nr " + i);
        }
        else {
            console.log("error: failed to insert set");
        }
    }
}

async function simulateTraffic(max, freq, exitProbability) {
    let event
    const info = {
        inside: 0
    }
    for(i = 0; i <= max; i++) {
        if (Math.random() > exitProbability) {
            event = "enter"
            info.inside += 1
        }
        else {
            event = "exit"
            info.inside -= 1
        }

        const set = {
            location: "raspberrypi",
            event: event,
            time: Date.now()
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Auth": key
            }
        }

        const response = await axios.post("/api/traffic/register", set, config)
        if (response.data.status == "ok") {
            console.clear()
            console.log(`Personen im Raum: ${info.inside}`);
        }
        else {
            console.log("ERROR");
            console.log(response);
        }

        await sleep(freq * Math.random())
    }
}

//sampleData(10)

simulateTraffic(10000, 3, 0.5)