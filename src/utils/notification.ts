import { ref } from "vue";
import { defineStore } from "pinia";
import {APIRequest} from "@/utils/http.ts";
import router from "@/router";

export const viewNotify = ref(false)

export const notify = ref({
    status: 0,
    title: '',
    msg: ''
})

export function getNotification(status: number, title: string, msg: string) {
    notify.value = {
        'status': status,
        'title': title,
        'msg': msg,
    }
    console.log(notify.value)
    viewNotify.value = true

    setTimeout(() => {
        viewNotify.value = false
    }, 5000)

}



// export const notifyStore = defineStore("notification", () => {
//     const viewNotify = ref(false)
//
//
//     const notify = ref({
//         status: 0,
//         title: '',
//         msg: ''
//     })
//
//     const getNotification = (status: number, title: string, msg: string) => {
//         notify.value = {
//             'status': status,
//             'title': title,
//             'msg': msg,
//         }
//         console.log(notify.value)
//
//         setTimeout(() => {
//             viewNotify.value = true
//         }, 2000)
//
//         viewNotify.value = false
//     }
//
//
//     return { viewNotify, notify, getNotification }
// })
