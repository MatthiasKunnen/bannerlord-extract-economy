import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Logger} from '../utils/logger.util';
import {Stats} from './stats-input.interface';
import {Product} from './stats.interface';

const excludedProducts = new Set([
    'Cat',
    'Chicken',
    'Dog',
    'Goose',
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

    constructor(
        private readonly toastr: ToastrService,
    ) {
    }

    ngOnInit(): void {
        fetch('/assets/bannerlord-economy.json')
            .then(async data => data.json())
            .then(async data => {
                this.loadStats(data);
            })
            .catch(error => {
                Logger.error({
                    error,
                    message: 'Loading bannerlord-economy.json failed',
                });
                this.error = error.message;
            });
    }

    loadStats(stats: Stats) {
        this.loading = true;
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

                if (price.InStore > 0) {
                    product.buyPrices.push(price.BuyPrice);
                    product.buySettlements.push(`${price.SettlementName} (${price.InStore})`);
                }

                product.sellPrices.push(price.SellPrice);
                product.sellSettlements.push(price.SettlementName);
            }

            acc.push(product);

            return acc;
        }, []).sort((a, b) => a.name.localeCompare(b.name));

        this.stats = stats;
        this.loading = false;
    }

    onStatsFileChange(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const files = fileInput.files;

        if (files === null) {
            return;
        }

        this.loading = true;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                return;
            }

            try {
                this.loadStats(JSON.parse(reader.result));
            } catch (error: any) {
                this.loading = false;
                Logger.error({
                    error,
                    message: 'Failed to update stats',
                    info: {
                        reader,
                    },
                });
                this.toastr.error(error.message, 'Failed to update stats');
            }
        };
        reader.onabort = () => {
            this.loading = false;
        };
        reader.readAsText(files[0]);
    }
}
