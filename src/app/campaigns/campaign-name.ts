import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'campaign-name',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <h3 data-localize="selectCampaignName">Select your campaign name</h3>
                <input id="newCampaignName" style="width: 50%" 
                type="text" class="form-control" 
                value="My campaign" placeholder="Enter new campaign name">
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