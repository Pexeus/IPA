const express = require("express")
const db = require("../db/connection")

const router = express.Router()

router.get("/", (req, res) => {
    res.end("traffic service online")
})

router.post("/register", async (req, res) => {
    const event = req.body

    const locationInfo = await db("locations")
        .where({name: event.location})
        .first()
    
    if (locationInfo != undefined) {
        const dbQuery = {
            LID: locationInfo.LID,
            event: event.event,
            time: event.time
        }

        await db("traffic")
            .insert(dbQuery)
            .catch(err => {
                console.log(err);
            })
        
        req.io.sockets.emit("dataupdate")
    }

    res.status(200).json({status: "ok"})
})

router.get("/current/:LID/:format", async (req, res) => {
    const query = req.params

    const locationInfo = await db("locations")
        .where({LID: query.LID})
        .first()

    const traffic = await db("traffic")
        .where({
            LID: query.LID
        })
        .andWhere("time", ">", locationInfo.tcap)

    const analytics = analyse(query)

    const result = {
        location: locationInfo,
        traffic: traffic
    }

    res.status(200).json(formatData(query.format, result))
})

router.get("/all/:LID/:format", async (req, res) => {
    const query = req.params

    const locationInfo = await db("locations")
        .where({LID: query.LID})
        .first()

    const traffic = await db("traffic")
        .where({
            LID: query.LID
        })

    const result = {
        location: locationInfo,
        traffic: traffic
    }

    res.status(200).json(formatData(query.format, result))
})

function formatData(format, rawData) {
    if(format == "raw" || format == undefined) {
        return rawData
    }

    if (format == "chart") {
        return convertChart(rawData)
    }
    if (format == "compound") {
        return convertCompound(rawData)
    }
}

function analyse(query) {
    return new Promise(async resolve => {
        const traffic = await db("traffic")
        .where({
            LID: query.LID,
            event: "exit"
        })

        const eventTimes = []

        traffic.forEach(event => {
            eventTimes.push(event.time)
        })

        const avgWait = averageDelta(eventTimes.sort())
        const lastExit = eventTimes.sort()[0]

        const analytics = {
            avgWaitMinute: avgWait.minutes,
            avgWaitUnix: avgWait.unix,
            lastExit: lastExit
        }

        console.log(analytics);
    })
}

const averageDelta = ([x,...xs]) => {
    //dieses snippet wurde von https://stackoverflow.com/questions/40236191/how-can-i-compute-the-difference-between-array-values-then-average-them eingefügt
    const avg = xs.reduce(([acc, last], x) => [acc + (x - last), x],[0, x]) [0] / xs.length

    const avgMin = Math.round(avg / 100 / 60) / 10

    return {unix: Math.round(avg), minutes: avgMin}
}

function convertCompound(rawData) {
    const result = {
        roomCapacity: rawData.location.capacity,
        inRoom: 0,
        max: -Infinity,
        min: Infinity
    }

    rawData.traffic.forEach(set => {
        if (set.event == "enter") {
            result.inRoom++
        }
        if (set.event == "exit") {
            result.inRoom--
        }

        if (result.inRoom > result.max) {
            result.max = result.inRoom
        }
        if (result.inRoom < result.min) {
            result.min = result.inRoom
        }
    })

    return result
}

function convertChart(rawData) {
    const result = {
        roomCapacity: rawData.location.capacity,
        inRoom: 0,
        traffic: [],
        time: []
    }

    rawData.traffic.forEach(set => {
        if (set.event == "enter") {
            result.inRoom++
        }
        if (set.event == "exit") {
            result.inRoom--
        }

        result.traffic.push(result.inRoom)
        result.time.push(format_time(set.time))
    })

    return result
}

function format_time(s) {
    return new Date(s * 1e3).toISOString().slice(-13, -5);
}

module.exports = router