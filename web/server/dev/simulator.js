const axios = require("axios")

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

sampleData(10)