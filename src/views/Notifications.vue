<script setup lang="ts">
import {authStore} from "@/utils/auth.ts";
import router from "@/router";
import {onBeforeMount, type Ref, ref} from "vue";
import {APIRequest} from "@/utils/http.ts";
import type {CategoriesData, TypesData} from "@/utils/types.ts";

const auth = authStore()

let notifications_expired = ref({})
let notifications_expiresToday = ref({})
let types_orig: Ref<TypesData | null> = ref(null)
let types: Ref<TypesData | null> = ref(null)
let cats: Ref<CategoriesData | null> = ref(null)


onBeforeMount(async () => {
  if (!auth.isAuth) {
    await router.push("/")
  } else {
    await loadNotifications()
    console.log(notifications_expiresToday.value)
  }
})

async function loadNotifications() {
  const data = await APIRequest('/notifications/get', 'GET', {}, {}, true)

  if (data.status === 200) {
    notifications_expired.value = data.json['expired']
    notifications_expiresToday.value = data.json['expires_today']
    const cData = await APIRequest('/product_categories/all', "GET", {}, {}, true)
    if (cData.status === 200) {
      cats.value = cData.json
    }

    const pData = await APIRequest('/product_types/all', "GET", {}, {}, true)
    if (pData.status === 200) {
      types_orig.value = pData.json

      for (let [k, v] of Object.entries(types_orig.value!)) {
        types_orig.value![k].name += ` (${cats.value![v.category_id]})`
      }

      types.value = types_orig.value
    }
  }
}


</script>

<template>
  <div class="">
    <div class="notify">
      <div class="notify-container container">
        <div class="notify-title">Уведомления</div>
        <div class="notify-buylist">Для того, чтобы добавить нужный Вам продукт в <RouterLink to="/buy">Список&nbsp;покупок</RouterLink>, перейдите в <RouterLink to="/products">Список&nbsp;продуктов</RouterLink>, выберите просроченный продукт и нажмите на кнопку «корзины».</div>
        <div class="notify-space">
          <div class="notify-card red">
            <div class="notify-card-title">Срок годности истёк</div>
            <div class="notify-card-info">
              <ul class="notify-card-ul" v-for="(k, v) in notifications_expired">
                <li class="notify-card-pos"><code>ID: {{ k['id'] }}</code> • {{ types_orig![String(k['type_id'])].name }}</li>
              </ul>
            </div>
          </div>
          <div class="notify-card yellow">
            <div class="notify-card-title">Срок годности истекает сегодня</div>
            <div class="notify-card-info">
              <ul class="notify-card-ul" v-for="(k, v) in notifications_expiresToday">
                <li class="notify-card-pos"><code>ID: {{ k['id'] }}</code> • {{ types_orig![String(k['type_id'])].name }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notify {
  margin-top: 60px;

  &-title {
    font-size: 2rem;
    font-weight: 600;
  }

  &-buylist {
    margin-top: 15px;
    font-size: 1.2rem;
    //font-weight: 400;

    & a {
      font-size: 1.2rem;
      font-weight: 400;
      border-bottom: 2px solid #000;
      transition: .125s ease-in-out;

      &:hover {
        opacity: .6;
      }
    }
  }

  &-space {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 30px 0;
  }

  &-card {
    width: 100%;
    padding: 30px;
    background: var(--color-sub-background);
    border: 1px solid var(--color-main);
    border-radius: 15px;

    &.red {
      border: 1px solid rgb(255, 59, 59, 0.25);
      background: rgb(255, 59, 59, 0.2);
    }

    &.yellow {
      background: rgba(253, 194, 80, 0.2);
      border: 1px solid rgba(253, 194, 80, 0.25);
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 600;
    }

    &-info {
      margin-top: 35px;
    }

    &-pos {
      & b {
        font-weight: 400;
      }

      & code {
        font-family: "Consolas";
      }

      & button {
        border-bottom: 2px solid #000;
        transition: .125s ease-in-out;

        &:hover {
          opacity: .6;
        }
      }
    }
  }
}

</style>