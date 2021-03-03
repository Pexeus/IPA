<template>
    <div class="gate" v-if="data.current != undefined">
        <div class="g-enter" v-if="data.current.inRoom < data.current.roomCapacity">
            <div class="info">
                <h1>Eintreten</h1>
            </div>
            <div class="amount">
                <h2>{{data.current.inRoom}}/{{data.current.roomCapacity}} Personen</h2>
            </div>
        </div>
        <div class="g-wait" v-if="data.current.inRoom >= data.current.roomCapacity">
            <div class="info">
                <h1>Warten</h1>
            </div>
            <div class="amount">
                <h2>{{data.current.inRoom}}/{{data.current.roomCapacity}} Personen</h2>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, watch } from 'vue'
import SocketIO from "socket.io-client"
import {host} from "../config"
import {post, get} from "../fetch"
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
        async function updateGate() {
            const dataset = await get(`/api/traffic/current/${props.location.ID}/compound`)
            data.current = dataset
        }

        socket.on("dataupdate", () => {
            updateGate()
        })

        watch(() => props.location.ID, async () => {
            console.log("loading location: " + props.location.ID);
            updateGate()
        })

        return {data}
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
        margin: 30px;
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
</style>