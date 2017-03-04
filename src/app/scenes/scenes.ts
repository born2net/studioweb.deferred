import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {PLACEMENT_SCENE} from "../../interfaces/Consts";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'scenes',
    template: `
        <small class="debug" style="padding-right: 25px">{{me}}</small>
        <Sliderpanel>
            <Slideritem [templateRef]="a" #sliderItemSceneManager class="page center sceneList selected" [showToButton]="false" [toDirection]="'right'" [to]="'sceneEditor'">
                <template #a>
                    <scene-manager (slideToSceneEditor)="sliderItemSceneManager.onNext()"></scene-manager>
                </template>
            </Slideritem>
            <Slideritem [templateRef]="b" #sliderItemCampaignEditor (onChange)="_onSlideChange($event)" [showFromButton]="false" class="page left sceneEditor" [fromDirection]="'left'" [from]="'sceneList'">
                <template #b>
                    <scene-editor #sceneEditor (onToAddContent)="sliderAddContent.slideTo('addContent','right')" 
                                  (onGoBack)="sliderItemCampaignEditor.slideTo('sceneList','left')">
                    </scene-editor>
                </template>
            </Slideritem>

            <!--<Slideritem [templateRef]="h" #sliderAddContent [showFromButton]="false" class="page left addContent" [fromDirection]="'left'" [from]="'sceneList'">-->
            <!--<template #h>-->
            <!--<add-content #addContent [setPlacement]="m_placement" (onGoBack)="sliderItemCampaignEditor.slideTo('campaignEditor','left')"></add-content>-->
            <!--</template>-->
            <!--</Slideritem>-->
        </Sliderpanel>
    `
})
export class Scenes extends Compbaser {

    private m_placement = PLACEMENT_SCENE;

    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    // _onOpenScreenLayoutEditor(){
    // }
    //
    // _onSlideChange(event: ISliderItemData) {
    //     if (event.direction == 'left' && event.to == 'sceneList') {
    //         var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
    //         return this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    //     }
    //     // if (event.direction == 'right' && event.to == 'campaignEditor')
    //     //     return this._createCampaign();
    // }
    //
    // @Once()
    // private _createCampaign(i_createCampaign) {
    //     var createCampaign:IScreenTemplateData = i_createCampaign;
    //     return this.yp.getNewCampaignParmas()
    //         .subscribe((value: IUiStateCampaign) => {
    //             var campaignId = this.rp.createCampaignEntire(createCampaign.screenProps, createCampaign.name, value.campaignCreateResolution);
    //             var uiState: IUiState = {campaign: {campaignSelected: campaignId}}
    //             this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    //         }, (e) => {
    //             console.error(e)
    //         })
    // }
}

