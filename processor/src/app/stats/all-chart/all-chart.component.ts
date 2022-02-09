import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {newPlot} from 'plotly.js-dist-min';
import {Logger} from '../../utils/logger.util';
import {Product} from '../stats.interface';

@Component({
    selector: 'app-all-chart',
    templateUrl: './all-chart.component.html',
    styleUrls: ['./all-chart.component.scss'],
})
export class AllChartComponent implements AfterViewInit {

    @Input() products: Array<Product>;

    @ViewChild('chart') chartElement: ElementRef;

    ngAfterViewInit(): void {
        newPlot(
            this.chartElement.nativeElement,
            this.products.flatMap(product => {
                return [
                    {
                        name: `${product.name} buy price`,
                        text: product.buySettlements,
                        type: 'box',
                        y: product.buyPrices,
                    },
                    {
                        name: `${product.name} sell price`,
                        text: product.sellSettlements,
                        type: 'box',
                        y: product.sellPrices,
                    },
                ];
            }),
            {
                font: {
                    color: '#fff',
                    size: 16,
                },
                showlegend: false,
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                title: {
                    text: 'Buy and sell price of all products',
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
