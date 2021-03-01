<template>
  <div class="loginWrapper">
    <div class="login">
      <h1>Login</h1>
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="loginData.username">
      <label for="password">Passwort:</label>
      <input type="password" id="password" v-model="loginData.password">
      <button @click="login()">Login</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import {post} from "../fetch"

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  setup() {
    const loginData = reactive({
      username: "",
      password: "",
      status: ""
    })

    async function login() {
      const response = await post("/api/auth/login", loginData)
      console.log(response);
    }

    return {loginData, login}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
