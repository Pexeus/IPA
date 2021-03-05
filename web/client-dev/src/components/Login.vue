<!--   
    Path: web/client-dev/src/components/Login.vue
    Autor: Liam Benedetti
    Description: Is displayed when no user is logged in
-->

<template>
  <div class="loginWrapper">
    <div class="login">
      <h2>Login</h2>
      <div class="inputBox">
        <label for="name">Nutzername:</label>
        <input type="text" id="name" v-model="loginData.username">
      </div>
      <br>
      <div class="inputBox">
        <label for="password">Passwort:</label>
        <input type="password" id="password" v-model="loginData.password">
      </div>
      <div class="submit">
        <p class="loginError">{{loginData.status}}</p>
        <button @click="login()">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import {post} from "../fetch"

export default {
  name: 'Login',
  props: {
    msg: String
  },

  setup() {
    const loginData = reactive({
      username: "",
      password: "",
      status: ""
    })

    //request a Login from the server
    async function login() {
      const validation = await validate()
      if (validation == true) {
        const response = await post("/api/auth/login", loginData)

        if (response.status == true) {
          const token = response.token

          loginData.status = ""

          localStorage.setItem("jwt", token)
          location.reload()
        }
        else {
          loginData.status = response.message
        }
      }
    }

    //validate user inputs
    async function validate() {
      if (loginData.password != "" && loginData.username != "") {
        return true
      }
      else {
        alert("Bitte füllen Sie alle Felder aus!")
        return false
      }
    }

    return {loginData, login}
  }
}
</script>

<style scoped>
  .loginWrapper {
    width: 100%;
    height: 100vh;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    padding-left: 30px;
    padding-right: 30px;
    box-shadow: 0px 0px 3px var(--shadow);
  }

  .login h2 {
    color: var(--tf);
    margin-bottom: 20px;
    margin-top: 10px;
    border-left: 3px solid var(--tf);
    padding-left: 10px;
  }

  .login label {
    color: rgb(77, 77, 77);
    font-weight: bold;
  }

  .login input {
    border: 0;
    border-bottom: 2px solid var(--tf);
    background-color: rgba(77, 77, 77, 0.13);
    float: right;
    margin-left: 10px;
    padding: 5px;
    min-width: 250px;
  }

  .login input:focus {
    background-color: var(--tf50);
  }

  .submit {
    margin-top: 30px;
  }

  .submit button {
    border: 0;
    margin-top: 10px;
    background-color: var(--tf);
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    color: white;
    font-weight: bold;
    float: right;
    cursor: pointer;
    border-radius: 5px;
  }

  .submit button:hover {
    box-shadow: 0px 0px 3px var(--shadow);
  }

  .loginError {
    color: red;
  }
</style>
