import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NotFoundComponent} from './error/not-found/not-found.component';
import {StatsComponent} from './stats/stats.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: StatsComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
