import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelineBoardViewerChanelsModel, CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {BlockService, IBlockData} from "../blocks/block-service";
import {Observable} from "rxjs";

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
        this.listenChannelChanged();
    }

    private listenChannelChanged() {
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
                            .map((v) => Observable.of(v))
                    })
                    .combineAll()
            }).subscribe((i_blockList: Array<IBlockData>) => {
                console.log(i_blockList.length);
            }, e => console.error(e))
        )
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