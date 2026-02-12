<template>
  <Modal id="create_type" title="Создать новый тип">
    <input class="modal-input" type="text" placeholder="Название типа" v-model="name">
    <div style="display: flex; gap: 15px; align-items: center;">
      <input class="modal-input special" type="text" placeholder="Название категории" v-model="catname" @input="catsvar = $store.state.cats; onCatInput()">
      <button class="modal-icon-btn blue" v-if="mode === 0" @click="$store.commit('showPopup', {'value': 'create_cat'})"><PhPlusCircle :size="25" /></button>
      <select  class="modal-input" v-if="mode === 1" v-model="cat_chosen">
        <option v-for="(k, v) in newcats">
          {{ k }}
        </option>
      </select>
    </div>
    <input class="modal-input" type="number" placeholder="Кол-во (в ед.изм)" v-model="amount">
    <br>
    <input class="modal-input" type="text" placeholder="Единицы измерения" v-model="units">
    <br>
    <input class="modal-input" type="number" placeholder="Пищевая ценность (в ккал)" v-model="nutritional">
    <br>
    <input class="modal-input" type="text" placeholder="Тип измерения" v-model="measure_type">
    <br>
    <input class="modal-input" type="number" placeholder="Кол-во дней до истечения срока годности" v-model="expiry_days">
<!--    <input class="modal-input" type="text" placeholder="Особенности" v-model="allergens">-->
    <br>
    <label class="modal-option">
      <input type="checkbox" class="modal-option--btn" />
      <span>Алергенное</span>
    </label>
    <label class="modal-option">
      <input type="checkbox" class="modal-option--btn" />
      <span>Содержит лактозу</span>
    </label>
    <label class="modal-option">
      <input type="checkbox" class="modal-option--btn" />
      <span>Содержит глютен</span>
    </label>
    <br>
    <div class="modal-error" v-if="error !== ''">
      <PhXCircle :size="24" />
      {{ error }}
    </div>

    <button class="modal-button green" @click="async () => {if (await onAddClicked()) {$store.commit('updateBuylist'); $store.commit('showPopup', {'value': ''});}}"><PhPlusCircle :size="24" />Добавить тип</button>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import {type Component, type Ref, ref} from 'vue';
import { type BuylistData, type CategoriesData } from "@/utils/types";
import { APIRequest } from "@/utils/http";
import {PhPlusCircle, PhXCircle} from "@phosphor-icons/vue";

let catname: Ref<string> = ref('');
let newcats: Ref<CategoriesData> = ref({});
let mode: Ref<number> = ref(0);
let catsvar: Ref<CategoriesData> = ref({});
let error: Ref<string> = ref('');

let name: Ref<string> = ref('');
let cat_chosen: Ref<string> = ref('');
let amount: Ref<number | undefined> = ref();
let units: Ref<string> = ref('');
let nutritional: Ref<number | undefined> = ref();
let measure_type: Ref<string> = ref('');
let allergens: Ref<string> = ref('');
let expiry_days: Ref<number | undefined> = ref();

async function onCatInput() {
  const cat_val = catname.value.trim().toLowerCase();
  mode.value = 0
  newcats.value = {}
  if (cat_val === '')
    return;

  for (let [k, v] of Object.entries(catsvar.value)) {
    if (v.toLowerCase().indexOf(cat_val) !== -1) {
      newcats.value[k] = v
      mode.value = 1
    }
  }
}

async function onAddClicked() {
  for (const r of [name, cat_chosen, units, measure_type]) {
    if (r.value.trim() === '') {
      return false;
    }
  }
  if (cat_chosen.value === undefined || cat_chosen.value.trim() === '' || amount.value === undefined || nutritional.value === undefined || expiry_days.value === undefined ||
      amount.value <= 0 || nutritional.value <= 0 || expiry_days.value <= 0)
    return false;

  const data = await APIRequest('/product_types/add', 'POST', {
    'name': name.value.trim(),
    'category_id': Object.keys(catsvar.value).find(key => catsvar.value[key] === cat_chosen.value.trim()),
    'amount': amount.value,
    'units': units.value,
    'nutritional': nutritional.value,
    'measure_type': measure_type.value,
    'allergens': allergens.value,
    'expiry_days': expiry_days.value
  }, {}, true)

  if (data.status !== 200) {
    console.error('!!! failed to add type')
    console.log(data.json)
    error.value = data.json.detail.error
    return false
  }

  return true
}
</script>

<style lang="scss">
.modal {
  &-option {
    display: flex;
    flex-direction: initial;
    align-items: center;
    gap: 25px;
    margin: 20px 0;
    cursor: pointer;

    &--btn:after {
      width: 25px;
      height: 25px;
      border-radius: 15px;
      top: -8px;
      left: -6px;
      position: relative;
      background: #f3ceac;
      border: 2px solid #ffbd73;
      content: '';
      display: inline-block;
      visibility: visible;
      cursor: pointer;
      transition: 0.25s ease;
    }

    &--btn:after:hover {
      border: 2px solid #fca952;
      //background: #efefef;
    }
    &--btn:checked:after {
      width: 25px;
      height: 25px;
      border-radius: 15px;
      top: -8px;
      left: -6px;
      position: relative;
      border: 2px solid #fd9a2f;
      background: #fcc697;
      content: '';
      display: inline-block;
      visibility: visible;
    }

    @media (max-width: 810px) {
      flex-direction: initial;
      gap: 0 25px;
    }
  }
}
</style>