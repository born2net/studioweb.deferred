import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import * as _ from 'lodash';
import {OrientationEnum} from "./campaign-orientation";
import {IScreenTemplateData, ScreenTemplate} from "../../comps/screen-template/screen-template";
import {Observable, Observer} from "rxjs";

@Component({
    selector: 'campaign-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<small class="debug">{{me}}</small>
               <h4 i18n>screen layout</h4>
                <div (click)="_nextClick.next(screenLayout)" style="float: left; padding: 20px" *ngFor="let screenLayout of m_screenLayouts">
                    <screen-template [setTemplate]="screenLayout"></screen-template>
                </div>
                
           `,
})
export class CampaignLayout extends Compbaser {

    _nextClick: Observer<any>;
    private m_resolution: string;
    private m_screenTemplateData: IScreenTemplateData;
    private m_orientation: OrientationEnum
    private m_screenLayouts: Array<IScreenTemplateData>;
    private m_campainName: string;

    constructor() {
        super();
        this.cancelOnDestroy(
            Observable.create(observer => {
                this._nextClick = observer
            }).map((i_screenTemplateData: IScreenTemplateData) => {
                this.m_screenTemplateData = i_screenTemplateData;
                return i_screenTemplateData;
            })
                .debounceTime(800)
                .do(() => {
                    this.onSelection.emit(this.m_screenTemplateData)
                }).subscribe()
        )
    }

    @Input()
    set setResolution(i_resolution: string) {
        this.m_resolution = i_resolution;
        this._render();
    }

    @Input()
    set setOrientation(i_orientation: OrientationEnum) {
        this.m_orientation = i_orientation;
        this._render();
    }

    @Input()
    set setCampaignName(i_campaignName:string) {
        this.m_campainName = i_campaignName;
    }

    @Output()
    onSelection: EventEmitter<IScreenTemplateData> = new EventEmitter<IScreenTemplateData>();


    private _render() {
        if (_.isUndefined(this.m_orientation) || _.isUndefined(this.m_resolution))
            return;
        this.m_screenLayouts = [];
        for (var screenType in screenTemplates[this.m_orientation][this.m_resolution]) {
            var screenTemplateData: IScreenTemplateData = {
                i_owner: null,
                i_selfDestruct: true,
                orientation: this.m_orientation,
                resolution: this.m_resolution,
                screenType: screenType,
                screenProps: screenTemplates[this.m_orientation][this.m_resolution][screenType],
                scale: 14,
                campaignName: this.m_campainName
            };
            this.m_screenLayouts.push(screenTemplateData);
        }
    }

    ngOnInit() {
    }

    destroy() {
    }
}