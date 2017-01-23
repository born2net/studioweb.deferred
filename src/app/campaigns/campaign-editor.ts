import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'campaign-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <h4>campaign editor</h4>
           `,
})
export class CampaignEditor extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}