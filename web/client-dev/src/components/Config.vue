<template>
    <div class="configCenterer">
        <div class="configWrapper">
            <div class="config">
                <h2>Konfiguration</h2>
                <label for="inputCapacity">Kapazität </label>
                <input type="number" id="inputCapacity" v-model="data.config.capacity">
                <br>
                <div class="i-compound">
                    <p>Zähle Personen seit: {{data.config.dateFormatted}}</p>
                    <button class="btn-warn" @click="resetTime()">Zurücksetzen</button>
                </div>
                <br>
                <div class="submit">
                    <button class="btn-submit" @click="saveConfig()">Speichern</button>
                    <button class="btn-warn" @click="updateConfig()">Abbruch</button>
                </div>
            </div>
            <div class="cor">
                <h2>Korrektur</h2>
                <p>Personenanzahl korrigieren</p>
                <button class="btn-plus" @click="corCounter(`enter`)">+</button>
                <button class="btn-minus" @click="corCounter(`exit`)">-</button>
                <br>
        </div>
    </div>
    </div>
</template>

<script>
import { reactive, watch } from 'vue'
import { get, post } from '../fetch'

export default {
    name: "Overview",
    components: {

    },
    props: {
        configData: Object
    },

    setup(props, context) {
        const data = reactive({config: {}})

        async function saveConfig() {
            const newConfig = data.config

            const regex = /^\d+$/;

            if (regex.test(newConfig.capacity)) {
                const response = await post("/api/locations/update", newConfig)
                if (response.status != true) {
                    alert(response.message)
                }
            }
            else {
                alert(`Im Feld "Kapazität" dürfen nur Zahlen eingetragen werden!`)
            }
        }

        async function corCounter(eventType) {
            const event = {
                time: Date.now(),
                event: eventType,
                location: data.config.name
            }

            await post("/api/traffic/register", event)
        }

        async function updateConfig() {
            const dataset = await get(`/api/locations/info/${props.configData.location}`)
            data.config = dataset

            data.config.dateFormatted = convertDate(data.config.tcap)
        }

        function resetTime() {
            const currentTime = Date.now()

            data.config.tcap = currentTime
            data.config.dateFormatted = convertDate(currentTime)
        }

        function convertDate(unix) {
            let date = new Date(unix);

            const year = date.getFullYear()
            const month = ('0' + (date.getMonth() + 1)).slice(-2)
            const day = ('0' + date.getDate()).slice(-2)
            const hours = ('0' + date.getHours()).slice(-2)
            const minutes = ('0' + date.getMinutes()).slice(-2)

            const dateFormatted = `${day}.${month}.${year}, ${hours}:${minutes}`

            return dateFormatted
        }


        watch(() => props.configData.location, async () => {
            updateConfig()
        })

        return {data, resetTime, saveConfig, corCounter, updateConfig}
    }
}
</script>

<style scoped>
    .configCenterer {
        width: 100%;
    }

    .configWrapper {
        display: inline-block;
        margin: 5px;
        padding: 10px;
        box-shadow: 0px 0px 3px var(--shadow);
        width: calc(100% - 30px);
        max-width: 990px;
        border-radius: 5px;
        text-align: left;
    }

    .configWrapper .config, .cor {
        display: inline-block;
        vertical-align: top;
        text-align: left;
        padding-left: 20px;
        padding-right: 20px;
        border-left: 3px solid var(--tf);
    }

    .i-compound p, button {
        display: inline-block;
    }

    .i-compound p {
        margin-right: 5px;
    }

    .cor button {
        width: 50px;
        height: 50px;
        border: 0;
        border-radius: 5px;
        margin-right: 10px;
        margin-top: 10px;
        font-size: 20pt;
        font-weight: bold;
        color: white;
        cursor: pointer;
    }

    .btn-minus {
        background-color: var(--tf);
    }

    .btn-plus {
        background-color: rgba(0, 255, 17, 0.664);
    }

    button:hover {
        box-shadow: 0px 0px 3px var(--shadow);
    }

    .btn-submit {
        border: 0;
        margin-top: 10px;
        background-color: var(--tf);
        padding: 10px;
        padding-left: 20px;
        padding-right: 20px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
    }

    .btn-warn {
        border: 0;
        margin-top: 10px;
        background-color: orange;
        padding: 10px;
        padding-left: 20px;
        padding-right: 20px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
    }

    .submit {
        margin-top: 30px;
    }

    .submit button {
        float: right;
        margin-left: 5px;
    }

    .configWrapper h2 {
        margin-bottom: 5px;
        margin-top: 10px;
        color: var(--tf);
    }
</style>