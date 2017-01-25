import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import {OrientationEnum} from "./campaign-orientation";
import {timeout} from "../../decorators/timeout-decorator";
import {Observable, Observer} from "rxjs";

@Component({
    selector: 'campaign-resolution',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<small class="debug">{{me}}</small>
                <h4>screen resolution</h4>
                <div (click)="$event.preventDefault()">
                    <a (click)="_nextClick.next(screen)" href="#" class="list-group-item" *ngFor="let screen of screens">
                        <label class="screenResolutionLabel">{{screen}}</label>
                    </a>
                </div>
           `,
})
export class CampaignResolution extends Compbaser {

    private screens: Array<any>;
    private m_resolution: string;
    _nextClick: Observer<any>;

    constructor() {
        super();
        this.cancelOnDestroy(
            Observable.create(observer => {
                this._nextClick = observer
            }).map((m_resolution) => {
                this.m_resolution = m_resolution;
            })
                .debounceTime(800)
                .do(() => {
                    this.onSelection.emit(this.m_resolution)
                }).subscribe()
        )
    }

    @Output()
    onSelection: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    set setOrientation(i_orientation: OrientationEnum) {
        this.screens = [];
        var orientation:OrientationEnum = i_orientation;
        for (var screenResolution in screenTemplates[orientation]) {
            this.screens.push(screenResolution)
        }
    }

    public get getResolutionChanged(): string {
        return this.m_resolution;
    }

    ngOnInit() {
    }

    destroy() {
    }
}