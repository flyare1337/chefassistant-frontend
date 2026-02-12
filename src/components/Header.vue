<template>
  <div class="header-overflow" @click="toggled = false" :class="{active:toggled}"></div>
<div class="header" :class="{shadow:scrolled}" v-if="auth.isAuth">
  <div class="header-container">
    <div class="header-space">
      <div class="header-column tglbtn">
        <button @click="toggled = !toggled" class="header-toggle-btn"><PhList :size="32" /></button>
      </div>
      <div class="header-column toggle" :class="{active:toggled}">
        <ul class="header-list">
          <!-- <li><button @click="toggled = false; $store.state.qrGenerated = true; $store.state.qrData = helpme; $store.commit('showPopup', {'value': 'qr_show'});" class="header-button"><PhQrCode :size="24" />TEST</button></li> -->
          <li><button @click="toggled = false; $store.commit('showPopup', {'value': 'qr_scan'});" class="header-button"><PhQrCode :size="24" />Сканировать код</button></li>
          <li><RouterLink to="/products" @click="toggled = false" class="header-button"><PhListDashes :size="24" />Список продуктов</RouterLink></li>
          <li><RouterLink to="/buy" @click="toggled = false" class="header-button"><PhBasket :size="24" />Список покупок</RouterLink></li>
          <li><RouterLink to="/analytics" @click="toggled = false" class="header-button"><PhChartLine :size="24" />Аналитика</RouterLink></li>
<!--          <li><button @click="toggled = false; $store.commit('showPopup', {'value': 'create_type'});" class="header-button"><PhPlus :size="24" /> Добавить</button></li>-->
        </ul>
        <ul class="header-list left" :class="{authed: auth.isAuth}">
          <li v-if="!auth.isAuth"><button @click="router.push('/'); toggled = false" class="header-button" style="font-weight: 400"><PhKey :size="24" />Войти</button></li>
          <li class="header-iconbtns">
            <button @click="toggled = false; $store.commit('showPopup', {'value': 'create_type'});" class="header-button header-iconbtns-btn"><PhPlus :size="24" /><span>Добавить тип</span></button>
            <RouterLink to="/notifications" @click="toggled = false;" class="header-button header-iconbtns-btn"><PhBell :size="24" /><span>Уведомления</span></RouterLink>
          </li>
          <li v-if="auth.isAuth"><div class="header-username"><PhUser :size="24" />{{ (auth.user.name.length <= 20) ? auth.user.name : auth.user.name.substring(0, 20).trimEnd() + '…' }}</div></li>
          <li v-if="auth.isAuth"><button @click="auth.logout(); toggled = false" class="header-button" style="font-weight: 400"><PhDoorOpen :size="24" />Выйти</button></li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import {
  PhBarcode,
  PhBasket,
  PhChartLine,
  PhKey,
  PhUser,
  PhDoorOpen,
  PhListDashes,
  PhQrCode,
  PhList,
  PhPlusCircle,
  PhPlus,
  PhNotification, PhBell
} from "@phosphor-icons/vue";
import {authStore} from "@/utils/auth";

import {onUnmounted, ref} from "vue";
import router from "@/router";

const helpme = '[-1,"2025-01-01T00:00:00","2025-02-01T00:00:00",-1,"Белый111",200,"г",166,"шт","",180,-1,"Хлеб222"]';

const auth = authStore()

let scrolled = ref(false);
let toggled = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 0;
}

const scrollInterval = setInterval(() => {
  handleScroll();
}, 20);

onUnmounted(() => {
  clearInterval(scrollInterval);
  toggled.value = false;
});
</script>

<style scoped lang="scss">
.header {
  background: var(--color-sub-background);
  padding: 5px 0;
  position: fixed;
  width: 100%;
  z-index: 1000;
  transition: 0.2s ease;


  &.shadow {
    box-shadow: 0 15px 15px rgb(0 0 0 / 7%);
  }

  &-container {
    margin: 0 auto;
    //max-width: 1320px;
    padding: 0 50px;

    @media (max-width: 1300px) {
      padding: 0 30px;
    }
  }

  &-space {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //justify-content: space-between;
  }

  &-iconbtns {
    display: flex;
    align-items: center;
    gap: 0 20px;

    & span {
      display: none;
    }

    @media (max-width: 1300px) {
      flex-direction: column;

      & span {
        display: block;
      }
    }
  }

  &-column {
    &.toggle {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  &-list {
    display: flex;
    align-items: center;
    list-style: none;
    gap: 0 40px;
    padding: 0;
    margin: 0;
  }

  &-button {
    padding: 15px 0;
    border-radius: 15px;
    transition: .1s ease-in;

    display: flex;
    align-items: center;
    gap: 0 10px;

    &:hover {
      opacity: .7;
    }
  }

  &-username {
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 10px;
    background: var(--color-table-background);
    border: 1px solid var(--color-main);
    border-radius: 15px;
    height: 40px;
  }

  &-toggle-btn {
    display: none;
  }
}

@media (max-width: 1300px) {
  .header {
    min-height: 54px;
    align-items: center;
    &-space {
      display: block;
    }

    &-toggle-btn {
      display: block;
      text-align: right;
      padding: 15px 0;
    }

    &-column.toggle {
      display: none;

      &.active {
        display: flex;
        flex-direction: column;
        cursor: pointer;
      }
    }

    &-column.tglbtn {
      display: flex;
      justify-content: right;
    }

    &-list {
      width: 100%;
      flex-direction: column;
      justify-content: left;
      align-items: start;

      &.left.authed {
        margin-top: 20px;
      }
    }

    &-username {
      padding: 15px 0;
      height: 100%;
      border: none;
      background: none;
    }

    &-overflow.active {
      position: fixed;
      width: 100vw;
      height: 100vh;
      z-index: 500;
      background: rgba(0, 0, 0, 0.4);
    }

    &-button, &-username {
      gap: 0 20px;
    }
  }
}

.modal {
  top: 10px;
  left: 10px;
  position: absolute;
  z-index: 1000;
  background-color: #fca952;
  width: 70%;
  height: 70%;
}

.centered {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>