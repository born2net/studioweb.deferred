import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'campaign-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './campaign-editors.html'
})
export class CampaignEditor extends Compbaser {

    private campaignModel: CampaignsModelExt;

    private m_timelines = {}; // hold references to all created timeline instances
    private m_selected_timeline_id = -1;
    private m_selected_campaign_id = -1;

    constructor(private yp: YellowPepperService) {
        super();

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected().subscribe((campaign: CampaignsModelExt) => {
                if (!campaign)
                    return;
                this.campaignModel = campaign;
                console.log('campaign id is: ' + this.campaignModel.getCampaignId());
                // this.renderFormInputs();
            })
        );

    }

    ngOnInit() {
    }

    destroy() {
    }
}