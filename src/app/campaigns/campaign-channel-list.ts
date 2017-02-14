import {Component, ElementRef} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignTimelineBoardViewerChanelsModel, CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {BlockService, IBlockData} from "../blocks/block-service";
import {Observable} from "rxjs";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'campaign-channel-list',
    styles: [`
        * {
            font-size: 1.1em !important;
        }

        .dragch {
            float: right;
            margin: 30px;
            position: relative;
            right: 30px;

        }

        .channelListItems {
            cursor: pointer;
        }

        .channelListItems a i {
            display: inline;
            font-size: 40px;
            padding-right: 20px;
        }

        .channelListItems a span {
            display: inline;
            font-size: 1.5em;
            position: relative;
            top: -12px;
        }
    `],
    template: `
        <small class="release">my component
            <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
        </small>
        <small class="debug">{{me}}</small>
        <div id="sortableChannel">
            <li (click)="_onBlockSelected(block)" *ngFor="let block of m_blockList" [attr.data-block_id]="block.blockID" class=".channelListItems list-group-item">
                <a href="#">
                    <i class="fa {{block.blockFontAwesome}}"></i>
                    <span>{{block.blockName}}</span>
                    <i style="padding: 0; margin: 0" class="dragch fa fa-arrows-v"></i>
                    <span class="blockLengthTimer hidden-xs">  {{block.length}}</span>
                </a>
            </li>
        </div>
    `
})
export class CampaignChannelList extends Compbaser {

    private selected_campaign_timeline_id: number = -1;
    private selected_campaign_timeline_chanel_id: number = -1;
    private m_draggables;
    private target;
    private y;

    m_blockList: Array<IBlockData> = [];

    constructor(private yp: YellowPepperService, private rp: RedPepperService, private el: ElementRef, private blockService: BlockService) {
        super();
        this.listenChannelSelected();
        this.preventRedirect(true);
    }

    private _onBlockSelected(block: IBlockData) {
        console.log(block.blockID);
    }

    private listenChannelSelected() {
        this.cancelOnDestroy(
            this.yp.listenCampaignTimelineBoardViewerSelected()
                .combineLatest(this.yp.listenTimelineSelected(),
                    (i_channelModel: CampaignTimelineBoardViewerChanelsModel, i_timelinesModel: CampaignTimelinesModel) => {
                        this.selected_campaign_timeline_chanel_id = i_channelModel.getCampaignTimelineChanelId();
                        this.selected_campaign_timeline_id = i_timelinesModel.getCampaignTimelineId();
                        return i_channelModel.getCampaignTimelineBoardViewerChanelId()
                    }).mergeMap(i_boardViewerChanelId => {
                return this.yp.getChannelFromCampaignTimelineBoardViewer(i_boardViewerChanelId)
            }).mergeMap((i_campaignTimelineChanelsModel: CampaignTimelineChanelsModel) => {
                return this.yp.getChannelBlocks(i_campaignTimelineChanelsModel.getCampaignTimelineChanelId())
            }).mergeMap(blockIds => {
                if (blockIds.length == 0)
                    return Observable.of([])
                return Observable.from(blockIds)
                    .switchMap((blockId) => {
                        return this.blockService.getBlockData(blockId)
                            .map((blockData: IBlockData) => this.yp.getBlockTimelineChannelBlockLength(blockData.blockID)
                                .map(length => Object.assign(blockData, {length: length}))
                            )
                    })
                    .combineAll()
            }).mergeMap((i_blockList: Array<IBlockData>) => {
                return this.yp.calcTimelineTotalDuration(this.selected_campaign_timeline_id).map(longestTimeline => {
                    return {
                        longestTimeline, i_blockList
                    }
                })
            }).subscribe(a => {
                console.log('total block in channel ' + a);


                // todo: sort properly
                // for (var block_id in self.m_blocks) {
                //     var recBlock = pepper.getBlockRecord(block_id);
                //     var player_data = pepper.getBlockRecord(block_id)['player_data'];
                //     var domPlayerData = $.parseXML(player_data);
                //     var sceneHandle = $(domPlayerData).find('Player').attr('player');
                //     // workaround to remove scenes listed inside table campaign_timeline_chanel_players
                //     if (sceneHandle == '3510')
                //         continue;
                //     var offsetTime = parseInt(recBlock['player_offset_time']);
                //     blocksSorted[offsetTime] = self.m_blocks[block_id];
                // }


                // this.m_blockList = i_blockList;
                // setTimeout(() => {
                //     this._createSortable('#sortableChannel');
                // }, 300)

            }, e => console.error(e))
        )
    }

    /**
     Create a draggable sortable channel list
     @method _createSortable
     @param {String} i_selector
     **/
    _createSortable(i_selector) {
        var self = this;

        if (jQuery(i_selector).children().length == 0) return;
        var sortable = document.querySelector(i_selector);
        self.m_draggables = Draggable.create(sortable.children, {
            type: "y",
            bounds: sortable,
            dragClickables: true,
            edgeResistance: 1,
            onPress: self._sortablePress,
            onDragStart: self._sortableDragStart,
            onDrag: self._sortableDrag,
            liveSnap: self._sortableSnap,
            onDragEnd: function () {
                var t = this.target,
                    max = t.kids.length - 1,
                    newIndex = Math.round(this.y / t.currentHeight);
                newIndex += (newIndex < 0 ? -1 : 0) + t.currentIndex;
                if (newIndex === max) {
                    t.parentNode.appendChild(t);
                } else {
                    t.parentNode.insertBefore(t, t.kids[newIndex + 1]);
                }
                TweenLite.set(t.kids, {yPercent: 0, overwrite: "all"});
                TweenLite.set(t, {y: 0, color: ""});
                self._reOrderChannelBlocks();

                //_.each(self.m_draggables, function(i){
                //    this.enabled(false);
                //});
            }
        });
    }


    /**
     Update the blocks offset times according to current order of LI elements and reorder accordingly in msdb.
     @method _reOrderChannelBlocks
     @return none
     **/
    _reOrderChannelBlocks() {
        var self = this
        var blocks = jQuery('#sortableChannel', this.el.nativeElement).children();
        var playerOffsetTime: any = 0;
        $(blocks).each(function (i) {
            var block_id = $(this).data('block_id');
            //todo: fix to read from yp not rp
            var recBlock = self.rp.getBlockRecord(block_id);
            var playerDuration = recBlock['player_duration']
            self.rp.setBlockRecord(block_id, 'player_offset_time', playerOffsetTime);
            console.log('player ' + block_id + ' offset ' + playerOffsetTime + ' playerDuration ' + playerDuration);
            playerOffsetTime = parseFloat(playerOffsetTime) + parseFloat(playerDuration);
        });
        //todo: fix to read from yp not rp
        self.rp.calcTimelineTotalDuration(this.selected_campaign_timeline_id);
        self.rp.reduxCommit();

        // BB.comBroker.fire(BB.EVENTS.CAMPAIGN_TIMELINE_CHANGED, self);
        // BB.comBroker.fire(BB.EVENTS.BLOCK_SELECTED, this, null, self.selected_block_id);
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
        t.currentIndex = i;
        t.currentHeight = t.offsetHeight;
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
            indexChange = Math.round(this.y / t.currentHeight),
            bound1 = t.currentIndex,
            bound2 = bound1 + indexChange;
        if (bound1 < bound2) { // moved down
            TweenLite.to(elements.splice(bound1 + 1, bound2 - bound1), 0.15, {yPercent: -100});
            TweenLite.to(elements, 0.15, {yPercent: 0});
        } else if (bound1 === bound2) {
            elements.splice(bound1, 1);
            TweenLite.to(elements, 0.15, {yPercent: 0});
        } else { // moved up
            TweenLite.to(elements.splice(bound2, bound1 - bound2), 0.15, {yPercent: 100});
            TweenLite.to(elements, 0.15, {yPercent: 0});
        }
    }

    /**
     snap channels to set rounder values
     @method _sortableSnap
     **/
    _sortableSnap(y) {
        return y;
        // enable code below to enable snapinnes on dragging
        // var h = this.target.currentHeight;
        // return Math.round(y / h) * h;
    }

    ngOnInit() {
    }

    destroy() {
    }
}
