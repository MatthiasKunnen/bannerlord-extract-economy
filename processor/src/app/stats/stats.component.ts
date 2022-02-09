import {Component, OnInit} from '@angular/core';

import {Logger} from '../utils/logger.util';
import {Stats} from './stats-input.interface';
import {Product} from './stats.interface';

const excludedProducts = new Set([
    'Stolen Goods',
    'Trash Item',
]);

@Component({
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit {

    products: Array<Product>;
    error: string | null = null;
    loading = true;

    private stats: Stats;

    ngOnInit(): void {
        fetch('/assets/bannerlord-economy.json')
            .then(async data => data.json())
            .then(async data => this.loadStats(data))
            .catch(error => {
                Logger.error({
                    error,
                    message: 'Loading bannerlord-economy.json failed',
                });
                this.error = error.message;
            });
    }

    async loadStats(stats: Stats) {
        const goods = Object.entries(stats).reduce((acc, [city, cityStats]) => {
            for (const [productName, productInfo] of Object.entries(cityStats.Goods)) {
                if (excludedProducts.has(productName)) {
                    continue;
                }

                let product = acc.get(productName);

                if (product === undefined) {
                    product = {
                        buyPrices: [],
                        buySettlements: [],
                        name: productName,
                        sellPrices: [],
                        sellSettlements: [],
                    };
                    acc.set(productName, product);
                }

                product.buyPrices.push(productInfo.BuyPrice);
                product.buySettlements.push(city);

                if (cityStats.Type !== 'Village') {
                    product.sellPrices.push(productInfo.SellPrice);
                    product.sellSettlements.push(city);
                }
            }

            return acc;
        }, new Map<string, Product>());

        this.products = [...goods.values()];
        this.stats = stats;
        this.loading = false;
    }
}
