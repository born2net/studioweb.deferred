import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import * as _ from 'lodash';

@Component({
    selector: 'campaign-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <h4>screen layout</h4>
           `,
})
export class CampaignLayout extends Compbaser {

    constructor() {
        super();
        _.forEach(screenTemplates,(v,k)=>{
            console.log('a'+k,v);
        })
    }

    ngOnInit() {
    }

    destroy() {
    }
}