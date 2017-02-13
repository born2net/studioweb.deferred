import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelineBoardViewerChanelsModel, CampaignTimelineChanelPlayersModel, CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {Once} from "../../decorators/once-decorator";
import {BlockService, IBlockData} from "../blocks/block-service";
import {Observable} from "rxjs";
import {Lib} from "../../Lib";

@Component({
    selector: 'campaign-channel-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="release">my component
            <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
        </small>
        <small class="debug">{{me}}</small>
    `,
})
export class CampaignChannelList extends Compbaser {

    private selected_campaign_timeline_id: number = -1;
    private selected_campaign_timeline_chanel_id: number = -1;

    constructor(private yp: YellowPepperService, private blockService: BlockService) {
        super();
        console.log(blockService.getServiceType());
        this.listenChannelChanged();
    }

    private listenChannelChanged() {
        this.cancelOnDestroy(
            this.yp.listenCampaignTimelineBoardViewerSelected()
                .combineLatest(this.yp.listenTimelineSelected(),
                    (campaignTimelineBoardViewerChanelsModel: CampaignTimelineBoardViewerChanelsModel, campaignTimelinesModel: CampaignTimelinesModel) => {
                        this.selected_campaign_timeline_id = campaignTimelinesModel.getCampaignTimelineId();
                        return {
                            a: campaignTimelineBoardViewerChanelsModel.getCampaignTimelineBoardViewerChanelId(),
                            b: this.selected_campaign_timeline_id
                        };
                    }).mergeMap((ids: any) => this.yp.getChannelFromCampaignTimelineBoardViewer(ids.a))
                .sub((i_campaignTimelineChanelsModel: CampaignTimelineChanelsModel) => {

                    /** >>> must Try() here otherwise lost errors **/
                    Lib.Try(() =>
                        this._loadChannelBlocks(i_campaignTimelineChanelsModel.getCampaignTimelineChanelId())
                    );

                    // console.log(i_campaignTimelineChanelsModel.getCampaignTimelineChanelId());
                    // console.log(i_campaignTimelineChanelsModel.getChanelName());
                    // this._loadChannelBlocks(this.selected_campaign_timeline_id, i_campaignTimelineChanelsModel.getCampaignTimelineChanelId());

                }, (e) => console.error(e))
        )
    }

    /**
     Load the channel list with its own blocks and refresh the UI.
     @method _loadChannelBlocks
     @param {Number} i_campaign_timeline_id
     @param {Number} i_campaign_timeline_chanel_id
     @return none
     **/
    _loadChannelBlocks(i_campaign_timeline_chanel_id) {
        this.getBlockChannelIds(i_campaign_timeline_chanel_id, (blockIds) => {
            for (var blockId in blockIds) {
                this.blockService.getBlockData(blockId, (blockData: IBlockData) => {
                    console.log(blockData);
                    // if (1) throw new Error('test error')
                })
            }
        })
    }

    @Once()
    private getBlockChannelIds(i_campaign_timeline_chanel_id, i_cb) {
        return this.yp.getChannelBlocks(i_campaign_timeline_chanel_id)
            .subscribe((blockIds: Array<number>) => {
                i_cb(blockIds)
            }, (e) => {
                console.error(e)
            })
    }

    ngOnInit() {
    }

    destroy() {
    }
}


// self.selected_campaign_timeline_chanel_id = i_campaign_timeline_chanel_id;
//
// var timeline = BB.comBroker.getService(BB.SERVICES['CAMPAIGN_VIEW']).getTimelineInstance(i_campaign_timeline_id);
// var channel = timeline.getChannelInstance(i_campaign_timeline_chanel_id);
// var blocks = channel.getBlocks();
// var xdate = BB.comBroker.getService('XDATE');
//
// for (var block in blocks) {
//     var blockData = blocks[block].getBlockData();
//     var duration = pepper.getBlockTimelineChannelBlockLength(blockData.blockID).totalInSeconds;
//     var durationFormatted = xdate.clearTime().addSeconds(duration).toString('HH:mm:ss');
//     $(Elements.SORTABLE).append($('<li class="' + BB.lib.unclass(Elements.CLASS_CHANNEL_LIST_ITEMS) + '  list-group-item" data-block_id="' + blockData.blockID + '">' +
//         '<a href="#">' +
//         //'<img  class="img-responsive" src="' + blockData.blockIcon + '"/>' +
//         '<i class="fa ' + blockData.blockFontAwesome + '"></i>' +
//         '<span>' + blockData.blockName + '</span>' +
//         '<i style="padding: 0; margin: 0" class="dragch fa fa-arrows-v"></i>' +
//         '<span class="' + BB.lib.unclass(Elements.CLASS_BLOCK_LENGTH_TIMER) + ' hidden-xs">' + durationFormatted + '</span>' +
//         '</a>' +
//         '</li>'));
// }
// self._listenBlockSelected();
// self._createSortable(Elements.SORTABLE);