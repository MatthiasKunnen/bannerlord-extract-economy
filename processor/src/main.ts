import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import 'reflect-metadata';

import {AppModule} from './app/app.module';
import {Logger} from './app/utils/logger.util';
import {environment} from './environments/environment';

async function start() {
    if (environment.production) {
        enableProdMode();
    }

    await platformBrowserDynamic().bootstrapModule(AppModule);
}

start().catch(err => {
    Logger.error({
        error: err,
        message: 'Error during startup',
    });
    document.body.innerHTML = `
        <p>An error occurred while loading the application.</p>
        <p>
            The error has been logged and will be looked at soon. If the issue persists contact
            the developer.
        </p>
    `;
});
