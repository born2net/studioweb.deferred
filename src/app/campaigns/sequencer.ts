import {Component, ElementRef, Input, QueryList, ViewChildren} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {IScreenTemplateData, ScreenTemplate} from "../../comps/screen-template/screen-template";
import {Observable} from "rxjs";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {List} from "immutable";
import * as _ from "lodash";
import {ContextMenuService} from "angular2-contextmenu/src/contextMenu.service";

@Component({
    selector: 'sequencer',
    styles: [`
        #dragcontainer {
            padding-left: 0;
            margin-left: 0;
            vertical-align: middle;
            width: 2500px;
            height: 100px;
            overflow-y: hidden;
        }

        .dottedHR {
            height: 6px;
            width: 2500px;
            opacity: 0.6;
            position: relative;
            border-top: 12px dotted #c1c1c1;
            padding-bottom: 7px;
            top: 20px;
        }

        .draggableTimeline {
            float: left;
            margin: 10px;
            overflow-y: hidden;
        }

    `],
    template: `
        <div (click)="$event.preventDefault()">
            <small class="debug">{{me}}</small>
            <h2>timelines: {{m_campaignTimelinesModels?.size}}</h2>
            <context-menu></context-menu>
            <hr class="dottedHR">
            <div id="dragcontainer">
                <screen-template #st class="draggableTimeline"
                                 *ngFor="let screenTemplate of _screenTemplates | async"
                                 (contextmenu)="onContextMenu($event, screenTemplate)"
                                 (click)="_onScreenTemplateSelected(screenTemplate, st)"
                                 (onDivisionDoubleClicked)="_onDivisionDoubleClicked($event)"
                                 [setTemplate]="screenTemplate">
                </screen-template>
            </div>
            <context-menu>
                <template contextMenuItem let-item (execute)="_onContextClicked('load props ',$event.item)">
                    timeline properties for {{item?.name}}
                </template>
                <template contextMenuItem divider="true"></template>
                <template contextMenuItem (execute)="_onContextClicked('edit',$event.item)">edit layout</template>
                <template contextMenuItem (execute)="_onContextClicked('nextch',$event.item)">select next channel</template>
            </context-menu>
        </div>


    `
})
export class Sequencer extends Compbaser {

    _onContextClicked(cmd: string, screenTemplateData: IScreenTemplateData) {
        console.log(cmd + ' ' + screenTemplateData.campaignTimelineId);
        switch (cmd) {
            case 'nextch': {
                this.onSelectNextChannel()
                break;
            }
        }
    }

    public items = [
        {name: 'John', otherProperty: 'Foo'},
        {name: 'Joe', otherProperty: 'Bar'}
    ];

    public onContextMenu($event: MouseEvent, item: any): void {
        this.contextMenuService.show.next({
            event: $event,
            item: item,
        });
        $event.preventDefault();
        $event.stopPropagation();
    }


    private m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    private _screenTemplates: Observable<any>;
    private m_draggables;
    private m_thumbsContainer;
    private target;
    private x: number;
    private m_selectedScreenTemplate: ScreenTemplate;
    private m_selectedTimelineId: number;
    private m_campaignTimelineBoardViewerSelected: number = -1;
    private m_campaignTimelineChannelSelected: number = -1;
    private m_selectedCampaignId: number = -1;

    constructor(private el: ElementRef, private yp: YellowPepperService, private pepper: RedPepperService, private contextMenuService: ContextMenuService) {
        super();
        this.m_thumbsContainer = el.nativeElement;
    }


    @ViewChildren(ScreenTemplate) tmpScreenTemplates: QueryList<ScreenTemplate>;

    @Input()
    set setCampaignTimelinesModels(i_campaignTimelinesModels: List<CampaignTimelinesModel>) {
        if (!i_campaignTimelinesModels)
            return;
        this.m_campaignTimelinesModels = i_campaignTimelinesModels;
        this.m_selectedCampaignId = this.m_campaignTimelinesModels.first().getCampaignId();
        var sortedTimelines: Array<CampaignTimelinesModel> = this._sortTimelines();
        this._screenTemplates = Observable.from(sortedTimelines)
            .map(i_campaignTimelinesModelsOrdered => {
                return this._getScreenTemplate(i_campaignTimelinesModelsOrdered)
            }).combineAll()
        setTimeout(() => {
            this._createSortable('#dragcontainer');
        }, 300)
    }

    _onScreenTemplateSelected(event, screenTemplate: ScreenTemplate) {
        this.tmpScreenTemplates.forEach((i_screenTemplate) => {
            if (i_screenTemplate == screenTemplate) {
                if (this.m_selectedTimelineId != i_screenTemplate.m_screenTemplateData.campaignTimelineId) {
                    i_screenTemplate.selectFrame();
                    this.m_selectedScreenTemplate = i_screenTemplate;
                    this.m_selectedTimelineId = i_screenTemplate.m_screenTemplateData.campaignTimelineId;
                    this.m_campaignTimelineChannelSelected = -1;
                    this.m_campaignTimelineBoardViewerSelected = -1;
                    this._setAndNotifyIds();
                }
                var uiState: IUiState = {uiSideProps: SideProps.timeline}
                this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
            } else {
                i_screenTemplate.deSelectFrame();
                i_screenTemplate.deselectDivisons();
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

    private _setAndNotifyIds() {
        var uiState: IUiState = {
            campaign: {
                campaignTimelineChannelSelected: this.m_campaignTimelineChannelSelected,
                campaignTimelineBoardViewerSelected: this.m_campaignTimelineBoardViewerSelected,
                timelineSelected: this.m_selectedTimelineId
            }
        }
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    private _sortTimelines() {
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
    private _createSortable(i_selector) {
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

                    var orderedTimelines = self.reSequenceTimelines();
                    // jQuery(self.m_thumbsContainer).empty();
                    // BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).populateTimelines(orderedTimelines);
                    // var campaign_timeline_id = BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).getSelectedTimeline();
                    // self.selectTimeline(campaign_timeline_id);
                }
            }
        );
    }

    /**
     Reorder the timeline in the local msdb to match the UI order of the timeline thumbnails in the Sequencer
     @method reSequenceTimelines
     @return {Array} order of timelines ids
     **/
    reSequenceTimelines() {
        var self = this;
        var order = [];
        var timelines = jQuery('#dragcontainer', self.el.nativeElement).children().each(function (sequenceIndex) {
            var element = jQuery(this).find('[data-campaign_timeline_id]').eq(0);
            var campaign_timeline_id = jQuery(element).data('campaign_timeline_id');
            order.push(campaign_timeline_id);
            self.pepper.setCampaignTimelineSequencerIndex(self.m_selectedCampaignId, campaign_timeline_id, sequenceIndex);
        });
        this.pepper.reduxCommit();
        return order;
    }

    /**
     Sortable channel list on press
     @method _sortablePress
     **/
    private _sortablePress() {
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
    private _sortableDragStart() {
        TweenLite.set(this.target, {color: "#88CE02"});
    }

    /**
     Sortable drag channel list
     @method _sortableDrag
     **/
    private _sortableDrag() {
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
    private _sortableSnap(y) {
        return y;
        /* enable code below to use live drag snapping */
        // var h = this.target.currentHeight;
        // return Math.round(y / h) * h;
    }

    _onDivisionDoubleClicked(i_campaign_timeline_board_viewer_id) {
        this.m_campaignTimelineBoardViewerSelected = i_campaign_timeline_board_viewer_id;
        this.m_selectedScreenTemplate.selectDivison(i_campaign_timeline_board_viewer_id)
        this.yp.getChannelFromViewer(this.m_selectedTimelineId, i_campaign_timeline_board_viewer_id)
            .subscribe((result:any) => {
                this.m_campaignTimelineChannelSelected = result.channel;
                this._setAndNotifyIds()
            })
    }

    /**
     Select next channel
     @method selectNextChannel
     **/
    public onSelectNextChannel() {
        if (!this.m_selectedScreenTemplate)
            return;

        var timeline_channel_id;
        this.yp.getChannelsOfTimeline(this.m_selectedTimelineId).subscribe((channelsIDs) => {
            if (this.m_campaignTimelineChannelSelected == -1) {
                timeline_channel_id = channelsIDs[0];
            } else {
                for (var ch in channelsIDs) {
                    if (channelsIDs[ch] == this.m_campaignTimelineChannelSelected) {
                        if (_.isUndefined(channelsIDs[parseInt(ch) + 1])) {
                            timeline_channel_id = channelsIDs[0];
                        } else {
                            timeline_channel_id = channelsIDs[parseInt(ch) + 1];
                        }
                    }
                }
            }
            this.m_campaignTimelineChannelSelected = timeline_channel_id;
            this.yp.getAssignedViewerIdFromChannelId(timeline_channel_id).subscribe((i_campaign_timeline_board_viewer_id) => {
                // note: workaround for when viewer is unassigned, need to investigate
                if (_.isUndefined(i_campaign_timeline_board_viewer_id))
                    return;
                this.m_campaignTimelineBoardViewerSelected = i_campaign_timeline_board_viewer_id;
                this.m_selectedScreenTemplate.selectDivison(i_campaign_timeline_board_viewer_id)
                this._setAndNotifyIds();

                var uiState: IUiState = {uiSideProps: SideProps.channel}
                this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))

                // self._removeBlockSelection();
                // self._addChannelSelection(timeline_channel_id);
                // BB.comBroker.getService(BB.SERVICES['SEQUENCER_VIEW']).selectViewer(screenData.campaign_timeline_id, screenData.campaign_timeline_board_viewer_id);
                // BB.comBroker.fire(BB.EVENTS.ON_VIEWER_SELECTED, this, screenData);
                // BB.comBroker.fire(BB.EVENTS.CAMPAIGN_TIMELINE_CHANNEL_SELECTED, this, null, self.m_selectedChannel);
            });
        });
    }

    ngOnInit() {
    }

    destroy() {
    }
}


