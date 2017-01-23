import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISliderItemData} from "../../comps/sliderpanel/Slideritem";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application.state";
import {ACTION_UI_SIDE_PROPS, SideProps} from "../../store/actions/appdb.actions";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaigns',
    template: `
        <small class="debug" style="padding-left: 25px">{{me}}</small>
        <Sliderpanel>
            <Slideritem #sliderItemCampaignList class="page center campaignList selected" [showToButton]="false" [toDirection]="'left'" [to]="'campaignEditor'">
                <campaign-list (slideToCampaignName)="sliderItemCampaignList.slideTo('campaignName','left')" (slideToCampaignEditor)="sliderItemCampaignList.onNext()"></campaign-list>
            </Slideritem>
            <Slideritem class="page right campaignName" [toDirection]="'left'" [fromDirection]="'right'" [from]="'campaignList'" [to]="'campaignOrientation'">
                <campaign-name></campaign-name>
            </Slideritem>
            <Slideritem class="page right campaignOrientation" [toDirection]="'left'" [fromDirection]="'right'" [from]="'campaignName'" [to]="'campaignLayout'">
                <campaign-orientation></campaign-orientation>
            </Slideritem>
            <Slideritem class="page right campaignLayout" [toDirection]="'left'" [fromDirection]="'right'" [from]="'campaignOrientation'" [to]="'campaignEditor'">
                <campaign-layout></campaign-layout>
            </Slideritem>
            <Slideritem (onChange)="_onSlideChange($event)" class="page right campaignEditor" [fromDirection]="'right'" [from]="'campaignList'">
                <campaign-editor></campaign-editor>
            </Slideritem>
        </Sliderpanel>
    `
})
export class Campaigns extends Compbaser {
    constructor(private store: Store<ApplicationState>) {
        super();
        this.store.dispatch(({type: ACTION_UI_SIDE_PROPS, payload: SideProps.miniDashboard}))
    }

    _onSlideChange(event: ISliderItemData) {
        if (event.direction == 'right' && event.to == 'campaignList')
            this.store.dispatch(({type: ACTION_UI_SIDE_PROPS, payload: SideProps.miniDashboard}))
    }
}

