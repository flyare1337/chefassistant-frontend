export type QRData = {
    prod_id: number,
    production_date: string,
    expiry_date: string,

    type_id: number,
    type_name: string,
    amount: number,
    units: string,
    nutritional: number,
    measure_type: string,
    allergens: string | null,
    expiry_days: number,

    cat_id: number,
    cat_name: string
}

export type TypeData = {
    amount: number,
    units: string,
    nutritional: number,
    measure_type: string,
    allergens: string | null,
    type_id: number,
    expiry_days: number,
    items: [any]
}

export type ProductsData = {
    [cat_name: string]: {
        [type_name: string]: TypeData
    }
}

export const allergens_specs: {[_: string]: string} = {
    "0": "аллергенное",
    "1": "лактоза",
    "2": "глютен"
}

export type AnalyticsData = {
    total: {
        [_: string]: number
    },
    days: [
        {
            date: string,
            added: number,
            used: number,
            expired: number
        }
    ]
}

export type BuylistData = [
    {
        prod_type_id: number,
        count: number,
        id: number
    }
]

export type TypesData = {
    [_: string]: {
        amount: number,
        nutritional: number,
        allergens: string | null,
        category_id: number,
        units: string,
        name: string,
        measure_type: string
    }
}

export type CategoriesData = {
    [_: string]: string
}