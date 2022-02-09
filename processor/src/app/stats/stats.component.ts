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

    display: 'all' | 'by-product' = 'by-product';
    error: string | null = null;
    loading = true;
    products: Array<Product>;

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
        this.products = Object.entries(stats).reduce<Array<Product>>((
            acc,
            [productName, productInfo],
        ) => {
            if (excludedProducts.has(productName)) {
                return acc;
            }

            const product: Product = {
                buyPrices: [],
                buySettlements: [],
                name: productName,
                sellPrices: [],
                sellSettlements: [],
            };

            for (const price of productInfo.Prices) {
                if (price.SettlementType === 'Village') {
                    continue;
                }

                product.buyPrices.push(price.BuyPrice);
                product.buySettlements.push(price.SettlementName);
                product.sellPrices.push(price.SellPrice);
                product.sellSettlements.push(price.SettlementName);
            }

            acc.push(product);

            return acc;
        }, []).sort((a, b) => a.name.localeCompare(b.name));

        this.stats = stats;
        this.loading = false;
    }
}
