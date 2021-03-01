<template>
    <div class="dashboardWrapper">
        <div class="dasboard">
            <Chart :chartData="data.chartData"></Chart>
            <Overview :overviewData="data.overviewData" ></Overview>
        </div>
    </div>
</template>

<script>
import { reactive, watch } from 'vue'
import {post, get} from "../fetch"
import {decodeToken} from "../jwt"
import Chart from "./Chart"
import Overview from './Overview.vue'
import {host} from "../config"
import SocketIO from "socket.io-client"

export default {
    name: "Dashboard",
    components: {
        Chart,
        Overview
    },
    props:{
        location: Object,
    },

    setup(props, context) {
        const data = reactive({
            chartData: {},
            overviewData: {}
        })

        const token = decodeToken(localStorage.jwt)

        const socket = SocketIO(host, {
            query: {
                key: token.key
            }
        });

        data.overviewData.socket = socket
        data.chartData.socket = socket

        async function update() {
            //const chartData = await get(`/api/traffic/current/${props.location.ID}/chart`)
            //const overviewData = await get(`/api/traffic/current/${props.location.ID}/compound`)

            data.chartData.location = props.location.ID
            data.overviewData.location = props.location.ID
        }

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
    }
</style>