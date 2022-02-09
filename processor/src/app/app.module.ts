import {ClipboardModule} from '@angular/cdk/clipboard';
import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import locale from '@angular/common/locales/en-BE';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {Decoverto} from 'decoverto';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NotFoundComponent} from './error/not-found/not-found.component';
import {HeaderComponent} from './layout/header/header.component';
import {ProductChartComponent} from './stats/product-chart/product-chart.component';
import {StatsComponent} from './stats/stats.component';
import {decoverto} from './utils/decoverto.util';

registerLocaleData(locale);

const matFormFieldDefaultOptions: MatFormFieldDefaultOptions = {
    appearance: 'outline',
};

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        NotFoundComponent,
        StatsComponent,
        ProductChartComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AngularSvgIconModule.forRoot(),
        ClipboardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [
        {provide: Decoverto, useValue: decoverto},
        {provide: LOCALE_ID, useValue: 'en-BE'},
        {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: matFormFieldDefaultOptions},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
