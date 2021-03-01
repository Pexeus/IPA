const axios = require("axios")

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
    for(i = 0; i <= max; i++) {
        let event

        if (Math.random() > exitProbability) {
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
        console.log("simulated " +  event);

        await sleep(freq * Math.random())
    }
}

//sampleData(10)

simulateTraffic(10000, 1, 0.5)