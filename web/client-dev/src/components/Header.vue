<template>
    <div class="header">
        <h2 class="title">IPA 2021</h2>
        <div class="userPanel">
            <p>{{userInfo.name}} | {{userInfo.role}}</p>
            <button @click="logout()">Logout</button>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue'
import {decodeToken} from "../jwt"
export default {
    name: "Header",
    components: {

    },
    setup() {
        const userInfo = reactive(decodeToken(localStorage.jwt))
        function logout() {
            localStorage.removeItem("jwt")
            location.reload()
        }
        return {userInfo, logout}
    }
}
</script>

<style scoped>
    .header {
        display: flex;
        justify-content: space-between;
        background-color: var(--tf);
        height: 50px;
        align-items: center;
        box-shadow: 0px 0px 3px var(--shadow);
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        padding-right: 50px;
        color: white;
        z-index: 10;
    }

    .header div, h2 {
        padding-left: 20px;
        padding-right: 20px;
    }

    .userPanel {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .userPanel button {
        transition: all ease-in-out .2s;
        border: 2px solid white;
        background-color: var(--tf);
        border-radius: 5px;
        padding-top: 5px;
        padding-bottom: 5px;
        font-weight: 600;
        color: var(--tf);
        background-color: white;
        cursor: pointer;
    }
    
    .userPanel button:hover {
        border: 2px solid white;
        background-color: var(--tf);
        color: white;
    }

    .userPanel * {
        padding-left: 10px;
        padding-right: 10px;
    }
</style>