import { createStore } from 'vuex'
import { genQR } from "@/utils/qr";
import { APIRequest } from './http';

export const store = createStore({
    state() {
        return {
            showPopup: '',
            currentProduct: -1,
            qrData: '',
            qrGenerated: false,
            cats: {},
            shouldUpdateBuylist: false
        }
    },
    mutations: {
        async showPopup(state, value) {
            state.showPopup = value['value'];
            if (value['value'] == 'qr_show') {
                state.qrGenerated = false;
                state.qrData = await genQR(state.currentProduct, state.qrData)
                console.log(state.qrData)
                state.qrGenerated = true;
            } else if (value['value'] == 'create_type') {
                const cData = await APIRequest('/product_categories/all', "GET", {}, {}, true);
                if (cData.status === 200) {
                    state.cats = cData.json;
                }
            }
        },
        setCurProd(state, value) {
            state.currentProduct = value['value'];
        },
        setQrGen(state, value) {
            state.qrGenerated = value['value'];
        },
        async updateBuylist(state) {
            const cData = await APIRequest('/product_categories/all', "GET", {}, {}, true);
            if (cData.status === 200) {
                state.cats = cData.json;
            }
            state.shouldUpdateBuylist = !state.shouldUpdateBuylist;
        }
    }
})