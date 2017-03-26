import {ChangeDetectionStrategy, Component, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISliderItemData, Slideritem} from "../../comps/sliderpanel/Slideritem";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {IUiState, IUiStateCampaign} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {Once} from "../../decorators/once-decorator";
import {PLACEMENT_CHANNEL} from "../../interfaces/Consts";
import {IAddContents} from "../../interfaces/IAddContent";
import {CampaignTimelineBoardViewerChanelsModel} from "../../store/imsdb.interfaces_auto";
import {BlockService} from "../blocks/block-service";
import {IScreenTemplateData} from "../../interfaces/IScreenTemplate";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'resources',
    template: `
        <small class="debug">{{me}}</small>
        <div id="resourcesPanel">
            <label class="myFile">
                <button type="button" class="btn btn-danger">
                    <i style="font-size: 1em" class="fa fa-plus"></i>
                    <span i18n>upload files</span>
                </button>
                <input type="file" accept=".flv,.mp4,.jpg,.png,.swf,.svg"/>
            </label>
            <div class="btn-group">
                <button type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-minus"></i>
                    <span i18n>remove</span>
                </button>
                <button type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-list"></i>
                    <span i18n>list</span>
                </button>
                <button type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-table"></i>
                    <span i18n>grid</span>
                </button>
                <input style="width: 200px" id="resourcesFilterList" class="form-control" placeholder="search for" required="">
            </div>
            <h5 i18n>supported files: flv, mp4, jpg, png, swf and svg</h5>
            <div id="resourceLibListWrap">
                <ul id="resourceLibList" class="list-group row"></ul>
            </div>
        </div>
    `,
    styles: [`
        * {
            border-radius: 0 !important;
        }
        #resourcesPanel {
            padding: 10px;
        }
        
        .myFile {
            position: relative;
            overflow: hidden;
            float: left;
            clear: left;
        }

        .myFile input[type="file"] {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            opacity: 0;
            font-size: 100px;
            filter: alpha(opacity=0);
            cursor: pointer;
        }
        /*.resourcesListItems i {*/
            /*font-size: 40px;*/
            /*display: inline;*/
            /*padding-right: 20px;*/
        /*}*/
        
        /*.resourcesListItems span {*/
            /*display: inline;*/
            /*font-size: 1.5em;*/
            /*position: relative;*/
            /*top: -12px;*/
        /*}*/
        
        /*.resourcePreview {*/
            /*width: 200px;*/
            /*margin-top: 30px;*/
            /*background-color: #e3e3e3;*/
            /*height: 500px;*/
            /*border: 1px solid #a8a8a8;*/
        /*}*/
    `]
})

export class Resources extends Compbaser {


    // constructor(private yp: YellowPepperService, private rp: RedPepperService, private bs: BlockService) {
    //     super();
    //
    //     this.cancelOnDestroy(
    //         //
    //         this.yp.listenCampaignTimelineBoardViewerSelected()
    //             .subscribe((i_campaignTimelineBoardViewerChanelsModel: CampaignTimelineBoardViewerChanelsModel) => {
    //                 this.m_selected_campaign_timeline_chanel_id = i_campaignTimelineBoardViewerChanelsModel.getCampaignTimelineChanelId();
    //             }, (e) => console.error(e))
    //     )
    //
    //     this.cancelOnDestroy(
    //         //
    //         this.yp.listenLocationMapLoad()
    //             .subscribe((v) => {
    //                 if (v && this.sliderItemCampaignEditor){
    //                     this.sliderItemCampaignEditor.slideTo('locationMap','right');
    //                 }
    //             }, (e) => console.error(e))
    //
    //     )
    //
    //     var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
    //     this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    // }
    //
    // @ViewChild('sliderItemCampaignEditor')
    // sliderItemCampaignEditor:Slideritem;
    //
    // _onOpenScreenLayoutEditor() {
    // }
    //
    // _onAddedContent(i_addContents: IAddContents) {
    //     this.cancelOnDestroy(
    //         //
    //         this.yp.getTotalDurationChannel(this.m_selected_campaign_timeline_chanel_id)
    //             .subscribe((i_totalChannelLength) => {
    //                 var boilerPlate = this.bs.getBlockBoilerplate(i_addContents.blockCode);
    //                 this._createNewChannelBlock(i_addContents, boilerPlate, i_totalChannelLength);
    //             }, (e) => console.error(e))
    //     )
    // }
    //
    // _onLocationMapClosed(){
    //     this.sliderItemCampaignEditor.slideTo('campaignEditor','left')
    //
    // }
    //
    // _onAddedContentClosed(){
    //     var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
    //     this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    // }
    //
    // /**
    //  Create a new block (player) on the current channel and refresh UI bindings such as properties open events.
    //  **/
    // _createNewChannelBlock(i_addContents: IAddContents, i_boilerPlate, i_totalChannelLength) {
    //     this.rp.createNewChannelPlayer(this.m_selected_campaign_timeline_chanel_id, i_addContents, i_boilerPlate, i_totalChannelLength);
    //     this.rp.reduxCommit();
    // }
    //
    // _onSlideChange(event: ISliderItemData) {
    //     if (event.direction == 'left' && event.to == 'campaignList') {
    //         var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
    //         return this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    //     }
    //     // if (event.direction == 'right' && event.to == 'campaignEditor')
    //     //     return this._createCampaign();
    // }
    //
    // @Once()
    // private _addTimelineToCampaign(i_screenTemplateData: IScreenTemplateData) {
    //     return this.yp.getNewCampaignParmas()
    //         .subscribe((value: IUiStateCampaign) => {
    //             var campaign_board_id = this.rp.getFirstBoardIDofCampaign(value.campaignSelected);
    //             var board_id = this.rp.getBoardFromCampaignBoard(campaign_board_id);
    //             var newTemplateData = this.rp.createNewTemplate(board_id, i_screenTemplateData.screenProps);
    //             var board_template_id = newTemplateData['board_template_id']
    //             var viewers = newTemplateData['viewers'];
    //             var campaign_timeline_id = this.rp.createNewTimeline(value.campaignSelected);
    //             this.rp.setCampaignTimelineSequencerIndex(value.campaignSelected, campaign_timeline_id, 0);
    //             this.rp.setTimelineTotalDuration(campaign_timeline_id, '0');
    //             this.rp.createCampaignTimelineScheduler(value.campaignSelected, campaign_timeline_id);
    //             var campaign_timeline_board_template_id = this.rp.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
    //             var channels = this.rp.createTimelineChannels(campaign_timeline_id, viewers);
    //             this.rp.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);
    //             this.rp.reduxCommit();
    //         }, (e) => {
    //             console.error(e)
    //         })
    // }
    //
    // @Once()
    // private _createCampaign(i_screenTemplateData: IScreenTemplateData) {
    //     return this.yp.getNewCampaignParmas()
    //         .subscribe((value: IUiStateCampaign) => {
    //             var campaignId = this.rp.createCampaignEntire(i_screenTemplateData.screenProps, i_screenTemplateData.name, value.campaignCreateResolution);
    //             var uiState: IUiState = {campaign: {campaignSelected: campaignId}}
    //             this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    //         }, (e) => {
    //             console.error(e)
    //         })
    // }
}

