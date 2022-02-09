export interface Product {
    /**
     * Array containing the price of the product if the player were to buy it.
     */
    buyPrices: Array<number>;

    /**
     * Array containing the names of the settlements where the product can be bought at the
     * respective price.
     */
    buySettlements: Array<string>;

    /**
     * The name of the product.
     */
    name: string;

    /**
     * Array containing the price of the product if the player were to sell it.
     */
    sellPrices: Array<number>;

    /**
     * Array containing the names of the settlements where the product can be sold at the respective
     * price.
     */
    sellSettlements: Array<string>;
}
