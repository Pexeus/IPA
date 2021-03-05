<!--   
    Path: web/client-dev/src/components/Chart.vue
    Autor: Liam Benedetti
    Description: Chart component
-->

<template>
    <div class="chartWrapper">
         <canvas id="chart"></canvas>
         <div class="chartMenu">
             <select @change="updateChart()" name="setDataset" class="selector" id="setDataset">
                 <option value="current">Aktuelle Daten</option>
                 <option value="all">Alle Daten</option>
             </select>
         </div>
    </div>
</template>

<script>
import { watch } from 'vue'
import {Chart} from "chart.js"
import {get} from "../fetch"
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

        //on signal on channel "dataupdate", refetch data
        props.chartData.socket.on('dataupdate', () => {
            updateChart()
        })

        //initiate the chart
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

        //update the chart component
        async function updateChart() {
            const mode = document.getElementById("setDataset").value

            data.traffic = await get(`/api/traffic/${mode}/${props.chartData.location}/chart`)

            if (chart == undefined) {
                init()
            }
            else {
                update()
            }
        }

        //update the Chart
        function update() {
            const chartData = data.traffic

            chart.data.labels = chartData.time
            chart.data.datasets[0].data = chartData.traffic
            
            chart.update()
        }

        //on change of the "chartData.location" prop, update the chart
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

    .chartMenu {
        text-align: right;
        padding: 15px;
    }

    .chartMenu select {
        border: 0;
        padding: 5px;
        box-shadow: 0px 0px 3px var(--shadow);
        font-size: large;
        cursor: pointer;
    }

    .chartMenu select:hover {
        color: var(--tf);
    }
</style>