import {BreakpointObserver} from '@angular/cdk/layout';
import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

import {initErrorMessages} from './error/messages/message-init';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {

    @HostBinding('style.top') top: string;

    private readonly destroyed = new ReplaySubject<void>(1);

    constructor(
        private readonly breakpointObserver: BreakpointObserver,
    ) {
    }

    ngOnDestroy(): void {
        this.destroyed.next();
        this.destroyed.complete();
    }

    ngOnInit(): void {
        this.breakpointObserver.observe('(max-width: 599px)').pipe(
            map(value => value.matches ? 56 : 64),
            map(value => `${value}px`),
            takeUntil(this.destroyed),
        ).subscribe(top => {
            this.top = top;
        });

        initErrorMessages();
    }
}
