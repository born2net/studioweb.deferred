import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {ApplicationState} from "../store/application.state";
import {Observable} from "rxjs";
import {CampaignsModelExt} from "../store/model/msdb-models-extended";
import {List} from "immutable";
import {BoardsModel} from "../store/imsdb.interfaces_auto";

@Injectable()
export class YellowPepperService {

    constructor(private store: Store<ApplicationState>) {
    }

    public dispatch(action: Action) {
        this.store.dispatch(action);
    }

    public listenCampaignSelected() {

        var campaignSelected$ = this.store.select(
            store => store.appDb.uiState.campaign.campaignSelected
        );
        var campaignsList$ = this.store.select(
            store => store.msDatabase.sdk.table_campaigns
        );
        return campaignSelected$.withLatestFrom(
            campaignsList$,
            (campaignId, campaigns) => {
                return campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == campaignId;
                });
            });
    }

    /*****************************************************/
    // below are some brain dumps and examples only
    /*****************************************************/

    private listenCampaignSelectedExampleWithSwitchMap() {
        var campaignSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignSelected)
        var campaignsList$ = this.store.select(store => store.msDatabase.sdk.table_campaigns);
        return campaignSelected$.switchMap(i_campaignList => campaignsList$, (campaignId, campaigns) => {
            return campaigns.find((i_campaign: CampaignsModelExt) => {
                return i_campaign.getCampaignId() == campaignId;
            });
        })
    }

    private listenCampaignSelectedExampleFurtherLatestFromSelections() {
        var campaignSelected$ = this.store.select(
            store => store.appDb.uiState.campaign.campaignSelected
        );
        var boards$ = this.store.select(
            store => store.msDatabase.sdk.table_boards
        );
        var campaignsList$ = this.store.select(
            store => store.msDatabase.sdk.table_campaigns
        );
        return campaignSelected$.withLatestFrom(
            campaignsList$,
            (campaignId, campaigns) => {
                return campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == campaignId;
                });
            }).withLatestFrom(
            boards$,
            (campaign: CampaignsModelExt, boards: List<BoardsModel>) => {
                console.log(boards);
                return campaign;
            });
    }

    private findCampaignByIdTest(i_campaignId: number): Observable<CampaignsModelExt> {
        return this.store.select(store => store.msDatabase.sdk.table_campaigns)
            .take(1)
            .map((i_campaigns: List<CampaignsModelExt>) => {
                // console.log('look up campaign ' + i_campaignId);
                return i_campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == i_campaignId;
                });
            });
    }

    private findCampaignByIdConcatTemp1(i_campaignId): Observable<CampaignsModelExt> {
        var campaign1$ = this.findCampaignByIdTest(i_campaignId)
        var campaign2$ = this.findCampaignByIdTest(1)
        var campaign3$ = this.findCampaignByIdTest(2)

        return campaign1$.concatMap((x: CampaignsModelExt) => {
            return campaign2$;
        }, (a: CampaignsModelExt, b: CampaignsModelExt) => {
            return a;
        }).concatMap((campaignsModel: CampaignsModelExt) => {
            return this.findCampaignByIdTest(campaignsModel.getCampaignId())
        }, (c: CampaignsModelExt, d: CampaignsModelExt) => {
            console.log(c, d);
            return d;
        }).concatMap((campaignsModel: CampaignsModelExt) => this.findCampaignByIdTest(campaignsModel.getCampaignId()), (e: CampaignsModelExt, f: CampaignsModelExt) => {
            console.log(e, f);
            return e
        }).take(1)
    }

    private listenCampaignSelectedTemp2(): any {
        return this.store.select(store => store.appDb.uiState.campaign.campaignSelected);
    }

    private listenCampaignSelectedTemp3(): Observable<CampaignsModelExt> {

        var campaignSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignSelected)
        var campaigns$ = this.store.select(store => store.msDatabase.sdk.table_campaigns);

        return campaignSelected$.combineLatest(campaigns$, (campaignId: number, campaigns: List<CampaignsModelExt>) => {
            return campaigns.find((i_campaign: CampaignsModelExt) => {
                return i_campaign.getCampaignId() == campaignId;
            });
        })
    }
}
