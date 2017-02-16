import {AfterViewInit, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {BlockService, IBlockData} from "./block-service";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import {BlockLabels, HelperPepperService} from "../../services/helperpepper-service";


@Component({
    selector: 'block-prop',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <ul [ngSwitch]="m_blockTypeSelected">
            <div *ngSwitchCase="m_blockLabels.BLOCKCODE_IMAGE">
                <h1>Image</h1>
            </div>
            <div *ngSwitchCase="m_blockLabels.LABEL">
                <h1>label</h1>
            </div>
            <div *ngSwitchCase="m_blockLabels.QR">
                <h1>QR</h1>
            </div>
            <div *ngSwitchDefault>
                <h3>no block prop found, new?</h3>
            </div>
        </ul>
        {{m_blockId}}
    `,
})
export class BlockProp extends Compbaser implements AfterViewInit {

    m_blockTypeSelected: string = 'none';
    m_blockLabels = BlockLabels;
    m_blockId: number;

    constructor(private yp: YellowPepperService, private rp: RedPepperService, private bs: BlockService, private hp: HelperPepperService) {
        super();
        // console.log(this.bs.getServiceType());

        this.cancelOnDestroy(
            //
            this.yp.listenBlockChannelSelected()
                .mergeMap((i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
                    return this.bs.getBlockData(i_campaignTimelineChanelPlayersModel.getCampaignTimelineChanelPlayerId())
                })
                .subscribe((blockData: IBlockData) => {
                    this.m_blockTypeSelected = blockData.blockCode;
                    console.log(this.m_blockTypeSelected);
                    this.m_blockId = blockData.blockID;
                }, (e) => console.error(e))
        )


    }

    ngAfterViewInit() {
    }

    ngOnInit() {
    }

    destroy() {
    }
}