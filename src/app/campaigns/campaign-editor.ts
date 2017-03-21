import {animate, ChangeDetectionStrategy, Component, EventEmitter, Output, state, style, transition, trigger} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt, CampaignTimelineChanelPlayersModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {List} from "immutable";
import {Once} from "../../decorators/once-decorator";
import {ACTION_UISTATE_UPDATE, AppdbAction, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {Lib} from "../../Lib";
import {PreviewModeEnum} from "../live-preview/live-preview";
import * as _ from "lodash";
import {RedPepperService} from "../../services/redpepper.service";
import {MainAppShowStateEnum} from "../app-component";

@Component({
    selector: 'campaign-editor',
    templateUrl: './campaign-editors.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('visibilityChanged1', [
            state('true', style({transform: 'rotate(0deg)'})),
            state('false', style({transform: 'rotate(180deg)'})),
            transition('1 => 0', animate('300ms')),
            transition('0 => 1', animate('300ms'))
        ]),
        trigger('visibilityChanged2', [
            state('true', style({transform: 'rotate(0deg)'})),
            state('false', style({transform: 'rotate(180deg)'})),
            transition('1 => 0', animate('300ms')),
            transition('0 => 1', animate('300ms'))
        ])
    ],
})

export class CampaignEditor extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private campaignTimelinesModel: CampaignTimelinesModel;
    private channelModel: CampaignTimelineChanelsModel;

    m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    m_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModelExt;
    m_isVisible1 = true;
    m_isVisible2 = true;
    m_toggleShowChannel = true;

    constructor(private yp: YellowPepperService, private actions: AppdbAction, private rp: RedPepperService) {
        super();
        this.cancelOnDestroy(
            this.yp.listenCampaignSelected()
                .subscribe((i_campaignsModelExt: CampaignsModelExt) => {
                    Lib.Try(() => {
                        if (!i_campaignsModelExt)
                            return;
                        this.campaignModel = i_campaignsModelExt;
                        this._loadCampaignTimelines();
                    })
                }, (e) => console.error(e))
        );
        this.cancelOnDestroy(
            this.yp.listenTimelineSelected(false)
                .subscribe((i_campaignTimelinesModel: CampaignTimelinesModel) => {
                    this.campaignTimelinesModel = i_campaignTimelinesModel;
                }, (e) => console.error(e))
        );
        this.cancelOnDestroy(
            this.yp.listenChannelSelected(true)
                .subscribe((channel: CampaignTimelineChanelsModel) => {
                    this.channelModel = channel;
                }, (e) => {
                    console.error(e)
                })
        );
        this.cancelOnDestroy(
            this.yp.listenBlockChannelSelected(true)
                .subscribe((i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModelExt) => {
                    this.m_campaignTimelineChanelPlayersModel = i_campaignTimelineChanelPlayersModel;
                }, (e) => console.error(e))
        )
    }

    _onAddContent() {
        if (!this.channelModel)
            return bootbox.alert('Select channel to add content to. First be sure to select a timeline and next, click the [Next Channel] button');
        this.onToAddContent.emit();

    }

    _onAddTimeline(){
        this.onToAddTimeline.emit();
    }

    _onEditScreenLayout() {
        if (!this.campaignTimelinesModel)
            return bootbox.alert('no timeline selected')
        var uiState: IUiState = {uiSideProps: SideProps.screenLayoutEditor}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        this.onToScreenLayoutEditor.emit();
    }

    @Output()
    onToScreenLayoutEditor: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onToAddContent: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onToAddTimeline: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    @Once()
    private _loadCampaignTimelines() {
        return this.yp.getCampaignTimelines(this.campaignModel.getCampaignId())
            .subscribe((m_campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                    this.m_campaignTimelinesModels = m_campaignTimelinesModels;
                }, (e) => console.error(e)
            )
    }

    /**
     Delete the selected block from the channel
     @method _deleteChannelBlock
     @return none
     **/
    _onRemoveContent() {
        if (!this.m_campaignTimelineChanelPlayersModel)
            return bootbox.alert('No item selected');
        this.rp.removeBlockFromTimelineChannel(this.m_campaignTimelineChanelPlayersModel.getCampaignTimelineChanelPlayerId());
        this.rp.reduxCommit();
        let uiState: IUiState = {
            uiSideProps: SideProps.miniDashboard,
            campaign: {
                blockChannelSelected: -1
            }
        }
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _onCampaignPreview() {
        let uiState: IUiState = {mainAppState: MainAppShowStateEnum.SAVE_AND_PREVIEW, previewMode: PreviewModeEnum.CAMPAIGN}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _onTimelinePreview() {
        if (_.isUndefined(this.campaignTimelinesModel))
            return bootbox.alert('No timeline selected');
        let uiState: IUiState = {mainAppState: MainAppShowStateEnum.SAVE_AND_PREVIEW, previewMode: PreviewModeEnum.TIMELINE}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _onGoBack() {
        this.actions.resetCampaignSelection();
        this.onGoBack.emit()
    }

    ngOnInit() {
    }

    destroy() {
    }
}