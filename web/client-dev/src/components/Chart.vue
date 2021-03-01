<template>
    <div class="chartWrapper">
         <canvas id="chart"></canvas>
         <div class="chartMenu">
             <select name="setDataset" class="selector">
                 <option @click="updateChart()" value="current">Aktuelle Daten</option>
                 <option @click="updateChart()" value="all">Alle Daten</option>
             </select>
         </div>
    </div>
</template>

<script>
import { onUpdated, reactive, watch } from 'vue'
import {Chart} from "chart.js"
import SocketIO from "socket.io-client"
import {post, get} from "../fetch"
import {host} from "../config"
import {decodeToken} from "../jwt"

export default {
    name: "Chart",
    components: {

    },
    props: {
        chartData: Object
    },

    setup(props, context) {
        const data = {}
        var chart = undefined
        const token = decodeToken(localStorage.jwt)

        props.chartData.socket.on('dataupdate', () => updateChart())

        function init() {
            const ctx = document.getElementById("chart")
            const chartData = data.traffic

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: chartData.time,
                    datasets: [
                        {
                            label: "anzahl personen",
                            data: chartData.traffic,
                            fill: false,
                            borderColor: '#125465'
                        },
                    ]
                },
                options: {
                    
                }
            })

            chart.update()
        }

        async function updateChart() {
            data.traffic = await get(`/api/traffic/current/${props.chartData.location}/chart`)

            if (chart == undefined) {
                init()
            }
            else {
                update()
            }
        }

        function update() {
            const chartData = data.traffic

            chart.data.labels = chartData.time
            chart.data.datasets[0].data = chartData.traffic
            
            chart.update()
        }



        watch(() => props.chartData.location, async () => {
            updateChart()
        })

        return {data, updateChart}
    }
}
</script>

<style scoped>
    .chartWrapper {
        display: inline-block;
        margin: 5px;
        padding: 5px;
        box-shadow: 0px 0px 3px var(--shadow);
        width: calc(100% - 20px);
        max-width: 1000px;
        border-radius: 5px;
    }
</style>