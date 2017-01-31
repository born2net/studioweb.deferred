import {Component, ElementRef, Input, QueryList, ViewChildren} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {List} from "immutable";
import {CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import * as _ from "lodash";
import {IScreenTemplateData, ScreenTemplate} from "../../comps/screen-template/screen-template";
import {Observable} from "rxjs";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE} from "../../store/actions/appdb.actions";

// @Component({
//     selector: 'alert-danger',
//     template: `
//         <p>Alert danger</p>
//     `,
// })
// export class AlertDangerComponent {
//
// }

@Component({
    selector: 'sequencer',
    template: `
        <!--<small class="debug">{{me}}</small><h2>timelines: {{m_campaignTimelinesModels?.size}}</h2>-->
        <!--<div>{{screenTemplate.name}}</div>-->
        <!--<div id="dragcontainer" style="width: 1000px">-->
        <!--<alert-danger style="float: left; padding: 30px" class="drag" *ngFor="let c of [1,2,3,4]"></alert-danger>-->
        <!--</div>-->

        <div id="dragcontainer" style="width: 1000px; padding-left: 0; margin-left: 0">
            <screen-template style="float: left; margin: 10px" #st class="draggableTimeline" *ngFor="let screenTemplate of _screenTemplates | async"
                             (click)="_onScreenTemplateSelected(screenTemplate, st)" [setTemplate]="screenTemplate">
            </screen-template>
        </div>




    `,
})
export class Sequencer extends Compbaser {

    private m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    _screenTemplates: Observable<any>;
    m_draggables;
    m_thumbsContainer;
    target;
    x;
    selectedScreenTemplate: ScreenTemplate;
    selectedTimelineId:number;
    m_selectedChannel:number;
    m_selectedTimelineID:number;

    constructor(private el: ElementRef, private yp: YellowPepperService, private pepper: RedPepperService) {
        super();
        this.m_thumbsContainer = el.nativeElement;
    }

    _onScreenTemplateSelected(event, screenTemplate: ScreenTemplate) {
        this.m_selectedChannel = -1;
        this.tmpScreenTemplates.forEach((i_screenTemplate) => {
            if (i_screenTemplate == screenTemplate) {
                i_screenTemplate.selectFrame();
                this.selectedScreenTemplate = i_screenTemplate;
                this.selectedTimelineId = i_screenTemplate.m_screenTemplateData.campaignTimelineId;
            } else {
                i_screenTemplate.deSelectFrame();
            }

        })
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

    @ViewChildren(ScreenTemplate) tmpScreenTemplates: QueryList<ScreenTemplate>;


    /**
     Select next channel
     @method selectNextChannel
     **/
    onSelectNextChannel() {
        if (!this.selectedScreenTemplate)
            return;

        var timeline_channel_id, campaign_timeline_board_viewer_id;
        this.yp.getChannelsOfTimeline(this.selectedTimelineId).subscribe((channelsIDs) => {
            if (_.isUndefined(this.m_selectedChannel)) {
                timeline_channel_id = channelsIDs[0];
            } else {
                for (var ch in channelsIDs) {
                    if (channelsIDs[ch] == this.m_selectedChannel) {
                        if (_.isUndefined(channelsIDs[parseInt(ch) + 1])) {
                            timeline_channel_id = channelsIDs[0];
                        } else {
                            timeline_channel_id = channelsIDs[parseInt(ch) + 1];
                        }
                    }
                }
            }
            this.m_selectedChannel = timeline_channel_id;
            this.yp.getAssignedViewerIdFromChannelId(timeline_channel_id).subscribe((campaign_timeline_board_viewer_id) => {
                // note: workaround for when viewer is unassigned, need to investigate
                if (_.isUndefined(campaign_timeline_board_viewer_id))
                    return;
                // var screenData = {
                //     m_owner: self,
                //     campaign_timeline_id: this.m_selectedTimelineID,
                //     campaign_timeline_board_viewer_id: campaign_timeline_board_viewer_id
                // };
                this.selectedScreenTemplate.selectDivison(campaign_timeline_board_viewer_id)

                var uiState: IUiState = {campaign: {campaignTimelineBoardViewerSelected: campaign_timeline_board_viewer_id}}
                this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))

                // self._removeBlockSelection();
                // self._addChannelSelection(timeline_channel_id);
                // BB.comBroker.getService(BB.SERVICES['SEQUENCER_VIEW']).selectViewer(screenData.campaign_timeline_id, screenData.campaign_timeline_board_viewer_id);
                // BB.comBroker.fire(BB.EVENTS.ON_VIEWER_SELECTED, this, screenData);
                // BB.comBroker.fire(BB.EVENTS.CAMPAIGN_TIMELINE_CHANNEL_SELECTED, this, null, self.m_selectedChannel);
            });
        });
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
        setTimeout(() => {
            this._createSortable('#dragcontainer');
        }, 300)

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

    /**
     Create a sortable channel list
     @method _createSortable
     @param {Element} i_selector
     **/
    _createSortable(i_selector) {
        var self = this;
        if (jQuery(i_selector).children().length == 0) return;
        var sortable = document.querySelector(i_selector);
        self.m_draggables = Draggable.create(sortable.children, {
                type: "x",
                bounds: sortable,
                edgeResistance: 1,
                dragResistance: 0,
                onPress: self._sortablePress,
                onDragStart: self._sortableDragStart,
                onDrag: self._sortableDrag,
                liveSnap: self._sortableSnap,
                zIndexBoost: true,
                onDragEnd () {
                    var t = this.target,
                        max = t.kids.length - 1,
                        newIndex = Math.round(this.x / t.currentWidth);
                    //newIndex += (newIndex < 0 ? -1 : 0) + t.currentIndex;
                    var preIndex = newIndex;
                    //alert(this.x);
                    newIndex += t.originalIndex;
                    if (newIndex === max) {
                        t.parentNode.appendChild(t);
                    } else {
                        if (preIndex >= 0) t.parentNode.insertBefore(t, t.kids[newIndex + 1]);
                        else t.parentNode.insertBefore(t, t.kids[newIndex]);
                    }
                    TweenLite.set(t.kids, {xPercent: 0, overwrite: "all"});
                    TweenLite.set(t, {x: 0, color: ""});

                    // var orderedTimelines = self.reSequenceTimelines();
                    // jQuery(self.m_thumbsContainer).empty();
                    // BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).populateTimelines(orderedTimelines);
                    // var campaign_timeline_id = BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).getSelectedTimeline();
                    // self.selectTimeline(campaign_timeline_id);

                }
            }
        );
    }

    /**
     Sortable channel list on press
     @method _sortablePress
     **/
    _sortablePress() {
        var t = this.target,
            i = 0,
            child = t;
        while (child = child.previousSibling)
            if (child.nodeType === 1) i++;
        t.originalIndex = i;
        t.currentWidth = jQuery(t).outerWidth();
        t.kids = [].slice.call(t.parentNode.children); // convert to array
    }

    /**
     Sortable drag channel list on press
     @method _sortableDragStart
     **/
    _sortableDragStart() {
        TweenLite.set(this.target, {color: "#88CE02"});
    }

    /**
     Sortable drag channel list
     @method _sortableDrag
     **/
    _sortableDrag() {
        var t = this.target,
            elements = t.kids.slice(), // clone
            // indexChange = Math.round(this.x / t.currentWidth), // round flawed on large values
            indexChange = Math.ceil(this.x / t.currentWidth),
            srcIndex = t.originalIndex,
            dstIndex = srcIndex + indexChange;

        // console.log('k ' + t.kids.length + ' s:' + srcIndex + ' d:' + indexChange + ' t:' + (dstIndex - srcIndex));

        if (srcIndex < dstIndex) { // moved right
            TweenLite.to(elements.splice(srcIndex + 1, dstIndex - srcIndex), 0.15, {xPercent: -140});  // 140 = width of screen layout widget
            TweenLite.to(elements, 0.15, {xPercent: 0});
        } else if (srcIndex === dstIndex) {
            elements.splice(srcIndex, 1);
            TweenLite.to(elements, 0.15, {xPercent: 0});
        } else { // moved left
            // ignore if destination > source index
            if ((indexChange < 0 ? indexChange * -1 : indexChange) > srcIndex)
                return;
            TweenLite.to(elements.splice(dstIndex, srcIndex - dstIndex), 0.15, {xPercent: 140}); // 140 = width of screen layout widget
            TweenLite.to(elements, 0.15, {xPercent: -10});
        }
    }

    /**
     snap channels to set rounder values
     @method _sortableSnap
     **/
    _sortableSnap(y) {
        return y;
        /* enable code below to use live drag snapping */
        // var h = this.target.currentHeight;
        // return Math.round(y / h) * h;
    }


    ngOnInit() {
    }

    destroy() {
    }
}

