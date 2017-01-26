import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application.state";
import {Observable} from "rxjs";
import {CampaignsModelExt} from "../store/model/msdb-models-extended";
import {List} from "immutable";

@Injectable()
export class YellowPepperService {

    constructor(private store: Store<ApplicationState>) {
    }

    public findCampaignById(i_campaignId: number): Observable<CampaignsModelExt> {
        return this.store.select(store => store.msDatabase.sdk.table_campaigns)
            .take(1)
            .map((i_campaigns: List<CampaignsModelExt>) => {
                // console.log('look up campaign ' + i_campaignId);
                return i_campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == i_campaignId;
                });
            });
    }

    public findCampaignByIdConcatTest(i_campaignId):Observable<CampaignsModelExt> {
        var campaign1$ = this.findCampaignById(i_campaignId)
        var campaign2$ = this.findCampaignById(1)
        var campaign3$ = this.findCampaignById(2)

        return campaign1$.concatMap((x: CampaignsModelExt) => {
            return campaign2$;
        }, (a: CampaignsModelExt, b: CampaignsModelExt) => {
            return a;
        }).concatMap((campaignsModel: CampaignsModelExt) => {
            return this.findCampaignById(campaignsModel.getCampaignId())
        }, (c: CampaignsModelExt, d: CampaignsModelExt) => {
            console.log(c, d);
            return d;
        }).concatMap((campaignsModel: CampaignsModelExt) => this.findCampaignById(campaignsModel.getCampaignId()), (e: CampaignsModelExt, f: CampaignsModelExt) => {
            console.log(e, f);
            return e
        }).take(1)
    }

}
