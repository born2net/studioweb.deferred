import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'campaign-name',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <input value="">
           `,
})
export class CampaignName extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}