export interface Stats {
    [product: string]: Product;
}

export interface Product {
    Type?: string;
    Prices: Array<Price>;
}

export interface Price {
    BuyPrice: number;
    Demand: number | null;
    InStore: number;
    InStoreValue: number;
    SellPrice: number;
    SettlementName: string;
    SettlementType: 'Village' | 'Town';
    Supply: number | null;
}
