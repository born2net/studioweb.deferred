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

    _getScreenTemplate(i_campaignTimelinesModel: CampaignTimelinesModel): Observable<IScreenTemplateData> {
        return this.yp.getTemplatesOfTimeline(i_campaignTimelinesModel.getCampaignTimelineId())
            .map((campaignTimelineBoardTemplateIds: Array<number>) => {
                // for now return zero as we don't support multiple divisions per single timeline, yet
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

