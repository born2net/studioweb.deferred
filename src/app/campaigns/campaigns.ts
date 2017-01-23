import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaigns',
    template: `
        <small class="debug" style="padding-left: 25px">{{me}}</small>
        <Sliderpanel>
            <Slideritem #sliderItemCampaignList class="page center screen1 selected" [showToButton]="false" [toDirection]="'left'" [to]="'screen5'">
                <campaign-list (slideToCampaignName)="sliderItemNotDisplayed.onNext()" (slideToCampaignEditor)="sliderItemCampaignList.onNext()"></campaign-list>
            </Slideritem>
            <Slideritem #sliderItemNotDisplayed class="page right sliderItemNotDisplayed" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen1'" [to]="'screen2'">
                <!-- nothing will show here as we use this component as a jumping point -->
            </Slideritem>
            <Slideritem class="page right screen2" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen1'" [to]="'screen3'">
                <campaign-name></campaign-name>
            </Slideritem>
            <Slideritem class="page right screen3" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen2'" [to]="'screen4'">
                <campaign-orientation></campaign-orientation>
            </Slideritem>
            <Slideritem class="page right screen4" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen3'" [to]="'screen5'">
                <campaign-layout></campaign-layout>
            </Slideritem>
            <Slideritem class="page right screen5" [fromDirection]="'right'" [from]="'screen1'">
                <campaign-editor></campaign-editor>
            </Slideritem>
        </Sliderpanel>
    `
})
export class Campaigns extends Compbaser {
    constructor() {
        super();
    }
}

