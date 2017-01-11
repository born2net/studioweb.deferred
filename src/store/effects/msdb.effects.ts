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
import {ACTION_REDUXIFY_MSDB} from "../actions/appdb.actions";
import {RedPepperService, redpepperTables, redpepperTablesAction} from "../../services/redpepper.service";

export const EFFECT_INIT_REDUXIFY_MSDB = 'EFFECT_INIT_REDUXIFY_MSDB';
export const EFFECT_RENAME_CAMPAIGN = 'EFFECT_RENAME_CAMPAIGN';
export const EFFECT_CREATE_TABLE_BOARD = 'EFFECT_CREATE_TABLE_BOARD';


@Injectable()
export class MsdbEffects {

    constructor(private actions$: Actions,
                @Inject('OFFLINE_ENV') private offlineEnv,
                private store: Store<ApplicationState>,
                private redPepperService: RedPepperService,
                private http: Http) {
    }

    @Effect()
    reduxifyMsdb$: Observable<Action> = this.actions$.ofType(EFFECT_INIT_REDUXIFY_MSDB)
        .map(() => {
            return this.redPepperService.syncToReduxEntireSdk();
        })

    @Effect()
    renameCampaign: Observable<Action> = this.actions$.ofType(EFFECT_RENAME_CAMPAIGN)
        .map(() => {

            var dispatch: redpepperTablesAction = {type: 'ACTION_REDUXIFY_MSDB', payload: []};

            // var redpepperSet = this.redPepperService.createBoard('my board', 500, 500);
            // this.store.dispatch({type: ACTION_REDUXIFY_MSDB, payload: redpepperTables});

            // var dispatch: redpepperTablesAction = {type: ACTION_REDUXIFY_MSDB, payload: []};

            dispatch.payload.push(this.redPepperService.createBoard('my board', 500, 500));
            dispatch.payload.push(this.redPepperService.renameCampaign('A1'));
            dispatch.payload.push(this.redPepperService.renameCampaign('A2'));
            dispatch.payload.push(this.redPepperService.renameCampaign('A3'));
            dispatch.payload.push(this.redPepperService.renameCampaign('A4'));
            dispatch.payload.push(this.redPepperService.renameCampaign('A5'));
            return dispatch;
        })

    @Effect()
    createBoard: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE_BOARD)
        .map(() => {

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
            var dispatch: redpepperTablesAction = {type: 'ACTION_REDUXIFY_MSDB', payload: []};

            var table_boards: redpepperTables = this.redPepperService.createBoard('my board', 500, 500);
            var board_id = table_boards.data.board_id;
            var table_templates: redpepperTables = this.redPepperService.createNewTemplate(board_id, screenProps);
            var newTemplateData = table_templates.data;
            var board_template_id = newTemplateData['board_template_id']
            var viewers = newTemplateData['viewers'];
            var table_campaigns = this.redPepperService.createCampaign('campaign');
            var m_selected_campaign_id = table_campaigns.data;
            var table_campaign_boards = this.redPepperService.assignCampaignToBoard(m_selected_campaign_id, board_id);
            var campaign_board_id = table_campaign_boards.data;
            var campaignName = 'foo campaign';
            var table_campaigns = this.redPepperService.setCampaignRecord(m_selected_campaign_id, 'campaign_name', campaignName);
            var table_campaign_timelines = this.redPepperService.createNewTimeline(m_selected_campaign_id);
            var campaign_timeline_id = table_campaign_timelines.data;
            var table_campaign_timeline_sequences = this.redPepperService.setCampaignTimelineSequencerIndex(m_selected_campaign_id, campaign_timeline_id, 0);
            var table_campaign_timelines = this.redPepperService.setTimelineTotalDuration(campaign_timeline_id, '0');
            var table_campaign_timeline_schedules = this.redPepperService.createCampaignTimelineScheduler(m_selected_campaign_id, campaign_timeline_id);
            var table_campaign_timeline_board_templates = this.redPepperService.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
            var campaign_timeline_board_template_id = table_campaign_timeline_board_templates.data;
            var table_campaign_timeline_chanels = this.redPepperService.createTimelineChannels(campaign_timeline_id, viewers);
            var channels = table_campaign_timeline_chanels.data;
            var table_campaign_timeline_board_viewer_chanels = this.redPepperService.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);

            // self.m_timelines[campaign_timeline_id] = new Timeline({campaignTimelineID: campaign_timeline_id});


            // option: 1 to dispatch
            dispatch.payload = [table_boards, table_templates, table_campaigns,
                table_campaign_boards, table_campaign_timelines, table_campaign_timeline_sequences, table_campaign_timeline_board_viewer_chanels,
                table_campaign_timelines, table_campaign_timeline_schedules, table_campaign_timeline_board_templates, table_campaign_timeline_chanels]

            return dispatch;

            // option: 2 to dispatch
            // return this.redPepperService.syncToReduxEntireSdk();

            // option: 3 to dispatch
            // var board1: redpepperTables = this.redPepperService.createBoard('my board1', 500, 500);
            // var board2: redpepperTables = this.redPepperService.createBoard('my board2', 500, 500);
            // dispatch.payload.push(board1)
            // dispatch.payload.push(board2)
            // this.store.dispatch({type: ACTION_REDUXIFY_MSDB, payload: [tables]});
            // var board_id = tables.data.board_id;
        })
}


