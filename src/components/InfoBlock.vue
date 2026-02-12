<script setup lang="ts">
import { ref } from 'vue'
import { APIRequest } from "@/utils/http";
import { authStore } from "@/utils/auth";

const auth = authStore()

import router from "@/router";


let reg = ref( false )
import {
  PhBarcode,
  PhChartLine,
  PhCheck,
  PhKey,
  PhShoppingCartSimple,
  PhDoor,
  PhPlusCircle,
  PhPlus,
  PhArrowCircleLeft, PhXCircle
} from "@phosphor-icons/vue";
let login = ref( '' )
let password = ref( '' )

let registerData = ref({
  name: '',
  password: '',
  login: '',
  secret: ''
})

let errorLogin = ref( '' )
let errorReg = ref( '' )

let authData = ref()

async function submitAuth() {
  const data = await APIRequest('/auth/login', 'GET', {
    login: login.value,
    password: password.value
  });

  if (data.status === 200) {
    window.localStorage.setItem('authToken', data.json.token)
    await auth.prepareStore()
    // await router.push("/")

  } else {
    errorLogin.value = data.json.detail.error
  }
}

async function submitReg() {
  const data = await APIRequest('/auth/register', 'POST', {}, {
    name: registerData.value.name,
    password: registerData.value.password,
    login: registerData.value.login,
    secret: registerData.value.secret
  });

  if (data.status === 200) {
    window.localStorage.setItem('authToken', data.json.token)
    await auth.prepareStore()
  } else {
    errorReg.value = data.json.detail.error
    console.log(data.json)
  }
}

</script>

<template>
  <div class="d">
    <div class="container">
      <div class="info">
        <div class="info-wrapper">
          <div class="info-card">
            <div v-if="auth.isAuth">
              <PhCheck :size="72" />
              <div class="info-card-name">Chef Assistant System</div>
              <div class="info-card-title">{{ auth.user.name }}, Вы успешно вошли в аккаунт!</div>
            </div>
            <div v-if="!auth.isAuth && !reg">
              <PhKey :size="72" />
              <div class="info-card-name">Chef Assistant System</div>
              <div class="info-card-title">Требуется войти в аккаунт</div>
              <form class="info-card-login" @submit.prevent="submitAuth">
                <div class="info-card-login-part">
                  <div class="info-card-login-text">Логин</div>
                  <input type="text" class="info-card-login-input" placeholder="Введите логин ..." v-model="login">
                </div>
                <div class="info-card-login-part">
                  <div class="info-card-login-text">Пароль</div>
                  <input class="info-card-login-input" placeholder="Введите пароль ..." type="password" v-model="password">
                </div>
                <div class="info-card-error" v-if="(!auth.isAuth || !reg) && errorLogin.length > 0">
                  <PhXCircle :size="24" />
                  {{ errorLogin }}
                </div>
                <div class="info-card-login-part">
                  <button type="submit" class="info-card-button info-card-button-login" style="font-weight: 600"><PhKey :size="24" />Войти</button>
                  <button @click="reg = true"  class="info-card-button reg"><PhPlusCircle :size="20" />Зарегистрироваться</button>
                </div>
              </form>
            </div>
            <div v-if="!auth.isAuth && reg">
              <PhPlusCircle :size="72" />
              <div class="info-card-name">Chef Assistant System</div>
              <div class="info-card-title">Зарегистрировать аккаунт</div>
              <form class="info-card-login" @submit.prevent="submitReg">
                <div class="info-card-login-part">
                  <div class="info-card-login-text">Имя</div>
                  <input type="text" class="info-card-login-input" placeholder="Введите имя ..." v-model="registerData.name">
                </div>
                <div class="info-card-login-part">
                  <div class="info-card-login-text">Логин</div>
                  <input type="text" class="info-card-login-input" placeholder="Придумайте логин ..." v-model="registerData.login">
                </div>
                <div class="info-card-login-part">
                  <div class="info-card-login-text">Пароль</div>
                  <input class="info-card-login-input" placeholder="Введите пароль ..." type="password" v-model="registerData.password">
                </div>
                <div class="info-card-login-part">
                  <div class="info-card-login-text">Пароль от администратора</div>
                  <input type="text" class="info-card-login-input" placeholder="Должен быть выдан" v-model="registerData.secret">
                </div>
                <div class="info-card-error" v-if="(!auth.isAuth || !reg) && errorReg.length > 0">
                  <PhXCircle :size="24" />
                  {{ errorReg }}
                </div>
                <div class="info-card-login-part">
                  <button @click="reg = false" class="info-card-button reg"><PhArrowCircleLeft :size="20" />Вернуться назад</button>
                  <button type="submit" class="info-card-button info-card-button-login" style="font-weight: 600"><PhPlusCircle :size="24" />Зарегистрироваться</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info {
  display: flex;
  min-height: calc(100vh - 84px);
  align-items: center;
  justify-content: center;

  &.authed {
    align-items: start;
    height: auto;
  }

  &-wrapper {
    width: 100%;
  }

  &-card {
    padding: 25px;
    //background-color: rgba(255, 189, 136, 0.1);
    //border: 1px solid #FFBD88;
    border-radius: 15px;
    text-align: center;
    width: 600px;
    margin: 0 auto;


    @media (max-width: 700px) {
      width: 100%;
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 4px;
      margin-bottom: 20px;
    }

    &-name {
      font-size: 0.7rem;
      margin-top: 16px;
      text-transform: uppercase;
      font-weight: 600;
      color: #888888;
    }

    &-buttons {
      margin-top: 16px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;

      @media (max-width: 670px) {
        display: flex;
        flex-direction: column;
      }
    }

    &-button, &-button-login {
      width: 100%;
      text-align: center;
      padding: 15px 25px;
      border-radius: 15px;
      transition: .1s ease-in;
      justify-content: center;
      background-color: #ffcda6;
      border: 1px solid #FFBD88;
      display: flex;
      align-items: center;
      gap: 0 15px;

      &-login {
        //margin-top: 10px;
        background-color: #fcc697 !important;
        border: 1px solid #fd9a2f;
      }

      &:hover {
        opacity: .8;
      }

      &.reg {
        margin: 10px 0;
        font-size: 0.9rem;
        padding: 7px 25px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.4);
        border: 1px solid rgba(183, 183, 183);
      }
    }

    &-login {
      display: flex;
      flex-direction: column;
      gap: 30px 0;

      &-text {
        font-weight: 400;
        text-align: left;
      }

      &-input {
        margin-top: 8px;
        width: 100% !important;
        background: #f3ceac;
        border: 1px solid #ffbd73;
        padding: 10px 20px;
        font-weight: 200;
        border-radius: 0.5rem;
        outline: 0;
        transition:
            border,
            background 0.25s ease;

        &:hover {
          border: 1px solid #fca952;
        }

        &:focus {
          border: 1px solid #fd9a2f;
          background: #fcc697;
        }
      }
    }

    &-error {
      color: #ff0000;
      display: flex;
      align-items: center;
      gap: 0 10px;
    }
  }
}
</style>