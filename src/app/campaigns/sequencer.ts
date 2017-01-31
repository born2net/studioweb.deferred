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
        
            <!--<div>{{screenTemplate.name}}</div>-->
            <!--<div id="draggableTimelines">-->
                <screen-template class="draggableTimeline" *ngFor="let screenTemplate of _screenTemplates | async" 
                                  (click)="_onScreenTemplateSelected(screenTemplate)" [setTemplate]="screenTemplate"></screen-template>
            <!--</div>-->
        

    `,
})
export class Sequencer extends Compbaser {

    private m_campaignTimelinesModels: List<CampaignTimelinesModel>;
    _screenTemplates: Observable<any>;
    m_draggables;
    m_thumbsContainer;
    target;
    x;

    constructor(private el: ElementRef, private yp: YellowPepperService, private pepper: RedPepperService) {
        super();
        this.m_thumbsContainer = el.nativeElement;
    }

    _onScreenTemplateSelected(event) {
        console.log(event);
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
        setTimeout(()=>{
            this._createSortable('.draggableTimeline');
        },300)

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
                    //newIndex = Math.round(this.x / t.currentWidth);
                    newIndex = Math.ceil(this.x / t.currentWidth);
                newIndex += (newIndex < 0 ? -1 : 0) + t.originalIndex;
                if (newIndex === max) {
                    t.parentNode.appendChild(t);
                } else {
                    t.parentNode.insertBefore(t, t.kids[newIndex + 1]);
                }
                TweenLite.set(t.kids, {xPercent: 0, overwrite: "all"});
                TweenLite.set(t, {y: 0, color: ""});
                // var orderedTimelines = self.reSequenceTimelines();
                // jQuery(self.m_thumbsContainer).empty();
                // BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).populateTimelines(orderedTimelines);
                // var campaign_timeline_id = BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).getSelectedTimeline();
                // self.selectTimeline(campaign_timeline_id);

            }
        });
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

