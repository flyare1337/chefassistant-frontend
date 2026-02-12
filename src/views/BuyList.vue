<script setup lang="ts">

import {getCurrentInstance, onBeforeMount, onMounted, ref, type Ref} from "vue";
import {APIRequest} from "@/utils/http.ts";
import {watch} from "vue";
import {
  PhBackspace,
  PhBasket,
  PhBowlFood, PhBroom,
  PhKnife,
  PhMagnifyingGlass,
  PhNavigationArrow, PhPlusCircle,
  PhQrCode, PhRuler, PhScales, PhSortAscending
} from "@phosphor-icons/vue";
import router from "@/router";
import {type BuylistData, type TypesData, type CategoriesData} from "@/utils/types.ts";
import { useStore } from "vuex";

let buy: Ref<BuylistData | null> = ref(null)
let types_orig: Ref<TypesData | null> = ref(null)
let types: Ref<TypesData | null> = ref(null)
let cats: Ref<CategoriesData | null> = ref(null)

let inputName = ref(false)
let inputCount = ref(false)
let inputDropdown = ref(false)

let add = ref('')
let mode = ref(0)

let selectedType = ref('')
let selectedCount = ref(1)

const store = useStore();

onBeforeMount(async () => {
  await loadBuyList()
})

watch(() => store.state.shouldUpdateBuylist, (newValue) => {
  loadBuyList()
})

async function loadBuyList() {
  console.log('JGHJKAHSJKAHSJKA')
  const data = await APIRequest("/buylist/get", "GET", {}, {}, true)

  if (data.status === 200) {
    buy.value = data.json

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
  } else if (data.status === 403) {
    await router.push("/")
  }
}

async function buyProduct(id: number) {
  const data = await APIRequest('/buylist/remove', "DELETE", {buylist_id: id}, {}, true)

  if (data.status === 200) {
    await loadBuyList()
  }
}

async function addToList() {
  if (selectedCount.value < 1) {
    alert("Количество должно быть больше нуля!");
  } else if (Number(selectedCount.value) % 1 !== 0) {
    alert("Количество должно быть целым числом!");
  } else if (selectedType.value === '') {
    alert("Укажите тип продукта!")
  } else {
    const typeId = Object.keys(types_orig.value!).find(key => types_orig.value![key].name === selectedType.value.trim())
    const data = await APIRequest('/buylist/add', 'POST', {}, {
      prod_type_id: typeId,
      count: selectedCount.value
    }, true)

    if (data.status === 200) {
      add.value = ''
      mode.value = 0
      selectedType.value = ''
      await loadBuyList()
    }
  }
}

async function clearList() {
  const data = await APIRequest("/buylist/clear", "DELETE", {}, {}, true)

  if (data.status === 200) {
    await loadBuyList()
  }
}

function onInput() {
  const add_val = add.value.trim().toLowerCase();
  mode.value = 0
  types.value = {}
  if (add_val === '')
    return;

  for (let [k, v] of Object.entries(types_orig.value!)) {
    if (v.name.toLowerCase().indexOf(add_val) !== -1) {
      types.value[k] = v
      mode.value = 1
    }
  }
}
</script>

<template>
  <div class="">
    <div class="buy">
      <div class="buy-container container">
        <div class="buy-title">Список покупок</div>
        <div class="buy-add">
          <div class="buy-add-col" :class="{focus:inputName}">
            <PhBowlFood :size="26" />
            <input type="text" class="buy-add-input" placeholder="Название типа/категории" @focus="inputName = true" @blur="inputName = false" v-model="add" @input="onInput">
          </div>
          <div class="buy-add-col" :class="{focus:inputDropdown}" v-if="mode == 1">
            <PhSortAscending :size="26" />
            <select class="buy-add-input select" @focus="inputDropdown = true" @blur="inputDropdown = false" v-model="selectedType">
              <option v-for="(k, v) in types" class="buy-add-input-option">
                {{ k.name }}
              </option>
            </select>
          </div>
          <div class="buy-add-col" :class="{focus:inputCount}" v-if="mode == 1">
            <PhRuler :size="26" />
            <input type="text" class="buy-add-input count" placeholder="Количество" @focus="inputCount = true" @blur="inputCount = false" v-model="selectedCount">
          </div>
          <button @click="addToList()" class="buy-add-button green" v-if="mode == 1">
            <PhPlusCircle :size="26"></PhPlusCircle>
          </button>
          <button class="buy-add-button blue newct" v-if="mode == 0" @click="$store.commit('showPopup', {'value': 'create_type'})">
            <PhPlusCircle :size="26"></PhPlusCircle>
            Создать тип
          </button>
        </div>
        <div class="buy-clear-btn">
          <button @click="clearList()" class="buy-table-btn red"><PhBroom :size="25" />Очистить список</button>
        </div>
        <div class="buy-empty" v-if="buy === null || buy?.length <= 0">К сожалению, в списке покупок пусто</div>
        <div class="buy-table-pre" v-else>
          <table class="buy-table">
            <thead>
            <tr class="buy-table-tr">
              <th class="buy-table-th">ID</th>
              <th class="buy-table-th">Название продукта</th>
              <th class="buy-table-th">Количество</th>
<!--              <th class="buy-table-th">Масса</th>-->
              <th class="buy-table-th">Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr class="buy-table-tr" v-for="item in buy">
              <td class="buy-table-td"><code>{{ item.id }}</code></td>
              <td class="buy-table-td">{{ types_orig![String(item.prod_type_id)].name }}</td>
              <td class="buy-table-td"><code>{{ item.count }}</code> ({{ types_orig![String(item.prod_type_id)].measure_type }})</td>
<!--              <td class="buy-table-td">{{ types_orig![String(item.prod_type_id)].amount }} {{ types_orig![String(item.prod_type_id)].units }}</td>-->
              <td class="buy-table-td">
                <div class="buy-table-buttons">
                  <button @click="buyProduct(item.id)" class="buy-table-btn red"><PhBackspace :size="25" />Удалить</button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.buy {
  margin-top: 60px;

  &-empty {
    margin-top: 30px;
  }

  &-clear-btn {
    @media (max-width: 945px) {
      & button {
        width: 100%;
      }
    }
  }

  &-title {
    font-size: 2rem;
    font-weight: 600;
  }

  &-table {
    width: 100%;
    text-align: left;
    background: var(--color-table-background);
    border-collapse: collapse;
    white-space: nowrap;

    &-pre {
      margin-top: 20px;
      border: 1px solid var(--color-main);
      border-radius: 10px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
    }

    &-tr {
      border-bottom: 1px solid var(--color-main);
    }

    &-th {
      font-weight: 400;
    }

    &-th, &-td {
      padding: 10px 20px;

      code {
        font-family: monospace;
      }
    }

    tbody &-tr:last-child {
      border-bottom: none;
    }


    &-buttons {
      display: flex;
      gap: 0 10px;
    }

    &-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0 10px;
      padding: 0 10px;
      height: 40px;
      border-radius: 7px;
      transition: .125s ease-in-out;

      &.full {
        width: 90px !important;
      }

      &.green {
        border: 1px solid rgb(0, 204, 0, 0.25);
        background: rgb(0, 204, 0, 0.2);

        &:hover {
          background: rgb(0, 204, 0, 0.25);
        }
      }

      &.red {
        border: 1px solid rgb(255, 59, 59, 0.25);
        background: rgb(255, 59, 59, 0.2);

        &:hover {
          background: rgb(255, 59, 59, 0.25);
        }
      }

      &.blue {
        border: 1px solid rgb(55, 109, 255, 0.25);
        background: rgb(55, 109, 255, 0.2);

        &:hover {
          background: rgb(55, 109, 255, 0.25);
        }
      }

      &.transparent {
        border: 1px solid rgba(255, 140, 48, 0.25);
        background: rgba(255, 140, 48, 0.2);

        &:hover {
          background: rgba(255, 140, 48, 0.25);
        }
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  &-add {
    display: flex;
    gap: 0 20px;
    margin: 15px 0;

    @media (max-width: 945px) {
      flex-direction: column;
      gap: 15px 0;
    }

    &-col {
      display: flex;
      align-items: center;
      gap: 0 10px;
      background: #f3ceac;
      border: 1px solid #ffbd73;
      padding: 0 10px;
      font-weight: 200;
      border-radius: 0.5rem;
      outline: 0;
      transition: border,
      background 0.25s ease;

      &:hover {
        border: 1px solid #fca952;
      }

      &.focus {
        border: 1px solid #fd9a2f;
        background: #fcc697;
      }
    }

    &-input {
      padding: 10px;
      background: 0;
      border: 0;
      outline: 0;

      @media (max-width: 945px) {
        width: 100% !important;
      }

      &.count, &.m {
        width: 120px;
      }

      &.select {
        width: 200px;
      }

      &-option {
        background: #f3ceac;
      }
    }

    &-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45.2px;
      height: 45.2px;
      border-radius: 7px;
      transition: .125s ease-in-out;
      cursor: pointer;

      @media (max-width: 945px) {
        width: 100%;
      }

      &.blue {
        border: 1px solid rgb(55, 109, 255, 0.25);
        background: rgb(55, 109, 255, 0.2);

        &:hover {
          background: rgb(55, 109, 255, 0.25);
        }
      }

      &.green {
        border: 1px solid rgb(0, 204, 0, 0.25);
        background: rgb(0, 204, 0, 0.2);

        &:hover {
          background: rgb(0, 204, 0, 0.25);
        }
      }

      &.newct {
        width: auto;
        padding: 0 15px;
        gap: 10px;
      }
    }
  }
}
</style>