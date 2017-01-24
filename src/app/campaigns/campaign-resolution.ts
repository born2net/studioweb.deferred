import {Component, ChangeDetectionStrategy, Input} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import * as _ from 'lodash';
import {OrientationEnum} from "./campaign-orientation";

@Component({
    selector: 'campaign-resolution',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <h4>screen resolution</h4>
                
           `,
})
export class CampaignResolution extends Compbaser {

    constructor() {
        super();
    }

    @Input()
    set setOrientation(i_orientation: OrientationEnum) {
        console.log(i_orientation);
    }

    ngOnInit() {
    }

    destroy() {
    }
}