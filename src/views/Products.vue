<script setup lang="ts">
import {
  PhBasket,
  PhTrash,
  PhCaretDown,
  PhScales,
  PhLightning,
  PhRuler,
  PhSparkle,
  PhListMagnifyingGlass, PhBinoculars, PhKnife, PhQrCode, PhEmpty
} from "@phosphor-icons/vue";
import {onBeforeMount, ref, type Ref} from "vue";
import {APIRequest} from "@/utils/http";
import router from "@/router";
import { allergens_specs, type ProductsData } from "@/utils/types";
import {getNotification} from "@/utils/notification.ts";

let orig_products: Ref<ProductsData | null> = ref({})
let products: Ref<ProductsData | null> = ref({})
let empty = ref(false)
let searchInput = ref(false)

onBeforeMount(async () => {
  await loadProducts()
})

async function loadProducts() {
    const data = await APIRequest('/products/all', 'GET', {}, {}, true)
  
    if (data.status === 200) {
      console.log(data.json)
      orig_products.value = data.json
      products.value = data.json

      if (Object.keys(data.json).length === 0) {
        empty.value = true
      }

    } else if (data.status === 403) {
      await router.push("/")
    }
}

function date(f: string): [string, number] {
  const date = new Date(Date.parse(f))
  const day = date.getDate() > 10 ? date.getDate() : `${String(date.getDate()).padStart(2, '0')}`
  const month = date.getMonth() > 10 ? date.getMonth() + 1 : `${String(date.getMonth() + 1).padStart(2, '0')}`

  const difference = (date.getTime() - Date.now()) > 0 ? Math.ceil((date.getTime() - Date.now()) / 1000 / 60 / 60 / 24) + 1 : 0
  const finalDate = `${day}.${month}.${date.getFullYear()}`

  return [finalDate, difference]
}

function getDaysStr(diff: number) {
  if (diff % 10 === 1) {
    return 'день'
  } else if (diff % 10 === 2 || diff % 10 === 3 || diff % 10 === 4) {
    return 'дня'
  } else {
    return 'дней'
  }
}

async function toBuyList(typeId: number, prodId: number, category: string, type: string, count: number) {
  const data = await APIRequest(`/buylist/add`, "POST", {}, {
    prod_type_id: typeId,
    count: count
  }, true)

  if (data.status === 200) {
    const deleteData = await APIRequest(`/products/remove`, "DELETE", {
      product_id: prodId
    }, {}, true)

    if (deleteData.status === 200) {
      await loadProducts()
    } else {
      getNotification(1, "Добавление в корзину", `Произошла ошибка добавления продукта «${category} — ${type}» на стадии удаления просроченного`)
    }
  } else {
    getNotification(1, "Добавление в корзину", `Произошла ошибка добавления продукта «${category} — ${type}» на стадии добавления в список покупок`)
  }
}

async function deleteProduct(id: number) {
  const data = APIRequest(`/buylist/delete`, "POST", {}, {})
}

async function useProduct(prodId: number) {
  const data = await APIRequest('/products/use', 'POST', {prod_id: prodId}, {}, true)

  if (data.status === 200) {
    await loadProducts()
  }
}

let searchText = ref('')

async function onSearchText() {
  const lowerSearchText = searchText.value.toLowerCase().trim()

  if (lowerSearchText === '') {
    products.value = orig_products.value
    return
  }

  let new_products: ProductsData = {}

  if (orig_products !== null) {
    for (let [cat_name, cat] of Object.entries(orig_products.value!)) {
      if (cat_name.toLowerCase().indexOf(lowerSearchText) !== -1) {
        new_products[cat_name] = cat
      } else {
        for (let [type_name, type] of Object.entries(cat)) {
          if (type_name.toLowerCase().indexOf(lowerSearchText) !== -1) {
            if (Object.keys(new_products).indexOf(cat_name) === -1) {
              new_products[cat_name] = {}
            }

            new_products[cat_name][type_name] = type
          }
        }
      }
    }

    products.value = new_products
  }
}

</script>

<template>
  <div class="">
    <div class="products">
      <div class="products-container container">
        <div class="products-title">
          Список продуктов
          <div class="products-title-search" :class="{focus:searchInput}">
            <PhBinoculars class="products-title-search-icon" :size="26" />
            <input type="text" class="products-title-search-input" placeholder="Начните поиск" @focus="searchInput = true" @blur="searchInput = false" @input="onSearchText()" v-model="searchText" />
          </div>
        </div>
        <div class="products-space">
          <div class="products-empty" v-if="empty">К сожалению, в списке продуктов пусто. Добавьте товар, <button class="lets-scan" @click="$store.commit('showPopup', {'value': 'qr_scan'})">отсканировав QR-код</button></div>
          <div class="products-card" v-for="(category, cName) in products">
            <div class="products-card-title">{{ cName }}</div>
            <section class="products-card-type" v-for="(type, tName) in category">
              <div class="products-card-type-title" @click="(e: MouseEvent) => { if (e.target !== null) { (e.target as Element).closest('section')?.classList.toggle('active'); } }"><div class="icon"><PhCaretDown :size="26" /></div> {{ tName }}</div>
              <div class="products-card-type-toggle">
                <div class="products-card-type-info">
                  <div class="products-card-type-info-pos">
                    <div class="products-card-type-info-name"><PhScales :size="24" />Количество:</div>
                    <div class="products-card-type-info-value"><code>{{ type.amount }} {{ type.units }}.</code></div>
                  </div>
                  <div class="products-card-type-info-pos">
                    <div class="products-card-type-info-name"><PhLightning :size="24" />Пищевая ценность на 100г:</div>
                    <!-- <div class="products-card-type-info-value"><code>{{ type.nutritional * (type.amount / 100) }} ккал.</code></div> -->
                    <div class="products-card-type-info-value"><code>{{ type.nutritional }} ккал.</code></div>
                  </div>
                  <div class="products-card-type-info-pos">
                    <div class="products-card-type-info-name"><PhRuler :size="24" />Тип измерения:</div>
                    <div class="products-card-type-info-value">{{ type.measure_type }}</div>
                  </div>
                  <div class="products-card-type-info-pos" v-if="type.allergens != null && type.allergens !== ''">
                    <div class="products-card-type-info-name"><PhSparkle :size="24" />Особенности:</div>
                    <div class="products-card-type-info-value specs">
                      <div class="products-card-type-info-value-spec" v-for="spec in type.allergens.split(',')">{{ allergens_specs[spec] }}</div>
                    </div>
                  </div>
                </div>
                <div class="products-card-table-pre">
                  <table class="products-card-table">
                    <thead>
                    <tr class="products-card-table-tr">
                      <th class="products-card-table-th">ID</th>
                      <th class="products-card-table-th">Дата изготовления</th>
                      <th class="products-card-table-th">Срок годности</th>
                      <th class="products-card-table-th">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="products-card-table-tr" v-for="(item, itemID) in type.items">
                      <td class="products-card-table-td"><code>{{ item.prod_id }}</code></td>
                      <td class="products-card-table-td">{{ date(item.production_date)[0] }}</td>
                      <td class="products-card-table-td">
                        <div class="products-card-table-expiry">
                          {{ date(item.expiry_date)[0] }} (
                          <div class="products-card-table-time" :class="{yellow:date(item.expiry_date)[1] <= 2,green:date(item.expiry_date)[1] > 2}" v-if="date(item.expiry_date)[1] > 0">{{ date(item.expiry_date)[1] }} {{ getDaysStr(date(item.expiry_date)[1]) }}</div>
                          <div class="products-card-table-time-red" v-if="date(item.expiry_date)[1] == 0">истёк</div>)
                        </div>
                      </td>
                      <td class="products-card-table-td">
                        <div class="products-card-table-buttons">
                          <button @click="$store.commit('setCurProd', {'value': item.prod_id}); $store.commit('showPopup', {'value': 'qr_show'})" class="products-card-table-btn transparent"><PhQrCode :size="25" /></button>
                          <button @click="toBuyList(type.type_id, item.prod_id, cName as string, tName as string, 1);" class="products-card-table-btn green"><PhBasket :size="25" /></button>
                          <button @click="useProduct(item.prod_id)" class="products-card-table-btn blue"><PhKnife :size="25" /></button>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lets-scan {
  font-weight: 400;
  text-decoration: underline;
  transition: .125s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
}

.products {
  margin-top: 60px;


  &-title {
    font-size: 2rem;
    font-weight: 600;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px 20px;
    
    &-search {
      display: flex;
      align-items: center;
      gap: 0 10px;
      background: #f3ceac;
      border: 1px solid #ffbd73;
      padding: 0 10px;
      font-weight: 200;
      border-radius: 0.5rem;
      outline: 0;
      transition:
          border,
          background 0.25s ease;

      &:hover {
        border: 1px solid #fca952;
      }

      &.focus {
        border: 1px solid #fd9a2f;
        background: #fcc697;
      }

      &-input {
        padding: 10px;
        background: 0;
        border: 0;
        outline: 0;
      }
    }

    @media (max-width: 830px) {
      flex-direction: column;

      &-search {
        width: 100%;

        &-input {
          width: 100%;
        }
      }

    }
  }

  &-space {
    margin-top: 30px;
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

    @media (max-width: 525px) {
      padding: 20px;
    }

    &-button {
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
    }

    &-title {
      font-size: 1.5rem;
      font-weight: 600;
    }

    &-type {
      margin-top: 25px;

      &-title {
        font-size: 1.2rem;
        font-weight: 400;
        display: flex;
        align-items: center;
        gap: 0 15px;
        cursor: pointer;
        user-select: none;
      }

      & .products-card-type-toggle {
        display: none;
      }

      &.active .products-card-type-toggle {
        display: block;
      }

      &.active &-title .icon {
        transform: rotate(180deg);
      }

      &-info {
        //margin-left: 41px;
        margin: 20px 0;
        display: flex;
        flex-direction: column;
        gap: 15px 0;

        &-pos {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 10px;
        }

        &-name {
          display: flex;
          align-items: center;
          gap: 0 8px;
          font-weight: 400;
          //font-size: 0.9rem;

        }

        &-value {
          & code {
            font-family: monospace;
          }

          &.specs {
            display: flex;
            gap: 0 10px;
            flex-wrap: wrap;
          }

          &-spec {
            padding: 3px 5px;
            background: var(--color-main);
            border-radius: 0.5rem;
          }
        }
      }
    }

    &-table {
      width: 100%;
      text-align: left;
      background: var(--color-table-background);
      border-collapse: collapse;
      white-space: nowrap;

      &-pre {
        margin-top: 10px;
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

      &-expiry {
        display: flex;
        align-items: center;
      }

      &-time-red {
        background: rgb(255, 59, 59, 0.2);
        color: #ff3b3b;
        border-radius: 2px;
      }

      &-time.yellow {
        background: rgb(255, 217, 0, 0.2);
        color: rgb(223, 182, 1);
        border-radius: 2px;
      }

      &-time.green {
        background: rgb(0, 204, 0, 0.2);
        color: rgb(0, 204, 0);
        border-radius: 2px;
      }

      &-buttons {
        display: flex;
        gap: 0 10px;
      }

      &-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
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
  }
}
</style>