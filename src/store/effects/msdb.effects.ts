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
import {ACTION_REDUXIFY_MSDB} from "../actions/appdb.actions";
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
            return {type: ACTION_REDUXIFY_MSDB, payload: redpepperSet}
        })

    @Effect()
    createCampaign: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE_CAMPAIGN)
        .map(() => {
            var redpepperSet: redpepperSet = this.redPepperService.createCampaign(Math.random());
            return {type: ACTION_REDUXIFY_MSDB, payload: redpepperSet}
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

            /*
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
             var redpepperSet: redpepperSet = this.redPepperService.createBoard('my board', 500, 500);
             var board_id = redpepperSet.data.board_id;
             var newTemplateData = this.redPepperService.createNewTemplate(board_id, screenProps);
             var board_template_id = newTemplateData['board_template_id']
             var viewers = newTemplateData['viewers'];
             var m_selected_campaign_id = this.redPepperService.createCampaign('campaign');
             var campaign_board_id = this.redPepperService.assignCampaignToBoard(m_selected_campaign_id, board_id);
             var campaignName = 'foo campaign';
             this.redPepperService.setCampaignRecord(m_selected_campaign_id, 'campaign_name', campaignName);
             var campaign_timeline_id = this.redPepperService.createNewTimeline(m_selected_campaign_id);
             this.redPepperService.setCampaignTimelineSequencerIndex(m_selected_campaign_id, campaign_timeline_id, 0);
             this.redPepperService.setTimelineTotalDuration(campaign_timeline_id, '0');
             this.redPepperService.createCampaignTimelineScheduler(m_selected_campaign_id, campaign_timeline_id);
             var campaign_timeline_board_template_id = this.redPepperService.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
             var channels = this.redPepperService.createTimelineChannels(campaign_timeline_id, viewers);
             this.redPepperService.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);
             */

            // ---->>>>> // m_timelines[campaign_timeline_id] = new Timeline({campaignTimelineID: campaign_timeline_id});

            // BB.comBroker.fire(BB.EVENTS.CAMPAIGN_TIMELINE_SELECTED, this, null, campaign_timeline_id);
            // BB.comBroker.getService(BB.SERVICES['SEQUENCER_VIEW']).reSequenceTimelines();




            ////// var newTemplateData = pepper.createNewTemplate(board_id, e.caller.screenTemplateData.screenProps);
            ////// var board_template_id = newTemplateData['board_template_id']
            /////// var viewers = newTemplateData['viewers'];
            //////
            ////// self.m_selected_campaign_id = pepper.createCampaign('campaign');
            ////// campaign_board_id = pepper.assignCampaignToBoard(self.m_selected_campaign_id, board_id);
            //
            // // set campaign name
            ////// var campaignName = BB.comBroker.getService(BB.SERVICES['CAMPAIGN_NAME_SELECTOR_VIEW']).getCampaignName();
            ////// pepper.setCampaignRecord(self.m_selected_campaign_id, 'campaign_name', campaignName);
            //
            ///// BB.comBroker.fire(BB.EVENTS.LOAD_CAMPAIGN_LIST);
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


            var redpepperSet: redpepperSet = this.redPepperService.createBoard('my board', 500, 500);
            this.store.dispatch({type: ACTION_REDUXIFY_MSDB, payload: redpepperSet});

            var board_id = redpepperSet.data.board_id;
            return {type: ACTION_REDUXIFY_MSDB, payload: redpepperSet};


        })

}


