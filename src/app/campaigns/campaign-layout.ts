import {Component, ChangeDetectionStrategy, Input} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import * as _ from 'lodash';
import {OrientationEnum} from "./campaign-orientation";
import {IScreenTemplateData} from "../../comps/screen-template/screen-template";

@Component({
    selector: 'campaign-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<small class="debug">{{me}}</small>
               <h4>screen layout</h4>
                    <ul>
                        <li *ngFor="let screenLayout of m_screenLayouts">
                            <screen-template [setTemplate]="screenLayout"></screen-template>
                        </li>
                    </ul>
                
           `,
})
export class CampaignLayout extends Compbaser {

    private m_resolution: string;
    private m_orientation: OrientationEnum
    private m_screenLayouts: Array<IScreenTemplateData>;

    constructor() {
        super();
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

    private _render() {
        if (_.isUndefined(this.m_orientation) || _.isUndefined(this.m_resolution))
            return;
        console.log('rendering' + this.m_resolution + ' ' + this.m_orientation);
        this.m_screenLayouts = [];
        for (var screenType in screenTemplates[this.m_orientation][this.m_resolution]) {

            var screenTemplateData: IScreenTemplateData = {
                i_owner: null,
                i_selfDestruct: true,
                orientation: this.m_orientation,
                resolution: this.m_resolution,
                screenType: screenType,
                screenProps: screenTemplates[this.m_orientation][this.m_resolution][screenType],
                scale: 14
            };
            this.m_screenLayouts.push(screenTemplateData);

            // var screenTemplate = new ScreenTemplateFactory({
            //     i_screenTemplateData: screenTemplateData,
            //     i_selfDestruct: true,
            //     i_owner: self
            // });
            // var snippet = screenTemplate.create();
            // $(Elements.SCREEN_LAYOUT_LIST).append($(snippet));
            // screenTemplate.selectableFrame();
            // self.m_screens.push(screenTemplate);
        }
    }

    ngOnInit() {
    }

    destroy() {
    }
}