import {Component, ElementRef, Input} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {List} from "immutable";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import * as _ from 'lodash';
import {IScreenTemplateData} from "../../comps/screen-template/screen-template";
import {OrientationEnum} from "./campaign-orientation";
import {Observable} from "rxjs";

@Component({
    selector: 'sequencer',
    template: `
      <small class="debug">{{me}}</small><h2>timelines: {{m_campaignTimelinesModelsOrdered?.size}}</h2>
      <div style="float: left; padding: 20px" *ngFor="let campaignTimelinesModel of m_campaignTimelinesModelsOrdered">
        <div>{{campaignTimelinesModel.getTimelineName()}}</div>
        <screen-template [setTemplate]="_getScreenTemplate(campaignTimelinesModel) | async"></screen-template>
      </div>

    `,
})
export class Sequencer extends Compbaser {

    private m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    private m_campaignTimelinesModelsOrdered: Array<CampaignTimelinesModel> = [];

    constructor(private el: ElementRef, private yp: YellowPepperService, private pepper: RedPepperService) {
        super();
    }

    /**
     *
     * @param i_campaignTimelinesModel here we get the CampaignTimelinesModel and find its boards so <screen-template/> can draw the UI thumbnails
     * @private
     */
    _getScreenTemplate(i_campaignTimelinesModel: CampaignTimelinesModel): Observable<IScreenTemplateData> {
        return this.yp.getTemplatesOfTimeline(i_campaignTimelinesModel.getCampaignTimelineId())
            .map((campaignTimelineBoardTemplateIds: Array<number>) => {
                return campaignTimelineBoardTemplateIds[0];
            }).switchMap((campaignTimelineBoardTemplateId) => {
                return this.yp.getTemplateViewersScreenProps(i_campaignTimelinesModel.getCampaignTimelineId(), campaignTimelineBoardTemplateId);
            })


        // done var boardTemplateIDs = pepper.getTemplatesOfTimeline(self.m_campaign_timeline_id);
        // for (var i = 0; i < boardTemplateIDs.length; i++) {
        //     self._populateBoardTemplate(boardTemplateIDs[i]);
        // }

        // this.yp.getTemplateViewersScreenProps(i_campaignTimelinesModel.getCampaignTimelineId(),)
    }

    /**
     Load up the board template (screen divisions) for this timeline instance.
     In case sequencer is used, we push it to the sequencer, thus creating the thumbnail template
     inside the sequencer so this timeline can be selected.
     Scheduler future support.
     @method _populateBoardTemplate
     @param {Number} i_campaign_timeline_board_template_id
     @return none
     **/
    // _populateBoardTemplate(i_campaign_timeline_board_template_id) {
    //     var self = this;
    //     var recBoard = pepper.getGlobalBoardRecFromTemplate(i_campaign_timeline_board_template_id);
    //     var width = parseInt(recBoard['board_pixel_width']);
    //     var height = parseInt(recBoard['board_pixel_height']);
    //
    //     BB.comBroker.getService(BB.SERVICES.RESOLUTION_SELECTOR_VIEW).setResolution(width + 'x' + height);
    //     if (width > height) {
    //         BB.comBroker.getService(BB.SERVICES.ORIENTATION_SELECTOR_VIEW).setOrientation(BB.CONSTS.HORIZONTAL);
    //     } else {
    //         BB.comBroker.getService(BB.SERVICES.ORIENTATION_SELECTOR_VIEW).setOrientation(BB.CONSTS.VERTICAL);
    //     }
    //     var screenProps = pepper.getTemplateViewersScreenProps(self.m_campaign_timeline_id, i_campaign_timeline_board_template_id)
    //     self.m_sequences.createTimelineThumbnailUI(screenProps);
    // }

    @Input()
    set setCampaignTimelinesModels(i_campaignTimelinesModels: List<CampaignTimelinesModel>) {
        if (!i_campaignTimelinesModels)
            return;
        this.m_campaignTimelinesModels = i_campaignTimelinesModels;
        this.sortTimelines();
    }

    private sortTimelines() {
        this.m_campaignTimelinesModelsOrdered = []
        var orderedTimelines = []
        this.m_campaignTimelinesModels.forEach((i_campaignTimelinesModel: CampaignTimelinesModel) => {
            this.yp.getCampaignTimelineSequencerIndex(i_campaignTimelinesModel.getCampaignTimelineId()).get((index: number) => {
                orderedTimelines.push({index: index, campaign: i_campaignTimelinesModel});
            });
        })
        var orderedTimelines = _.sortBy(orderedTimelines, [function (o) {
            return o.index;
        }]);
        this.m_campaignTimelinesModelsOrdered = _.toArray(_.map(orderedTimelines, function (o) {
            return o.campaign;
        }));
    }

    ngOnInit() {
    }

    destroy() {
    }
}