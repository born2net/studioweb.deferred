import {Injectable} from "@angular/core";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../store/application.state";
import {Observable} from "rxjs";
import {CampaignsModelExt} from "../store/model/msdb-models-extended";
import {List} from "immutable";
import {
    BoardsModel, BoardTemplateViewersModel, CampaignTimelineBoardTemplatesModel, CampaignTimelineBoardViewerChanelsModel, CampaignTimelineBoardViewerChannelsModel, CampaignTimelineSequencesModel,
    CampaignTimelinesModel
} from "../store/imsdb.interfaces_auto";

@Injectable()
export class YellowPepperService {

    constructor(private store: Store<ApplicationState>) {
    }

    public dispatch(action: Action) {
        this.store.dispatch(action);
    }

    public get ngrxStore(): Store<ApplicationState> {
        return this.store;
    }

    /**
     Listen to when a campaign is selected via the store state uiState.campaign.campaignSelected
     @method listenCampaignSelected
     @param {Observable<CampaignsModelExt>} i_campaign_id
     **/
    public listenCampaignSelected(): Observable<CampaignsModelExt> {

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

    /**
     Get all timeline ids for specified campaign
     @method getCampaignTimelines
     @param {Number} i_campaign_id
     **/
    getCampaignTimelines(i_campaign_id: number): Observable<List<CampaignTimelinesModel>> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timelines)
            .map((campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                return campaignTimelinesModels.filter((campaignTimelinesModel: CampaignTimelinesModel) => {
                    return campaignTimelinesModel.getCampaignId() == i_campaign_id;
                });
            }).take(1);
    }

    /**
     Get the sequence index of a timeline in the specified campaign
     @method getCampaignTimelineSequencerIndex
     @param {Number} i_campaign_timeline_id
     **/
    getCampaignTimelineSequencerIndex(i_campaign_timeline_id): Observable<number> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_sequences)
            .map((campaignTimelineSequencesModels: List<CampaignTimelineSequencesModel>) => {
                var found: CampaignTimelineSequencesModel = campaignTimelineSequencesModels.find((campaignTimelineSequencesModel: CampaignTimelineSequencesModel) => {
                    return campaignTimelineSequencesModel.getCampaignTimelineId() == i_campaign_timeline_id
                });
                return found.getSequenceIndex();
            }).take(1);
    }

    /**
     Get all the campaign > timeline > board > template ids of a timeline
     @method getTemplatesOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} template ids
     **/
    getTemplatesOfTimeline(i_campaign_timeline_id): Observable<Array<number>> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_templates)
            .map((campaignTimelineBoardTemplatesModels: List<CampaignTimelineBoardTemplatesModel>) => {
                return campaignTimelineBoardTemplatesModels.reduce((result: Array<number>, campaignTimelineBoardTemplatesModel: CampaignTimelineBoardTemplatesModel) => {
                    if (campaignTimelineBoardTemplatesModel.getCampaignTimelineId() == i_campaign_timeline_id)
                        result.push(campaignTimelineBoardTemplatesModel.getCampaignTimelineBoardTemplateId());
                    return result;
                }, [])
            }).take(1);
    }

    /**
     Build screenProps json object with all viewers and all of their respective attributes for the given timeline_id / template_id
     @method getTemplateViewersScreenProps
     @param {Number} i_campaign_timeline_id
     @param {Number} i_campaign_timeline_board_template_id
     @return {Object} screenProps all viewers and all their properties
     **/
    getTemplateViewersScreenProps(i_campaign_timeline_id, i_campaign_timeline_board_template_id): Observable<any> {

        var table_campaign_timeline_board_templates$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_templates);
        var table_campaign_timeline_board_viewer_chanels$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_viewer_chanels);
        var table_board_template_viewers$ = this.store.select(store => store.msDatabase.sdk.table_board_template_viewers);

        return Observable.combineLatest(
            table_campaign_timeline_board_templates$,
            table_board_template_viewers$,
            table_campaign_timeline_board_viewer_chanels$,
            (campaignTimelineBoardTemplatesModels: List<CampaignTimelineBoardTemplatesModel>,
             boardTemplateViewersModels: List<BoardTemplateViewersModel>,
             campaignTimelineBoardViewerChanelsModels: List<CampaignTimelineBoardViewerChanelsModel>) => {

                var campaignTimelineBoardViewerChanelsModel = campaignTimelineBoardViewerChanelsModels.filter( (campaignTimelineBoardViewerChanelsModel:CampaignTimelineBoardViewerChanelsModel) => {
                    return campaignTimelineBoardViewerChanelsModel.getCampaignTimelineBoardTemplateId() == i_campaign_timeline_board_template_id
                })
                // var board_template_viewer_id = campaignTimelineBoardViewerChanelsModel.getBoardTemplateViewerId();

                // var boardTemplateViewersModel = boardTemplateViewersModels.find((boardTemplateViewersModel)=>{
                //     return boardTemplateViewersModel.getBoardTemplateId() == board_template_viewer_id;
                // })
                console.log();


            })

        // var counter = -1;
        // var screenProps = {};
        // var viewOrderIndexes = {};
        // $(this.databaseManager.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_board_viewer_chanel_id) {
        //
        //     var recCampaignTimelineBoardViewerChanel = this.databaseManager.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);
        //     if (recCampaignTimelineBoardViewerChanel['campaign_timeline_board_template_id'] == i_campaign_timeline_board_template_id) {
        //         var recBoardTemplateViewer = this.databaseManager.table_board_template_viewers().getRec(recCampaignTimelineBoardViewerChanel['board_template_viewer_id']);
        //         // console.log(i_campaign_timeline_board_template_id + ' ' + recBoardTemplateViewer['board_template_viewer_id']);
        //         counter++;
        //         screenProps['sd' + counter] = {};
        //         screenProps['sd' + counter]['campaign_timeline_board_viewer_id'] = recBoardTemplateViewer['board_template_viewer_id'];
        //         screenProps['sd' + counter]['campaign_timeline_id'] = i_campaign_timeline_id;
        //         screenProps['sd' + counter]['x'] = recBoardTemplateViewer['pixel_x'];
        //         screenProps['sd' + counter]['y'] = recBoardTemplateViewer['pixel_y'];
        //         screenProps['sd' + counter]['w'] = recBoardTemplateViewer['pixel_width'];
        //         screenProps['sd' + counter]['h'] = recBoardTemplateViewer['pixel_height'];
        //
        //         // make sure that every view_order we assign is unique and sequential
        //         var viewOrder = recBoardTemplateViewer['viewer_order'];
        //         if (!_.isUndefined(viewOrderIndexes[viewOrder])) {
        //             for (var i = 0; i < 100; i++) {
        //                 if (_.isUndefined(viewOrderIndexes[i])) {
        //                     viewOrder = i;
        //                     break;
        //                 }
        //             }
        //         }
        //         viewOrderIndexes[viewOrder] = true;
        //         screenProps['sd' + counter]['view_order'] = viewOrder;
        //     }
        // });
        //
        // return screenProps;
    }

    /**
     Get campaigns
     @method getCampaign
     @param {Number} i_campaign_id
     **/
    getCampaign(i_campaign_id: number): Observable<CampaignsModelExt> {
        return this.store.select(store => store.msDatabase.sdk.table_campaigns)
            .map((campaignModels: List<CampaignsModelExt>) => {
                return campaignModels.find((campaignModel: CampaignsModelExt) => {
                    return campaignModel.getCampaignId() == i_campaign_id;
                });
            }).take(1);
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
