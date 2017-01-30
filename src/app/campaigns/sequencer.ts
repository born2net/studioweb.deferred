import {Component, ElementRef, Input} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {List} from "immutable";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import * as _ from "lodash";
import {IScreenTemplateData} from "../../comps/screen-template/screen-template";
import {Observable} from "rxjs";

@Component({
    selector: 'sequencer',
    template: `
      <small class="debug">{{me}}</small><h2>timelines: {{m_campaignTimelinesModels?.size}}</h2>
      <div style="float: left; padding: 20px" *ngFor="let screenTemplate of _screenTemplates | async">
        <div>{{screenTemplate.name}}</div>
        <screen-template [setTemplate]="screenTemplate"></screen-template>
      </div>

    `,
})
export class Sequencer extends Compbaser {

    private m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    _screenTemplates: Observable<any>;


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
                return this.yp.getTemplateViewersScreenProps(i_campaignTimelinesModel.getCampaignTimelineId(), campaignTimelineBoardTemplateId, i_campaignTimelinesModel.getTimelineName());
            })
    }


    @Input()
    set setCampaignTimelinesModels(i_campaignTimelinesModels: List<CampaignTimelinesModel>) {
        if (!i_campaignTimelinesModels)
            return;
        this.m_campaignTimelinesModels = i_campaignTimelinesModels;
        var sortedTimelines: Array<CampaignTimelinesModel> = this.sortTimelines();
        this._screenTemplates = Observable.from(sortedTimelines)
            .map(i_campaignTimelinesModelsOrdered => {
                return this._getScreenTemplate(i_campaignTimelinesModelsOrdered)
            }).combineAll()
    }

    private sortTimelines() {
        var orderedTimelines = []
        this.m_campaignTimelinesModels.forEach((i_campaignTimelinesModel: CampaignTimelinesModel) => {
            this.yp.getCampaignTimelineSequencerIndex(i_campaignTimelinesModel.getCampaignTimelineId()).get((index: number) => {
                orderedTimelines.push({index: index, campaign: i_campaignTimelinesModel});
            });
        })
        var orderedTimelines = _.sortBy(orderedTimelines, [function (o) {
            return o.index;
        }]);
        return _.toArray(_.map(orderedTimelines, function (o) {
            return o.campaign;
        }));
    }

    ngOnInit() {
    }

    destroy() {
    }
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