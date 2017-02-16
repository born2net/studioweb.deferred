import {AfterViewInit, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {BlockService, IBlockData} from "./block-service";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import {BlockLabels, HelperPepperService} from "../../services/helperpepper-service";
import {ColorPickerService} from "ngx-color-picker";


@Component({
    selector: 'block-prop-container',
    template: `
        <small class="debug">{{me}}</small>
        <tabs>
            <tab [tabtitle]="'style'" >
                <input [(colorPicker)]="m_color" [cpPosition]="'bottom'" [style.background]="m_color" [value]="m_color"/>
            </tab>
            <tab [tabtitle]="m_tabTitle" >
                <ul [ngSwitch]="m_blockTypeSelected">
                    <div *ngSwitchCase="m_blockLabels.BLOCKCODE_IMAGE">
                        <block-prop-image [setBlockId]="m_blockId"></block-prop-image>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.LABEL">
                        <h1>label</h1>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.QR">
                        <h1>QR</h1>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.CLOCK">
                        <h1>Clock</h1>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.HTML">
                        <h1>HTML</h1>
                    </div>
                    <div *ngSwitchDefault>
                        <h3>no block prop found, new?</h3>
                        {{m_blockTypeSelected}}
                    </div>
                </ul>
            </tab>
        </tabs>
    `,
})
export class BlockPropContainer extends Compbaser implements AfterViewInit {

    m_blockTypeSelected: string = 'none';
    m_blockLabels = BlockLabels;
    m_blockId: number;
    m_tabTitle: string = 'none';
    m_color;

    constructor(private yp: YellowPepperService, private rp: RedPepperService, private bs: BlockService, private hp: HelperPepperService, private cpService: ColorPickerService) {
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
                    this.m_tabTitle = blockData.blockAcronym;
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