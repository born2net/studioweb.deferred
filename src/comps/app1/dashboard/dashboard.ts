import {Component, ChangeDetectionStrategy, ElementRef, ViewChild} from "@angular/core";
import {Compbaser} from "../../compbaser/Compbaser";
import {ApplicationState} from "../../../store/application.state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../../models/UserModel";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import {List} from 'immutable';
import {ResourcesModal} from "../../../store/imsdb.interfaces_auto";
import {EFFECT_CREATE_TABLE} from "../../../store/effects/msdb.effects";

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <h2>Dashboard</h2>
               <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
               <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
               <canvas #canvas width="300" height="300"></canvas>
               <button (click)="setZoom()">zoom</button>
           `,
})
export class Dashboard extends Compbaser {

    private userModel$: Observable<UserModel>;
    private fabricCanvas:fabric.IStaticCanvas;

    @ViewChild('canvas')
    canvas;

    constructor(private store: Store<ApplicationState>) {
        super();
        this.userModel$ = this.store.select(store => store.appDb.userModel);

        this.store.select(store => store.msDatabase.sdk.table_campaigns).subscribe((v) => {
            console.log(v);
        })

        this.store.select(store => store.msDatabase.sdk.table_resources).subscribe((resourceModels: List<ResourcesModal>) => {
            console.log(resourceModels.get(4).getResourceName());
            console.log(resourceModels.get(4).getResourceBytesTotal());
        })
    }

    private setZoom() {
        this.fabricCanvas.setZoom(_.random(1, 1.5));
        // this.store.dispatch({type:'UPD_TABLE_RESOURCES'})
        this.store.dispatch({type: EFFECT_CREATE_TABLE})
    }

    ngOnInit() {
        this.fabricCanvas = new fabric.Canvas(this.canvas.nativeElement);
        var rect = new fabric.Rect({
            top: 100,
            left: 100,
            width: 60,
            height: 70,
            fill: 'red'
        });
        this.fabricCanvas.add(rect);
    }

    createCampaign() {


        // ////////////////////////////////////////////////
        // // Created a brand new campaign and a new board
        // ////////////////////////////////////////////////
        //
        // var width = BB.comBroker.getService(BB.SERVICES['RESOLUTION_SELECTOR_VIEW']).getResolution().split('x')[0];
        // var height = BB.comBroker.getService(BB.SERVICES['RESOLUTION_SELECTOR_VIEW']).getResolution().split('x')[1];
        // board_id = pepper.createBoard('board', width, height);
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

    }

    destroy() {
    }
}