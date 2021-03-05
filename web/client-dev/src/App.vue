<!--   
    Path: web/client-dev/src/App.vue
    Autor: Liam Benedetti
    Description: Main Component, controls Chart, Overview, Config and Stream
-->

<template>
  <Login v-if="user.status == false"></Login>
  <Header v-if="user.status == `admin`"></Header>
  <Dashboard v-if="user.status == `admin`" :location="location"></Dashboard>
  <Gate v-if="user.status == `gate`" :location="location"></Gate>
</template>

<script>
import { reactive } from 'vue'
import {decodeToken} from "./jwt"

import Login from './components/Login.vue'
import Header from "./components/Header"
import Dashboard from './components/Dashboard.vue'
import Gate from "./components/Gate"

export default {
  name: 'App',
  components: {
    Login,
    Header,
    Dashboard,
    Gate
  },

  setup() {
    const user = reactive({status: false})
    const location = reactive({ID: null})

    //try to authenticate the user over Localstorage
    function auth() {
      const tokenRaw = localStorage.jwt
      if (tokenRaw == undefined) {
        console.log("no user logged in");
      }
      else {
        const token = decodeToken(tokenRaw)

        console.log("logged in as " + token.role);
        user.status = token.role

        //vorübergehnde code
        setTimeout(() => {
          location.ID = 1
        }, 100);
      }
    }

    auth()
    return {user, location}
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  * {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    outline: none;
    transition: all ease-in-out .3s;
  }

  :root {
    --tf: #0082B4;
    --tf50: #0081b489;
    --shadow: rgb(67, 67, 67);
    --lgray: rgba(67, 67, 67, 0.476);
    --red: #fa1e0e;
    --green: #61b15a;
  }
</style>
