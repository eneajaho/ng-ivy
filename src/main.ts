import { CommonModule } from "@angular/common";
import {
    ChangeDetectionStrategy, Component,
    enableProdMode, EventEmitter,
    Inject,

    InjectionToken,

    Injector, NgModule, OnInit, Output,
    SkipSelf,
    ɵrenderComponent as renderComponent
} from '@angular/core';
import { State } from "./State";

enableProdMode();

const myInjectionToken = new InjectionToken('injection-token');

@Component({
    selector: 'btn',
    template: `
        <button (click)="clicked.emit()">
            {{ token }}
            <ng-content></ng-content>
        </button>
    `,
    providers: [
        {
            provide: myInjectionToken,
            useValue: 'btn-cmp'
        }
    ]
})
export class ButtonCmp {
    @Output() clicked = new EventEmitter();

    constructor(@SkipSelf() @Inject(myInjectionToken) public token: string) { }

}

@Component({
    selector: 'app',
    template: `
        <div class="big">Counter: {{ state.count }}</div>
        <div>Count is {{ state.count < 0 ? 'lower' : 'bigger'}} than 0</div>
        <div *ngIf="state.win > 0">
            You have won {{ state.win }}
            {{ state.win === 1 ? 'time' : 'times' }}.
        </div>
        <br>
        <btn (clicked)="setState({ count: state.count + 1 })">Increase</btn>
        <btn (clicked)="setState({ count: state.count - 1 })">Decrease</btn>
        <btn (clicked)="setState({ count: 0 })">Zero</btn>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // {
        //     provide: myInjectionToken,
        //     useValue: 'app-cmp'
        // }
    ]
})
export class AppCmp extends State<{ count, win }> implements OnInit {

    constructor(@Inject(myInjectionToken) public token: string) {
        super({ count: 0, win: 0 });
    }

    ngOnInit(): void {
        this.changes$.subscribe(x => {
            if (x.count > 3) {
                console.log('here');
                // this will cause infinite loop and the app will crash
                this.setState({ win: this.state.win + 1 });
            }
        })
    }
}


const injector = Injector.create({
    providers: [{
        provide: myInjectionToken,
        useValue: 'root injector'
    }]
});


renderComponent(AppCmp, { injector });

@NgModule({
    imports: [CommonModule],
    declarations: [ButtonCmp, AppCmp]
})
export class MainModule {
}
