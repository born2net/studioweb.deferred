import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/debounceTime";
import * as xml2js from "xml2js";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../application.state";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {ACTION_UPDATE_ALL_TABLES, ACTION_UPDATE_TABLE} from "../actions/appdb.actions";
import {RedPepperService, redpepperSet} from "../../services/redpepper.service";

export const EFFECT_INIT_REDUXIFY_MSDB = 'EFFECT_INIT_REDUXIFY_MSDB';
export const EFFECT_CREATE_TABLE_CAMPAIGN = 'EFFECT_CREATE_TABLE_CAMPAIGN';
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
            var redpepperSet: redpepperSet = this.redPepperService.reduxifyMsdbTable();
            return {type: ACTION_UPDATE_ALL_TABLES, payload: redpepperSet}
        })

    @Effect()
    createCampaign: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE_CAMPAIGN)
        .map(() => {
            var redpepperSet: redpepperSet = this.redPepperService.createCampaign(Math.random());
            return {
                type: ACTION_UPDATE_TABLE,
                payload: {
                    tables: redpepperSet.tables,
                    tableName: 'table_campaigns'
                }
            }
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


            //
            // var newTemplateData = pepper.createNewTemplate(board_id, e.caller.screenTemplateData.screenProps);
            // var board_template_id = newTemplateData['board_template_id']
            // var viewers = newTemplateData['viewers'];
            //
            // self.m_selected_campaign_id = pepper.createCampaign('campaign');
            // campaign_board_id = pepper.assignCampaignToBoard(self.m_selected_campaign_id, board_id);
            //
            // // set campaign name
            // var campaignName = BB.comBroker.getService(BB.SERVICES['CAMPAIGN_NAME_SELECTOR_VIEW']).getCampaignName();
            // pepper.setCampaignRecord(self.m_selected_campaign_id, 'campaign_name', campaignName);
            //
            // BB.comBroker.fire(BB.EVENTS.LOAD_CAMPAIGN_LIST);
            //
            //
            // ////////////////////////////////////////////////
            // // Add Timeline to an existing campaign
            // ////////////////////////////////////////////////
            //
            // // campaign_board_id = pepper.getFirstBoardIDofCampaign(self.m_selected_campaign_id);
            // // board_id = pepper.getBoardFromCampaignBoard(campaign_board_id);
            // // var newTemplateData = pepper.createNewTemplate(board_id, e.caller.screenTemplateData.screenProps);
            // // var board_template_id = newTemplateData['board_template_id']
            // // var viewers = newTemplateData['viewers'];
            // // autoSelectFirstTimeline = false;
            //
            // campaign_timeline_id = pepper.createNewTimeline(self.m_selected_campaign_id);
            // pepper.setCampaignTimelineSequencerIndex(self.m_selected_campaign_id, campaign_timeline_id, 0);
            // pepper.setTimelineTotalDuration(campaign_timeline_id, '0');
            // pepper.createCampaignTimelineScheduler(self.m_selected_campaign_id, campaign_timeline_id);
            //
            // var campaign_timeline_board_template_id = pepper.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
            // var channels = pepper.createTimelineChannels(campaign_timeline_id, viewers);
            // pepper.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);
            //
            // self.m_timelines[campaign_timeline_id] = new Timeline({campaignTimelineID: campaign_timeline_id});
            // BB.comBroker.fire(BB.EVENTS.CAMPAIGN_TIMELINE_SELECTED, this, null, campaign_timeline_id);
            // BB.comBroker.getService(BB.SERVICES['SEQUENCER_VIEW']).reSequenceTimelines();


            var redpepperSet1: redpepperSet = this.redPepperService.reduxifyMsdbTable();
            this.store.dispatch({type: ACTION_UPDATE_ALL_TABLES, payload: redpepperSet1});

            var redpepperSet2: redpepperSet = this.redPepperService.createBoard('my board', 500, 500);
            this.store.dispatch({type: ACTION_UPDATE_TABLE, payload: redpepperSet2});

            var board_id = redpepperSet2.data.board_id;
            return {type: ACTION_UPDATE_TABLE, payload: redpepperSet2};



        })

}


