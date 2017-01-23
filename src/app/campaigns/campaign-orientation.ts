import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'campaign-orientation',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <h4>screen orientation</h4>
           `,
})
export class CampaignOrientation extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}