import {AfterViewInit, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";

@Component({
    selector: 'campaign-duration',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="release">my component
            <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
        </small>
        <small class="debug">{{me}}</small>
        <span style="font-size: 1em" data-localize="campaignLength">campaign length:</span>
        <span id="timelinesTotalLength" style="font-size: 1em">{{m_duration}} </span>

    `,
})
export class CampaignDuration extends Compbaser implements AfterViewInit {

    m_duration = '00:00:00'

    constructor(private yp: YellowPepperService) {
        super();
    }

    ngAfterViewInit() {

        this.cancelOnDestroy(
            this.yp.listenTimelineDurationChanged()
                .subscribe((v) => {
                    console.log(v);
                })
        )
    }

    ngOnInit() {
    }

    destroy() {
    }
}