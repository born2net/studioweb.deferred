import {Component, ElementRef, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignTimelineBoardViewerChanelsModel, CampaignTimelineChanelPlayersModel, CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {BlockService, IBlockData} from "../blocks/block-service";
import {Observable} from "rxjs";
import {RedPepperService} from "../../services/redpepper.service";
import {YellowPepperService} from "../../services/yellowpepper.service";
import * as _ from "lodash";
import {Once} from "../../decorators/once-decorator";
import {List} from "immutable";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {DraggableList} from "../../comps/draggable-list";

@Component({
    selector: 'campaign-channels',
    styles: [`
        * {
            font-size: 1.1em !important;
        }

        .dragch {
            float: right;
            padding-right: 10px;
            position: relative;
            top: 5px;
        }

        .lengthTimer {
            float: right;
            padding-right: 10px;
        }

        .listItems {
            cursor: pointer;
        }

        .listItems a i {
            display: inline;
            font-size: 40px;
            padding-right: 20px;
        }

        .listItems a span {
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
        <draggable-list (onItemSelected)="_onItemSelected($event)" [customTemplate]="customTemplate" (onDragComplete)="_onDragComplete($event)" [items]="m_blockList"></draggable-list>
        <template #customTemplate let-item>
            <a href="#" [attr.data-block_id]="item.blockID">
                <i class="fa {{item.blockFontAwesome}}"></i>
                <span>{{item.blockName}}</span>
                <i class="dragch fa fa-arrows-v"></i>
                <span class="lengthTimer hidden-xs"> 
                    {{item.length | FormatSecondsPipe}}
                </span>
            </a>
        </template>
    `
})

export class CampaignChannels extends Compbaser {

    m_selectedIdx = -1;
    private selected_campaign_timeline_id: number = -1;
    private selected_campaign_timeline_chanel_id: number = -1;
    m_blockList: List<IBlockData> = List([]);

    constructor(private yp: YellowPepperService, private rp: RedPepperService, private el: ElementRef, private blockService: BlockService) {
        super();
        this.listenChannelSelected();
        this.preventRedirect(true);
    }

    @ViewChild(DraggableList)
    draggableList: DraggableList;

    private listenChannelSelected() {
        this.cancelOnDestroy(
            this.yp.listenCampaignTimelineBoardViewerSelected(true)
                .filter((v) => {
                    if (v == null) this.m_blockList = List([]);
                    return v != null;
                }).withLatestFrom(this.yp.listenTimelineSelected(),
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
                    }).combineAll()
            }).sub((i_blockList: Array<IBlockData>) => {
                // console.log('total block in channel ' + i_blockList.length);
                this.m_blockList = List(this._sortBlock(i_blockList));
                this.m_selectedIdx = -1;
                this.draggableList.createSortable()

            }, e => console.error(e))
        )
    }

    _onItemSelected(event) {
        var blockData:IBlockData = event.item;
        var uiState: IUiState = {uiSideProps: SideProps.channelBlock}
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _onDragComplete(i_blocks) {
        this._reOrderChannelBlocks(i_blocks);
    }

    private _sortBlock(i_blockList: Array<IBlockData>): Array<IBlockData> {
        var blocksSorted = {};
        _.forEach(i_blockList, (i_block: IBlockData) => {
            var player_data = i_block.blockData.getPlayerData();
            var domPlayerData = $.parseXML(player_data);
            var sceneHandle = jQuery(domPlayerData).find('Player').attr('player');
            // workaround to remove scenes listed inside table campaign_timeline_chanel_players
            if (sceneHandle == '3510')
                return;
            var offsetTime = parseInt(i_block.blockData.getPlayerOffsetTime());
            blocksSorted[offsetTime] = i_block;
        });
        return _.values(blocksSorted) as Array<IBlockData>;
    }

    /**
     Update the blocks offset times according to current order of LI elements and reorder accordingly in msdb.
     @method _reOrderChannelBlocks
     @return none
     **/
    _reOrderChannelBlocks(i_blocks) {
        var self = this
        var blocks = i_blocks; //jQuery('#sortableChannel', this.el.nativeElement).children();
        var playerOffsetTime: any = 0;
        jQuery(blocks).each(function (i) {
            var block_id = jQuery('[data-block_id]',this).data('block_id');
            self._getBlockRecord(block_id, (i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
                var playerDuration = i_campaignTimelineChanelPlayersModel.getPlayerDuration();
                self.rp.setBlockRecord(block_id, 'player_offset_time', playerOffsetTime);
                console.log('player ' + block_id + ' offset ' + playerOffsetTime + ' playerDuration ' + playerDuration);
                playerOffsetTime = parseFloat(playerOffsetTime) + parseFloat(playerDuration);
            })
        });
        self.rp.updateTotalTimelineDuration(this.selected_campaign_timeline_id);
        self.rp.reduxCommit();
    }

    @Once()
    private _getBlockRecord(i_blockId, i_cb: (i_blockId: CampaignTimelineChanelPlayersModel) => void) {
        return this.yp.getBlockRecord(i_blockId)
            .subscribe((block: CampaignTimelineChanelPlayersModel) => {
                i_cb(block);
            }, (e) => console.error(e));
    }


    ngOnInit() {
    }

    destroy() {
    }
}
