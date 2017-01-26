import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISliderItemData} from "../../comps/sliderpanel/Slideritem";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application.state";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {IScreenTemplateData} from "../../comps/screen-template/screen-template";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaigns',
    template: `
        <small class="debug" style="padding-right: 25px">{{me}}</small>
        <Sliderpanel>
            <Slideritem #sliderItemCampaignManager class="page center campaignList selected" [showToButton]="false" [toDirection]="'right'" [to]="'campaignEditor'">
                <campaign-manager (slideToCampaignName)="sliderItemCampaignManager.slideTo('campaignName','right')" (slideToCampaignEditor)="sliderItemCampaignManager.onNext()"></campaign-manager>
            </Slideritem>
            <Slideritem class="page left campaignName" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignList'" [to]="'campaignOrientation'">
                <campaign-name #campaignName></campaign-name>
            </Slideritem>
            <Slideritem  #sliderItemCampaignOrientation class="page left campaignOrientation" [showToButton]="false" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignName'" [to]="'campaignResolution'">
                <campaign-orientation #campaignOrientation (onSelection)="sliderItemCampaignOrientation.onNext()"></campaign-orientation>
            </Slideritem>
            <Slideritem #sliderItemCampaignResolution class="page left campaignResolution" [showToButton]="false" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignOrientation'" [to]="'campaignLayout'">
                <campaign-resolution #campaignResolution (onSelection)="sliderItemCampaignResolution.onNext()" [setOrientation]="campaignOrientation.getOrientationChanged" ></campaign-resolution>
            </Slideritem>
            <Slideritem #sliderItemCampaignLayout (onChange)="_onSlideChange($event)" class="page left campaignLayout" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignResolution'" [to]="'campaignEditor'">
                <campaign-layout (onSelection)="sliderItemCampaignLayout.onNext(); _createCampaign($event)" [setCampaignName]="campaignName.getCampaignNameChanged" [setOrientation]="campaignOrientation.getOrientationChanged" [setResolution]="campaignResolution.getResolutionChanged"></campaign-layout>
            </Slideritem>
            <Slideritem (onChange)="_onSlideChange($event)" class="page left campaignEditor" [fromDirection]="'left'" [from]="'campaignList'">
                <campaign-editor></campaign-editor>
            </Slideritem>
        </Sliderpanel>
    `
})
export class Campaigns extends Compbaser {
    constructor(private store: Store<ApplicationState>) {
        super();
        var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        this.store.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _onSlideChange(event: ISliderItemData) {
        if (event.direction == 'left' && event.to == 'campaignList') {
            var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
            return this.store.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        }

        // if (event.direction == 'right' && event.to == 'campaignEditor')
        //     return this._createCampaign();
    }



    private _createCampaign(createCampaign:IScreenTemplateData){
        console.log('creating campaign... ' + createCampaign);
    }

}

