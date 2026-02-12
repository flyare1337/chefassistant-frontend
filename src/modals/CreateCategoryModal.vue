<template>
  <Modal id="create_cat" title="Создать новую категорию">
    <input class="modal-input" type="text" placeholder="Название категории" v-model="catname">
    <br>
    <br>
    <button class="modal-button green" @click="async () => {if (await add_cat()) {$store.commit('updateBuylist'); $store.commit('showPopup', {'value': ''});}}"><PhPlusCircle :size="24" /> Добавить категорию</button>
    <button @click="$store.commit('showPopup', {'value': 'create_type'});" class="modal-button modal-back transparent"><PhArrowBendUpLeft :size="22" /> Вернуться назад</button>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/Modal.vue";
import {type Ref, ref} from 'vue';
import { APIRequest } from "@/utils/http";
import {PhArrowBendUpLeft, PhPlusCircle} from "@phosphor-icons/vue";

let catname: Ref<string> = ref('');

async function add_cat(this: any) {
  if (catname.value.trim() === '')
    return false
  const data = await APIRequest('/product_categories/add', 'POST', {'name': catname.value.trim()}, {}, true);
  if (data.status !== 200) {
    console.log('ошибка при добавлении product cat')
  }
  return true
}
</script>

<style lang="scss">

.modal-input {
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

  &.special {
    width: calc(100% - 59px) !important;
  }

  &:hover {
    border: 1px solid #fca952;
  }

  &:focus {
    border: 1px solid #fd9a2f;
    background: #fcc697;
  }
}

.modal-button {
  //margin-top: 20px;
  width: 100%;
  text-align: center;
  padding: 15px 25px;
  border-radius: 15px;
  transition: .125s ease-in-out;
  justify-content: center;
  background-color: #ffcda6;
  border: 1px solid #FFBD88;
  display: flex;
  align-items: center;
  gap: 0 15px;


  &.green {
    border: 1px solid rgb(0, 204, 0, 0.25);
    background: rgb(0, 204, 0, 0.2);

    &:hover {
      background: rgb(0, 204, 0, 0.25);
    }
  }

  &.transparent {
    border: 1px solid rgba(255, 140, 48, 0.25);
    background: rgba(255, 140, 48, 0.2);

    &:hover {
      background: rgba(255, 140, 48, 0.25);
    }
  }
}

.modal-back {
  margin: 10px 0;
  font-size: 0.9rem;
  padding: 7px 25px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(183, 183, 183);
}

.modal-icon-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 7px;
  transition: .125s ease-in-out;

  &.blue {
    border: 1px solid rgb(55, 109, 255, 0.25);
    background: rgb(55, 109, 255, 0.2);

    &:hover {
      background: rgb(55, 109, 255, 0.25);
    }
  }
}

.modal-error {
  margin-top: 20px;
  color: #ff0000;
  display: flex;
  align-items: center;
  gap: 0 10px;
}
</style>