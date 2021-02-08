import { ɵmarkDirty as markDirty } from "@angular/core"
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";

export abstract class State<T> {
    private _state: T | undefined;

    private changes: BehaviorSubject<T | undefined>;
    public readonly changes$: Observable<T | undefined>;

    readonly destroy = new Subject<boolean>();

    protected constructor(initialState?: T) {
        this._state = initialState ?? undefined;
        this.changes = new BehaviorSubject(this._state);
        this.changes$ = this.changes.asObservable().pipe(
            takeUntil(this.destroy),
            distinctUntilChanged()
        );
    }

    setState(newState: Partial<T>): void {
        this._state = { ...this.state, ...newState };
        this.changes.next(this._state);
        markDirty(this);
    }

    get state(): T | undefined {
        return this._state;
    }
}
