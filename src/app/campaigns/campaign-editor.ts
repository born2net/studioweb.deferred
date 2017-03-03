import {animate, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, state, style, transition, trigger, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {List} from "immutable";
import {Once} from "../../decorators/once-decorator";
import {ACTION_UISTATE_UPDATE, AppdbAction, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {Lib} from "../../Lib";
import {CampaignChannels} from "./campaign-channels";
import {IAddContents} from "../../interfaces/IAddContent";

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
    m_isVisible1 = true;
    m_isVisible2 = true;
    m_toggleShowChannel = true;

    constructor(private yp: YellowPepperService, private actions: AppdbAction) {
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
    }

    _onAddContent() {
        if (!this.channelModel)
            return bootbox.alert('Select channel to add content to. First be sure to select a timeline and next, click the [NEXT CHANNEL] button');
        this.onToAddContent.emit();

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
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    @Once()
    private _loadCampaignTimelines() {
        return this.yp.getCampaignTimelines(this.campaignModel.getCampaignId())
            .subscribe((m_campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                    this.m_campaignTimelinesModels = m_campaignTimelinesModels;
                }, (e) => console.error(e)
            )
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