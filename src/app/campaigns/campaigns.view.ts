import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'CampaignsView',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="release">campaigns
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
               <small class="debug">{{me}}</small>
           `,
})
export class CampaignsView extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}