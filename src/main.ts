import {
    ChangeDetectionStrategy,
    Component,
    enableProdMode,
    EventEmitter,
    HostListener,
    NgModule,
    OnInit,
    Output,
    ɵrenderComponent as renderComponent
} from '@angular/core';
import { CommonModule } from "@angular/common";
import { State } from "./State";

enableProdMode();

@Component({
    selector: 'btn',
    template: `
        <button>
            <ng-content></ng-content>
        </button>
    `
})
export class ButtonCmp {
    @Output() clicked = new EventEmitter<boolean>();

    @HostListener('click')
    onClick() {
        this.clicked.emit(true)
    }
}

export interface GameState {
    count: number;
    win: number;
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppCmp extends State<GameState> implements OnInit {

    constructor() {
        super({ count: 0, win: 0 });
    }

    ngOnInit(): void {
        // this will cause infinite loop
        this.changes$.subscribe(x => {
            if (x.count > 10) {
                this.setState({ win: this.state.win + 1 });
            }
        })
    }
}

renderComponent(AppCmp);

@NgModule({
    imports: [ CommonModule ],
    declarations: [ ButtonCmp, AppCmp ]
})
export class MainModule {
}
