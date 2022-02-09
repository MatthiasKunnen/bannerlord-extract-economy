import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import {newPlot} from 'plotly.js-dist-min';

import {Logger} from '../../utils/logger.util';
import {Product} from '../stats.interface';

@Component({
    selector: 'app-product-chart',
    templateUrl: './product-chart.component.html',
    styleUrls: ['./product-chart.component.scss'],
})
export class ProductChartComponent implements AfterViewInit {

    @Input() product: Product;

    @ViewChild('chart') chartElement: ElementRef;

    ngAfterViewInit(): void {
        newPlot(
            this.chartElement.nativeElement,
            [
                {
                    boxpoints: 'all',
                    jitter: 0.3,
                    name: 'Buy price',
                    pointpos: -1.8,
                    text: this.product.buySettlements,
                    type: 'box',
                    y: this.product.buyPrices,
                },
                {
                    boxpoints: 'all',
                    name: 'Sell price',
                    jitter: 0.3,
                    pointpos: -1.8,
                    text: this.product.sellSettlements,
                    type: 'box',
                    y: this.product.sellPrices,
                },
            ],
            {
                font: {
                    color: '#fff',
                    size: 16,
                },
                showlegend: false,
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                title: {
                    text: this.product.name,
                    font: {
                        family: 'Roboto',
                        size: 24,
                    },
                },
            },
            {
                responsive: true,
            },
        ).catch(Logger.errorWrap);
    }
}
