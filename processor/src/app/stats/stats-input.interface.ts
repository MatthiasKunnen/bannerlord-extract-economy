export interface Stats {
    [city: string]: CityStats;
}

export interface CityStats {
    Goods: CityGoods;
    Type: 'Village' | 'Town';
}

export interface CityGoods {
    [product: string]: ProductStats;
}

export interface ProductStats {
    BuyPrice: number;
    Demand: number | null;
    Name: string;
    SellPrice: number;
    Supply: number | null;
}
