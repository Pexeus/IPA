<template>
    <div class="previewWrapper">
        <div class="preview">
            <img id="display" alt="cannot reach stream">
            <div class="overlay">
                <p>FPS: {{stats.FPS}}</p>
                <p>Res: {{stats.resX}} x {{stats.resY}}px</p>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, watch } from 'vue'
import {post, get} from "../fetch"

export default {
    name: "Stream",
    components: {

    },
    props: {
        streamData: Object
    },
    setup(props, context) {
        var display = document.getElementById("display")

        const stats = reactive({
            frames: 0,
            FPS: 0,
            seconds: 0,
            resX: 0,
            resY: 0
        })

        async function updatePreview() {
            const dataset = await get(`/api/locations/info/${props.streamData.location}`)

            const channel = `video_${dataset.name}`
            initStreamStats()
            
            props.streamData.socket.on(channel, data => {
                renderFrame(data)
            })
        }

        function renderFrame(frame) {
            stats.frames += 1

            if (display != null) {
                display.src = `data:image/jpeg;base64, ${frame}`
            }
            else {
                display = document.getElementById("display")
            }
        }

        function initStreamStats() {
            if (display == null) {
                display = document.getElementById("display")
            }
            setInterval(() => {
                stats.seconds += 0.25

                stats.FPS = Math.round(stats.frames / stats.seconds)
                stats.resX = display.naturalWidth
                stats.resY = display.naturalHeight

                if (stats.seconds > 5) {
                    stats.frames = 0
                    stats.seconds = 0
                }
            }, 250);
        }

        watch(() => props.streamData.location, async () => {
            updatePreview()
        })

        return {stats}
    }
}
</script>

<style scoped>
    .previewWrapper {
        width: 100%;
        text-align: center;
    }

    .preview {
        display: inline-block;
        margin: 5px;
        width: calc(100% - 10px);
        max-width: 1010px;
        border-radius: 5px;
        position: relative;
    }

    #display {
        width: 100%;
        border-radius: 5px;
        box-shadow: 0px 0px 3px var(--shadow);
        z-index: 0;
    }

    .overlay {
        position: absolute;
        top: 10px;
        left: 10px;
        font-family: monospace;
        font-weight: bolder;
        font-size: 12pt;
        text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
        color: white;
        text-align: left;
    }
</style>