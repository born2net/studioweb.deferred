import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {BlockLabels, BlockService, IBlockData} from "./block-service";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import {ColorPickerService} from "ngx-color-picker";
import {Tabs} from "../../comps/tabs/tabs";
import {Tab} from "../../comps/tabs/tab";


@Component({
    selector: 'block-prop-container',
    template: `
        <small class="debug">{{me}}</small>
        <tabs>
            <tab [tabtitle]="'style'">
                <block-prop-common [setBlockData]="m_blockData"></block-prop-common>
            </tab>
            <tab [tabtitle]="m_tabTitle">
                <div [ngSwitch]="m_blockTypeSelected">
                    <div *ngSwitchCase="m_blockLabels.BLOCKCODE_IMAGE">
                        <block-prop-image [setBlockData]="m_blockData"></block-prop-image>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.LABEL">
                        <h1>label</h1>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.QR">
                        <h1>QR</h1>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.CLOCK">
                        <block-prop-clock [setBlockData]="m_blockData"></block-prop-clock>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.HTML">
                        <block-prop-html [setBlockData]="m_blockData"></block-prop-html>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.BLOCKCODE_WORLD_WEATHER">
                        <block-prop-weather [setBlockData]="m_blockData"></block-prop-weather>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.BLOCKCODE_INSTAGRAM">
                        <block-prop-instagram [setBlockData]="m_blockData"></block-prop-instagram>
                    </div>
                    <div *ngSwitchDefault>
                        <h3>no block prop found, new?</h3>
                        {{m_blockTypeSelected}}
                    </div>
                </div>
            </tab>
            <tab #settings [tabtitle]="'settings'">
                <div [ngSwitch]="m_blockTypeSelected">
                    <div *ngSwitchCase="m_blockLabels.BLOCKCODE_WORLD_WEATHER">
                        <block-prop-weather [jsonMode]="true" [setBlockData]="m_blockData"></block-prop-weather>
                    </div>
                    <div *ngSwitchCase="m_blockLabels.BLOCKCODE_INSTAGRAM">
                        <block-prop-instagram [jsonMode]="true" [setBlockData]="m_blockData"></block-prop-instagram>
                    </div>
                </div>
            </tab>
        </tabs>
    `,
})
export class BlockPropContainer extends Compbaser implements AfterViewInit {

    m_blockTypeSelected: string = 'none';
    m_blockLabels = BlockLabels;
    m_blockData: IBlockData;
    m_tabTitle: string = 'none';
    m_color;

    constructor(private yp: YellowPepperService, private bs: BlockService, private cpService: ColorPickerService) {
        super();
        // console.log(this.bs.getServiceType());

        this.cancelOnDestroy(
            //
            this.yp.listenBlockChannelSelectedOrChanged()
                .mergeMap((i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
                    return this.bs.getBlockData(i_campaignTimelineChanelPlayersModel.getCampaignTimelineChanelPlayerId())
                })
                .subscribe((blockData: IBlockData) => {
                    this.m_blockTypeSelected = blockData.blockCode;
                    this.m_tabTitle = blockData.blockAcronym;
                    this.m_blockData = blockData;
                    if (!this.settings) return;
                    if (blockData.playerDataJsonHandle) {
                        this.settings.show = true;
                    } else {
                        this.settings.show = false;
                    }

                }, (e) => console.error(e))
        )
    }

    @ViewChild('settings')
    settings: Tab;


    ngAfterViewInit() {
    }

    ngOnInit() {
    }

    destroy() {
    }
}