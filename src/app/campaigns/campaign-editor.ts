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

    constructor(private yp: YellowPepperService) {
        super();

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected().subscribe((campaign: CampaignsModelExt) => {
                if (!campaign)
                    return;
                this.campaignModel = campaign;
                // this.renderFormInputs();
            })
        );

    }

    ngOnInit() {
    }

    destroy() {
    }
}