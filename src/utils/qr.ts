import {APIRequest} from "@/utils/http";
import type {QRData} from "@/utils/types.ts";

export function decodeQR(text: string) : QRData {
    let data = JSON.parse(text)

    let res: QRData = {
        prod_id: data[0],
        production_date: data[1],
        expiry_date: data[2],

        type_id: data[3],
        type_name: data[4],
        amount: data[5],
        units: data[6],
        nutritional: data[7],
        measure_type: data[8],
        allergens: data[9],
        expiry_days: data[10],

        cat_id: data[11],
        cat_name: data[12]
    };

    let date_val = new Date(res.production_date);
    res.production_date = `${String(date_val.getDate()).padStart(2, '0')}.${String(date_val.getMonth() + 1).padStart(2, '0')}.${date_val.getFullYear()}`;
    date_val = new Date(res.expiry_date);
    res.expiry_date = `${String(date_val.getDate()).padStart(2, '0')}.${String(date_val.getMonth() + 1).padStart(2, '0')}.${date_val.getFullYear()}`;

    return res;
}

export async function genQR(id: number, fff: string) {
    const data = await APIRequest('/products/product', 'GET', {'id': id}, {}, true)
    console.log(data)

    if (data.status === 200) {
        const keys = ['prod_id', 'production_date', 'expiry_date', 'type_id', 'type_name', 'amount', 'units', 'nutritional', 'measure_type', 'allergens', 'expiry_days', 'cat_id', 'cat_name']

        let vals: any[] = []
        keys.forEach((k) => {
            vals.push(data.json[k])
        })

        return JSON.stringify(vals)
    }

    return fff
}