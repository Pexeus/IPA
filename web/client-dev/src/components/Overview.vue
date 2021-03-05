<!--   
    Path: web/client-dev/src/components/Overview.vue
    Autor: Liam Benedetti
    Description: Dispays traffic data in a overview
-->

<template>
    <div class="overview">
        <div class="box-ok" v-if="data.compound.inRoom <= data.compound.roomCapacity">
            <p>Auslastung:</p>
            <p>{{data.compound.inRoom}}/{{data.compound.roomCapacity}}</p>
        </div>
        <div class="box-warn" v-if="data.compound.inRoom > data.compound.roomCapacity">
            <p>Auslastung:</p>
            <p>{{data.compound.inRoom}}/{{data.compound.roomCapacity}}</p>
        </div>

        <div class="box-ok" v-if="data.compound.max <= data.compound.roomCapacity">
            <p>Spitzenauslastung:</p>
            <p>{{data.compound.max}}/{{data.compound.roomCapacity}}</p>
        </div>
        <div class="box-warn" v-if="data.compound.max > data.compound.roomCapacity">
            <p>Spitzenauslastung:</p>
            <p>{{data.compound.max}}/{{data.compound.roomCapacity}}</p>
        </div>
    </div>
</template>


<script>
import {post, get} from "../fetch"
import {decodeToken} from "../jwt"
import { reactive, watch } from 'vue'

export default {
    name: "Overview",
    components: {

    },
    props: {
        overviewData: Object
    },

    setup(props, context) {
        const data = reactive({compound: ""})

        //listen on the "dataupdate" socket
        //on signal, update the component
        props.overviewData.socket.on("dataupdate", () => {
            updateOverview()
        })

        //refetch all data and update the component
        async function updateOverview() {
            const dataset = await get(`/api/traffic/current/${props.overviewData.location}/compound`)

            data.compound = dataset
        }
        
        //watch the "props.overviewData.location" prop
        //on change, load the location with the given ID
        watch(() => props.overviewData.location, async () => {
            updateOverview()
        })

        return {data}
    }
}
</script>

<style scoped>
    .overview {
        display: inline-block;
        margin: 5px;
        padding: 5px;
        box-shadow: 0px 0px 3px var(--shadow);
        width: calc(100% - 20px);
        max-width: 1000px;
        border-radius: 5px;
    }

    .overview div {
        display: inline-block;
    }

    .box-ok {
        color: green;
        background-color: rgba(0, 255, 17, 0.249);
        border-radius: 5px;
        margin: 10px;
        padding: 20px;
        text-align: center;
    }

    .box-ok p {
        font-weight: 900;
        font-size: 18pt;
    }

    .box-warn {
        color: red;
        background-color: rgba(255, 0, 0, 0.249);
        border-radius: 5px;
        margin: 10px;
        padding: 20px;
        text-align: center;
    }

    .box-warn p {
        font-weight: 900;
        font-size: 18pt;
    }
</style>