import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {Map, List} from 'immutable';

@Component({
    selector: 'campaign-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './campaign-editors.html'
})
export class CampaignEditor extends Compbaser {

    private campaignModel: CampaignsModelExt;

    constructor(private yp: YellowPepperService, private rp:RedPepperService) {
        super();

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected().subscribe((campaign: CampaignsModelExt) => {
                if (!campaign)
                    return;
                this.campaignModel = campaign;
                this._loadCampaignTimelines();
            })
        );

    }

    private _loadCampaignTimelines(){

        this.yp.getCampaignTimelines(this.campaignModel.getCampaignId()).subscribe((campaignTimelinesModels:List<CampaignTimelinesModel>)=>{
            console.log(campaignTimelinesModels.size);
        })
    }

    ngOnInit() {
    }

    destroy() {
    }
}