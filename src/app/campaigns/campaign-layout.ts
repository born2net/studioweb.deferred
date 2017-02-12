import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import * as _ from 'lodash';
import {OrientationEnum} from "./campaign-orientation";
import {IScreenTemplateData, ScreenTemplate} from "../../comps/screen-template/screen-template";
import {Observable, Observer} from "rxjs";
import {Once} from "../../decorators/once-decorator";
import {IUiStateCampaign} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'campaign-layout',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        :host > > > .svgSD {
            cursor: pointer;
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
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
    m_screenLayouts: Array<IScreenTemplateData>;
    m_campaignName: string;

    constructor(private yp: YellowPepperService) {
        super();
        this.getNewCampaignParams();

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
                }).subscribe(() => {
            }, (e) => console.error(e))
        )
    }

    @Once()
    private getNewCampaignParams() {
        return this.yp.getNewCampaignParmas()
            .subscribe((value: IUiStateCampaign) => {
                this.m_resolution = value.campaignCreateResolution;
                this.m_orientation = value.campaignCreateOrientation;
                this.m_campaignName = value.campaignCreateName;
                this._render();
            }, (e) => console.error(e))
    }


    @Output()
    onSelection: EventEmitter<IScreenTemplateData> = new EventEmitter<IScreenTemplateData>();


    private _render() {
        if (_.isUndefined(this.m_orientation) || _.isUndefined(this.m_resolution))
            return;
        this.m_screenLayouts = [];
        for (var screenType in screenTemplates[this.m_orientation][this.m_resolution]) {
            var screenTemplateData: IScreenTemplateData = {
                orientation: this.m_orientation,
                resolution: this.m_resolution,
                screenType: screenType,
                screenProps: screenTemplates[this.m_orientation][this.m_resolution][screenType],
                scale: 14,
                name: this.m_campaignName
            };
            this.m_screenLayouts.push(screenTemplateData);
        }
    }

    ngOnInit() {
    }

    destroy() {
    }
}