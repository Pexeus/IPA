<!--   
    Path: web/client-dev/src/components/Dashboard.vue
    Autor: Liam Benedetti
    Description: Main Component, controls Chart, Overview, Config and Stream
-->

<template>
    <div class="dashboardWrapper">
        <div class="dasboard">
            <Chart :chartData="data"></Chart>
            <Overview :overviewData="data" ></Overview>
            <Config :configData="data"></Config>
            <Stream :streamData="data"></Stream>
        </div>
    </div>
</template>

<script>
import { reactive, watch } from 'vue'
import {decodeToken} from "../jwt"
import SocketIO from "socket.io-client"
import {host} from "../config"

import Chart from "./Chart"
import Overview from './Overview'
import Config from "./Config"
import Stream from "./Stream"


export default {
    name: "Dashboard",
    components: {
        Chart,
        Overview,
        Config,
        Stream
    },
    props:{
        location: Object,
    },

    setup(props, context) {
        const data = reactive({
            location: {}
        })
        //connect to the websocket, using the Auth key
        const token = decodeToken(localStorage.jwt)
        const socket = SocketIO(host, {
            query: {
                key: token.key
            }
        });
        data.socket = socket

        //update the currently displayed location
        async function update() {
            data.location = props.location.ID
        }

        //watch the "props.location.ID" prop
        //on change, load the location with the given ID
        watch(() => props.location.ID, async () => {
            console.log("loading new location: " + props.location.ID);
            setTimeout(() => {
                update()
            }, 100);
        })

        return {data}
    }
}
</script>

<style scoped>
    .dashboardWrapper {
        width: 100%;
        height: 100%;
        margin-top: 50px;
        text-align: center;
        margin-bottom: 50px;
    }
</style>