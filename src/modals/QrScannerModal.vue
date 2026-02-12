<template>
    <Modal id="qr_scan" title="Сканнер QR">
        <!-- {{dataref}} -->
        <div v-if="dataref === null">
            <QrScanner :fps="10" :qrbox="200" :on-scanned="onScanSuccess"></QrScanner>
        </div>
        <div v-if="dataref !== null" class="qr-scanner-info">
            <div class="qr-scanner-info-title"><PhInfo :size="25" /> Информация о продукте</div>
            <div class="qr-scanner-info-pos">
            <div class="qr-scanner-name name">{{ dataref.type_name }} ({{ dataref.cat_name }})</div>
            </div>
            <div class="qr-scanner-info-pos" v-if="dataref.prod_id !== -1">
            <div class="qr-scanner-name">ID продукта:</div> <div class="qr-scanner-value"><code>{{ dataref.prod_id }}</code></div>
            </div>
            <div class="qr-scanner-info-pos">
            <div class="qr-scanner-name">Дата производства:</div> <div class="qr-scanner-value">{{ dataref.production_date }}</div>
            </div>
            <div class="qr-scanner-info-pos">
            <div class="qr-scanner-name">Срок годности:</div> <div class="qr-scanner-value">{{ dataref.expiry_date }}</div>
            </div>
            <div class="qr-scanner-info-pos">
            <div class="qr-scanner-name">Количество:</div> <span class="qr-scanner-value"><code>{{ dataref.amount }}</code> {{ dataref.units }}</span>
            </div>
            <div class="qr-scanner-info-pos">
            <div class="qr-scanner-name">Пищевая ценность:</div> <div class="qr-scanner-value"><code>{{ dataref.nutritional }}</code> ккал</div>
            </div>
            <div class="qr-scanner-info-pos">
            <div class="qr-scanner-name">Единицы измерения:</div> <div class="qr-scanner-value">{{ dataref.measure_type }}</div>
            </div>
            <div class="qr-scanner-info-pos" v-if="dataref.allergens !== null && dataref.allergens !== undefined && dataref.allergens !== ''">
            <div class="qr-scanner-name">Особенности:</div> <div class="qr-scanner-value">{{ dataref.allergens.split(',').map((x: any) => allergens_specs[x]).join(', ') }}</div><span v-if="dataref.allergens === null">нет</span>
            </div>
            <br>
            <div class="qr-scanner-info-title"><PhHandTap :size="25" /> Действия</div>
            <div class="qr-scanner-buttons">
            <button v-if="dataref.prod_id !== -1" @click="useProduct(dataref.prod_id)" class="qr-scanner-button blue"><PhKnife :size="25" />Приготовить</button>
            <button v-if="dataref.prod_id === -1" @click="toFridge()" class="qr-scanner-button green"><PhPlusCircle :size="25" />В холодильник</button>
            <button v-if="dataref.prod_id !== -1 && dataref.type_id !== -1" @click="toBuyList()" class="qr-scanner-button purple"><PhBasket :size="25" />В список покупок</button>
            <button @click="dataref = null" class="qr-scanner-button yellow"><PhArrowCounterClockwise :size="22" />Сканировать заново</button>
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import QrScanner from "@/components/QrScanner.vue";
import Modal from "@/components/Modal.vue";
import {type Ref, ref} from "vue";
import {allergens_specs, type CategoriesData, type QRData} from "@/utils/types.ts";
import {decodeQR} from "@/utils/qr.ts";
import {PhArrowCounterClockwise, PhBasket, PhHandTap, PhInfo, PhKnife, PhPlusCircle} from "@phosphor-icons/vue";
import {APIRequest} from "@/utils/http.ts";
import { useStore } from "vuex";

const store = useStore();

let dataref: Ref<QRData | null> = ref(null)

async function onScanSuccess(text: string, error: any) {  
  dataref.value = decodeQR(text);
}

async function useProduct(prodId: number) {
  const data = await APIRequest('/products/use', 'POST', {prod_id: prodId}, {}, true)

  if (data.status === 200) {
    dataref.value = null
    window.location.reload()
  }
}

async function toFridge() {
  if (dataref.value !== null) {
    let catid = String(dataref.value?.cat_id)

    if (dataref.value.cat_id === -1) {
      console.log('creating cat')
      const data = await APIRequest('/product_categories/add', 'POST', {'name': dataref.value.cat_name}, {}, true)

      if (data.status !== 200) {
        console.error('not created cat')

        catid = data.json.detail.id
      } else {
        catid = data.json.id
      }
    }

    let typeid = String(dataref.value?.type_id)

    if (dataref.value.type_id === -1) {
      // const cData = await APIRequest('/product_categories/all', "GET", {}, {}, true)
      // if (cData.status === 200) {
      //   const cDataJson: CategoriesData = cData.json;
      //   console.log(cDataJson)

        const data2 = await APIRequest('/product_types/add', 'POST', {
          'name': dataref.value.type_name,
          // 'category_id': Object.keys(cDataJson).find(key => cDataJson[key] === dataref.value?.cat_name),
          'category_id': catid,
          'amount': dataref.value.amount,
          'units': dataref.value.units,
          'nutritional': dataref.value.nutritional,
          'measure_type': dataref.value.measure_type,
          'expiry_days': dataref.value.expiry_days,
          'allergens': dataref.value.allergens
        }, {}, true)

        if (data2.status !== 200) {
          console.error('not adding type')
          typeid = data2.json.detail.id
        } else {
          typeid = data2.json.id;
          console.log('NEW TYPE ID', typeid)
        }
      // }
    }

    if (dataref.value.prod_id === -1) {
      const [d1, m1, y1] = dataref.value.production_date.split('.');
      const [d2, m2, y2] = dataref.value.expiry_date.split('.');
      const dataa = await APIRequest('/products/add', 'POST', {
        'type_id': typeid,
        'prod_date': `${y1}-${m1}-${d1}`,
        'exp_date': `${y2}-${m2}-${d2}`
      }, {}, true)

      if (dataa.status !== 200) {
        console.error('shjkadhjkasdhjkashkdj')
      } else {
        store.state.showPopup = '';
        store.state.currentProduct = -1;
        store.state.qrData = '';
        dataref.value = null;
        window.location.reload()
      }
    }
  }
}

async function toBuyList() {
  const data = await APIRequest('/buylist/add', 'POST', {}, {'prod_type_id': dataref.value?.type_id, 'count': 1}, true)
}
</script>

<style lang="scss">
.qr-scanner {
  &-name {
    font-weight: 400;

    &.name {
      font-weight: 600;
    }
  }

  &-info {
    display: flex;
    flex-direction: column;
    gap: 5px 0;

    &-pos {
      display: flex;
      gap: 0 10px;
      //margin-left: 38px;
    }

    &-title {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0 13px;
      margin-bottom: 10px;
    }
  }

  &-value {

    & code {
      font-family: monospace;
    }

  }

  &-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    //margin-left: 38px;


    @media (max-width: 580px) {
      grid-template-columns: 1fr;
    }
  }
  

  &-button {
    width: 100%;
    height: 50px;
    text-align: center;
    padding: 5px 15px;
    border-radius: 15px;
    transition: .1s ease-in;
    justify-content: center;
    //background-color: #fcc697 !important;
    //border: 1px solid #fd9a2f;
    display: flex;
    align-items: center;
    gap: 0 9px;

    &.blue {
      border: 1px solid rgb(55, 109, 255, 0.25) !important;
      background: rgb(55, 109, 255, 0.2) !important;

      &:hover {
        background: rgb(55, 109, 255, 0.25) !important;
      }
    }

    &.green {
      border: 1px solid rgb(0, 204, 0, 0.25) !important;
      background: rgb(0, 204, 0, 0.2) !important;

      &:hover {
        background: rgb(0, 204, 0, 0.25) !important;
      }
    }

    &.red {
      border: 1px solid rgb(255, 59, 59, 0.25);
      background: rgb(255, 59, 59, 0.2);

      &:hover {
        background: rgb(255, 59, 59, 0.25);
      }
    }

    &.white {
      background: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.5);

      &:hover {
        background: rgba(255,  255, 255, 0.3);
      }
    }

    &.purple {
      background: rgb(238, 50, 255, 0.2);
      border: 1px solid rgb(238, 50, 255, 0.25);

      &:hover {
        background: rgb(238, 50, 255, 0.25);
      }
    }

    &.yellow {
      background: rgba(211, 170, 20, 0.2);
      border: 1px solid rgba(211, 170, 20, 0.25);

      &:hover {
        background: rgba(211, 170, 20, 0.25);
      }
    }
  }
}
</style>