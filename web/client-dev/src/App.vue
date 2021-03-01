<template>
  <Login v-if="user.status == false"></Login>
  <Header></Header>
  <Dashboard :location="location"></Dashboard>
</template>

<script>
import { reactive } from 'vue'
import {decodeToken} from "./jwt"

import Login from './components/Login.vue'
import Header from "./components/Header"
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: {
    Login,
    Header,
    Dashboard
  },

  setup() {
    const user = reactive({status: false})
    const location = reactive({ID: null})

    function auth() {
      const token = decodeToken(localStorage.jwt)

      console.log(token);

      if (token.role != undefined) {
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
  }

  :root {
    --tf: #0082B4;
    --tf50: #0081b489;
    --shadow: rgb(67, 67, 67);
    --lgray: rgba(67, 67, 67, 0.476);
  }
</style>
