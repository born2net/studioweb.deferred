import {Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISliderItemData} from "../../comps/sliderpanel/Slideritem";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {IUiState, IUiStateCampaign} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {Once} from "../../decorators/once-decorator";
import {IScreenTemplateData} from "../../comps/screen-template/screen-template";

@Component({
    // changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaigns',
    template: `
        <small class="debug" style="padding-right: 25px">{{me}}</small>
        <Sliderpanel>
            <Slideritem [templateRef]="a" #sliderItemCampaignManager class="page center campaignList selected" [showToButton]="false" [toDirection]="'right'" [to]="'campaignEditor'">
                <template #a>
                    <campaign-manager (slideToCampaignName)="sliderItemCampaignManager.slideTo('campaignName','right')" (slideToCampaignEditor)="sliderItemCampaignManager.onNext()"></campaign-manager>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="b" class="page left campaignName" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignList'" [to]="'campaignOrientation'">
                <template #b>
                    <campaign-name #campaignName></campaign-name>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="c" #sliderItemCampaignOrientation class="page left campaignOrientation" [showToButton]="false" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignName'" [to]="'campaignResolution'">
                <template #c>
                    <campaign-orientation #campaignOrientation (onSelection)="sliderItemCampaignOrientation.onNext()"></campaign-orientation>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="d" #sliderItemCampaignResolution class="page left campaignResolution" [showToButton]="false" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignOrientation'" [to]="'campaignLayout'">
                <template #d>
                    <campaign-resolution #campaignResolution (onSelection)="sliderItemCampaignResolution.onNext()"></campaign-resolution>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="e" #sliderItemCampaignLayout (onChange)="_onSlideChange($event)" class="page left campaignLayout" [toDirection]="'right'" [fromDirection]="'left'" [from]="'campaignResolution'" [to]="'campaignEditor'">
                <template #e>
                    <campaign-layout (onSelection)="sliderItemCampaignLayout.onNext(); _createCampaign($event)"></campaign-layout>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="f" #sliderItemCampaignEditor (onChange)="_onSlideChange($event)" [showFromButton]="false" class="page left campaignEditor" [fromDirection]="'left'" [from]="'campaignList'">
                <template #f>
                    <campaign-editor (onToScreenLayoutEditor)="screenLayoutEditor.show() ; sliderScreenLayoutEditor.slideTo('screenLayoutEditor','right')" (onGoBack)="sliderItemCampaignEditor.slideTo('campaignList','left')"></campaign-editor>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="g" #sliderScreenLayoutEditor (onChange)="_onSlideChange($event)" [showFromButton]="false" class="page left screenLayoutEditor" [fromDirection]="'left'" [from]="'campaignList'">
                <template #g>
                    <screen-layout-editor #screenLayoutEditor (onGoBack)="sliderItemCampaignEditor.slideTo('campaignEditor','left')"></screen-layout-editor>
                </template>
            </Slideritem>
        </Sliderpanel>
    `
})
export class Campaigns extends Compbaser {
    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _onSlideChange(event: ISliderItemData) {
        if (event.direction == 'left' && event.to == 'campaignList') {
            var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
            return this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        }
        // if (event.direction == 'right' && event.to == 'campaignEditor')
        //     return this._createCampaign();
    }

    @Once()
    private _createCampaign(i_createCampaign) {
        var createCampaign:IScreenTemplateData = i_createCampaign;
        return this.yp.getNewCampaignParmas()
            .subscribe((value: IUiStateCampaign) => {
                var campaignId = this.rp.createCampaignEntire(createCampaign.screenProps, createCampaign.name, value.campaignCreateResolution);
                var uiState: IUiState = {campaign: {campaignSelected: campaignId}}
                this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
            })
    }
}

