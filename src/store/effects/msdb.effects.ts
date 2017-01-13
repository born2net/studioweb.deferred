import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/debounceTime";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../application.state";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {ACTION_REDUXIFY_NOW} from "../actions/appdb.actions";
import {RedPepperService, redpepperTables, redpepperTablesAction} from "../../services/redpepper.service";
import {CampaignsModal} from "../imsdb.interfaces_auto";

export const EFFECT_INIT_REDUXIFY_MSDB = 'EFFECT_INIT_REDUXIFY_MSDB';
export const EFFECT_CREATE_CAMPAIGN_BOARD = 'EFFECT_CREATE_CAMPAIGN_BOARD';
export const EFFECT_REMOVE_CAMPAIGN = 'EFFECT_REMOVE_CAMPAIGN';
export const EFFECT_RENAME_CAMPAIGN = 'EFFECT_RENAME_CAMPAIGN';

@Injectable()
export class MsdbEffects {

    constructor(private actions$: Actions,
                @Inject('OFFLINE_ENV') private offlineEnv,
                private store: Store<ApplicationState>,
                private redPepperService: RedPepperService,
                private http: Http) {
    }

    @Effect({dispatch: false})
    reduxifyMsdb$: Observable<Action> = this.actions$.ofType(EFFECT_INIT_REDUXIFY_MSDB)
        .do(() => {
            this.redPepperService.reduxSubmit();
        })

    @Effect({dispatch: false})
    renameCampaign: Observable<Action> = this.actions$.ofType(EFFECT_RENAME_CAMPAIGN)
        .do(() => {
            // this.redPepperService.createBoard('my board', 500, 500);
            this.redPepperService.renameCampaign('A1');
            this.redPepperService.renameCampaign('A2');
            this.redPepperService.renameCampaign('A3');
            this.redPepperService.renameCampaign('A4')
            this.redPepperService.renameCampaign('A5 ' + Math.random());
            this.redPepperService.reduxSubmit();
        })

    @Effect({dispatch: false})
    removeCampaign: Observable<Action> = this.actions$.ofType(EFFECT_REMOVE_CAMPAIGN)
        .do((action: Action) => {
            var campaignId: CampaignsModal = (action.payload as CampaignsModal).getCampaignId();
            this.redPepperService.removeCampaignEntirely(campaignId);
            this.redPepperService.reduxSubmit();
        })

        // .map(toPayload,(payload)=>{
        //     debugger;
        //     var campaignId: CampaignsModal = (payload as CampaignsModal).getCampaignId();
        //     return {
        //         type: 'ACTION_REDUXIFY_NOW',
        //         payload: [this.redPepperService.removeCampaignEntirely(campaignId)]
        //     }
        // })

    @Effect({dispatch: false})
    createCampaign: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_CAMPAIGN_BOARD)
        .do(() => {

            // ////////////////////////////////////////////////
            // // Created a brand new campaign and a new board
            // ////////////////////////////////////////////////
            //
            // var width = BB.comBroker.getService(BB.SERVICES['RESOLUTION_SELECTOR_VIEW']).getResolution().split('x')[0];
            // var height = BB.comBroker.getService(BB.SERVICES['RESOLUTION_SELECTOR_VIEW']).getResolution().split('x')[1];
            // var board_id = this.redPepperService.createBoard('my board', 500,500).data.board_id;

            var m_timelines = {};
            var screenProps = {
                sd0: {
                    id: 'horizontal_1920x1080_screenType10_sd0',
                    x: 0,
                    y: 0,
                    w: 1920,
                    h: 360
                },
                sd1: {
                    id: 'horizontal_1920x1080_screenType10_sd1',
                    x: 0,
                    y: 360,
                    w: 1920,
                    h: 360
                },
                sd2: {
                    id: 'horizontal_1920x1080_screenType10_sd2',
                    x: 0,
                    y: 720,
                    w: 1920,
                    h: 360
                }
            }

            var board_id = this.redPepperService.createBoard('my board', 500, 500);
            var newTemplateData = this.redPepperService.createNewTemplate(board_id, screenProps);
            var board_template_id = newTemplateData['board_template_id']
            var viewers = newTemplateData['viewers'];
            var m_selected_campaign_id = this.redPepperService.createCampaign('campaign');
            var campaign_board_id = this.redPepperService.assignCampaignToBoard(m_selected_campaign_id, board_id);
            var campaignName = 'foo campaign ' + Math.random();
            this.redPepperService.setCampaignRecord(m_selected_campaign_id, 'campaign_name', campaignName);
            var campaign_timeline_id = this.redPepperService.createNewTimeline(m_selected_campaign_id);
            this.redPepperService.setCampaignTimelineSequencerIndex(m_selected_campaign_id, campaign_timeline_id, 0);
            this.redPepperService.setTimelineTotalDuration(campaign_timeline_id, '0');
            this.redPepperService.createCampaignTimelineScheduler(m_selected_campaign_id, campaign_timeline_id);
            var campaign_timeline_board_template_id = this.redPepperService.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
            var channels = this.redPepperService.createTimelineChannels(campaign_timeline_id, viewers);
            this.redPepperService.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);
            this.redPepperService.reduxSubmit();

            // self.m_timelines[campaign_timeline_id] = new Timeline({campaignTimelineID: campaign_timeline_id});


            // option: 1 to dispatch
            // dispatch.payload = [table_boards, table_templates, table_campaigns,
            //     table_campaign_boards, table_campaign_timelines, table_campaign_timeline_sequences, table_campaign_timeline_board_viewer_chanels,
            //     table_campaign_timelines, table_campaign_timeline_schedules, table_campaign_timeline_board_templates, table_campaign_timeline_chanels]


            // option: 2 to dispatch
            // return this.redPepperService.syncToReduxEntireSdk();

            // option: 3 to dispatch
            // var board1: redpepperTables = this.redPepperService.createBoard('my board1', 500, 500);
            // var board2: redpepperTables = this.redPepperService.createBoard('my board2', 500, 500);
            // dispatch.payload.push(board1)
            // dispatch.payload.push(board2)
            // this.store.dispatch({type: ACTION_REDUXIFY_NOW, payload: [tables]});
        })
}


