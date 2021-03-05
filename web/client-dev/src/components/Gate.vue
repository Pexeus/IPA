<template>
    <div class="gate" v-if="data.traffic != undefined">
        <div class="g-enter" v-if="data.traffic.inRoom < data.traffic.roomCapacity">
            <div class="info">
                <h1>Eintreten</h1>
            </div>
            <div class="amount">
                <h2>{{data.traffic.inRoom}}/{{data.traffic.roomCapacity}} Personen</h2>
            </div>
        </div>
        <div class="g-wait" v-if="data.traffic.inRoom >= data.traffic.roomCapacity">
            <div class="waitInfo">
                <h2>Geschätzte Wartezeit: {{data.analytics.prediction}} Minuten</h2>
            </div>
            <div class="info">
                <h1>Warten</h1>
            </div>
            <div class="amount">
                <h2>{{data.traffic.inRoom}}/{{data.traffic.roomCapacity}} Personen</h2>
            </div>
        </div>
        <p class="logout" @click="logout()">Logout</p>
    </div>
</template>

<script>
import { reactive, watch } from 'vue'
import SocketIO from "socket.io-client"
import {host} from "../config"
import {get} from "../fetch"
import {decodeToken} from "../jwt"

export default {
    name: "Gate",
    components: {
        
    },
    props: {
        location: Object
    },
    
    setup(props, components) {
        const data = reactive({})
        const token = decodeToken(localStorage.jwt)
        const socket = SocketIO(host, {
            query: {
                key: token.key
            }
        });

        function logout() {
            localStorage.removeItem("jwt")
            location.reload()
        }

        async function updateGate() {
            const traffic = await get(`/api/traffic/current/${props.location.ID}/compound`)
            const analytics = await get(`/api/traffic/analytics/${props.location.ID}`)

            console.log(analytics);
            console.log(traffic);
            data.analytics = analytics
            data.traffic = traffic

            setInterval(() => {
                if (data.traffic.inRoom >= data.traffic.roomCapacity) {
                    data.analytics.overflow = data.traffic.inRoom - data.traffic.roomCapacity + 1

                    data.analytics.waitTimeMinute = data.analytics.avgLeaveMinute * data.analytics.overflow
                    data.analytics.waitingTime = Math.round((Date.now() -  data.analytics.waitingSince) / 1000 / 60)

                    var prediction = Math.round(data.analytics.waitTimeMinute - data.analytics.waitingTime)

                    if (prediction < 0) {
                        prediction = "Wenige"
                    }

                    data.analytics.prediction = prediction
                }
            }, 1000);
        }

        socket.on("dataupdate", () => {
            updateGate()
        })

        watch(() => props.location.ID, async () => {
            console.log("loading location: " + props.location.ID);
            updateGate()
        })

        return {data, logout}
    }
}
</script>

<style scoped>
    .gate {
        width: 100%;
        height: 100vh;
    }

    .g-enter, .g-wait {
        width: 100%;
        height: 100%;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .info {
        background-color: white;
        border-radius: 5px;
        box-shadow: 0px 0px 3px var(--shadow);
        padding: 20px;
        margin: 50px;
    }

    .g-enter .info {
        color: var(--green);
    }

    .g-wait .info {
        color: var(--red);
    }

    .amount {
        font-size: 30pt;
        text-shadow: 0px 0px 3px var(--shadow);
    }

    .info h1 {
        font-size: 80pt;
    }

    .g-enter {
        background-color: var(--green);
    }

    .g-wait {
        background-color: var(--red);
    }

    .waitInfo {
        font-size: 22pt;
        text-align: center;
    }

    .waitInfo h2 {
        margin-bottom: 20px;
        text-shadow: 0px 0px 3px var(--shadow);
    }

    .logout {
        position: absolute;
        bottom: 0px;
        right: 0px;
        color: white;
        font-weight: bold;
        opacity: .7;
        padding: 10px;
        cursor: pointer;
    }

    .logout:hover {
        opacity: 1;
    }
</style>