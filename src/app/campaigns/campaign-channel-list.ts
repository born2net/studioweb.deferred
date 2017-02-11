import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelineBoardViewerChanelsModel, CampaignTimelineChanelsModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";

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

    constructor(private yp: YellowPepperService) {
        super();
        this.listenChannelChanged();
    }

    private listenChannelChanged() {
        this.cancelOnDestroy(
            this.yp.listenCampaignTimelineBoardViewerSelected()
                .combineLatest(this.yp.listenTimelineSelected(),
                    (campaignTimelineBoardViewerChanelsModel: CampaignTimelineBoardViewerChanelsModel, campaignTimelinesModel: CampaignTimelinesModel) => {
                        var a = campaignTimelineBoardViewerChanelsModel.getCampaignTimelineBoardViewerChanelId()
                        var b = campaignTimelinesModel.getCampaignTimelineId()
                        return {a, b}
                    }).mergeMap((ids) => this.yp.getChannelFromCampaignTimelineBoardViewer(ids.a, ids.b))
                .subscribe((i_campaignTimelineChanelsModel: CampaignTimelineChanelsModel) => {
                    console.log(i_campaignTimelineChanelsModel.getCampaignTimelineChanelId());
                    console.log(i_campaignTimelineChanelsModel.getChanelName());
                })
        )
    }

    ngOnInit() {
    }

    destroy() {
    }
}