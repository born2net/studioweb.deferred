import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import {OrientationEnum} from "./campaign-orientation";
import {timeout} from "../../decorators/timeout-decorator";

@Component({
    selector: 'campaign-resolution',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<small class="debug">{{me}}</small>
                <h4>screen resolution</h4>
                <div (click)="$event.preventDefault()">
                    <a (click)="_onSelection(screen)" href="#" class="list-group-item" *ngFor="let screen of screens">
                        <label class="screenResolutionLabel">{{screen}}</label>
                    </a>
                </div>
           `,
})
export class CampaignResolution extends Compbaser {

    constructor() {
        super();
    }

    @Output()
    onSelection: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    set setOrientation(i_orientation: OrientationEnum) {
        this.screens = [];
        var orientation = i_orientation == OrientationEnum.HORIZONTAL ? 'HORIZONTAL' : 'VERTICAL';
        for (var screenResolution in screenTemplates[orientation]) {
            this.screens.push(screenResolution)
        }
    }

    private screens: Array<any>;
    private m_resolution: string;

    _onSelection(i_resolution: string) {
        this.m_resolution = i_resolution;
        this._next();
    }

    @timeout(800)
    private _next() {
        this.onSelection.emit(this.m_resolution)
    }

    public getResolution() {
        return this.m_resolution;
    }


    ngOnInit() {
    }

    destroy() {
    }
}