import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'campaign-name',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <h3 i18n>Select your campaign name</h3>
                <input id="newCampaignName" style="width: 50%" [(ngModel)]="m_campaignName" 
                type="text" class="form-control" 
                value="My campaign" i18n-placeholder placeholder="Enter new campaign name">
           `,
})
export class CampaignName extends Compbaser {

    constructor() {
        super();
    }

    m_campaignName:string = '';

    public get getCampaignNameChanged(): string {
        return this.m_campaignName;
    }

    ngOnInit() {
    }


}