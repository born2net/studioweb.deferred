import {animate, Component, EventEmitter, Output, state, style, transition, trigger} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {List} from "immutable";
import {Once} from "../../decorators/once-decorator";
import {ACTION_UISTATE_UPDATE, AppdbAction, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {stat} from "fs";
import {BlockService} from "../blocks/block-service";

@Component({
    selector: 'campaign-editor',
    templateUrl: './campaign-editors.html',
    animations: [
        trigger('visibilityChanged1', [
            state('true' , style({ transform: 'rotate(0deg)' })),
            state('false', style({ transform: 'rotate(180deg)'  })),
            transition('1 => 0', animate('300ms')),
            transition('0 => 1', animate('300ms'))
        ]),
        trigger('visibilityChanged2', [
            state('true' , style({ transform: 'rotate(0deg)' })),
            state('false', style({ transform: 'rotate(180deg)'  })),
            transition('1 => 0', animate('300ms')),
            transition('0 => 1', animate('300ms'))
        ])
    ],
})
export class CampaignEditor extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private campaignTimelinesModel: CampaignTimelinesModel;
    m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    m_isVisible1 = true;
    m_isVisible2 = true;

    constructor(private yp: YellowPepperService, private actions:AppdbAction) {
        super();
        this.cancelOnDestroy(
            this.yp.listenCampaignSelected()
                .subscribe((i_campaignsModelExt: CampaignsModelExt) => {
                    if (!i_campaignsModelExt)
                        return;
                    this.campaignModel = i_campaignsModelExt;
                    this._loadCampaignTimelines();
                })
        );
        this.cancelOnDestroy(
            this.yp.listenTimelineSelected(false)
                .subscribe((i_campaignTimelinesModel: CampaignTimelinesModel) => {
                    this.campaignTimelinesModel = i_campaignTimelinesModel;
                })
        );
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
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    @Once()
    private _loadCampaignTimelines() {
        return this.yp.getCampaignTimelines(this.campaignModel.getCampaignId())
            .subscribe((m_campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                this.m_campaignTimelinesModels = m_campaignTimelinesModels;
            })
    }

    _onGoBack(){
        this.actions.resetCampaignSelection();
        this.onGoBack.emit()
    }

    ngOnInit() {
    }

    destroy() {
        console.log('dest camp editor');
    }
}