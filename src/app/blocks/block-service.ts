import {Inject, Injectable} from "@angular/core";
import {getDiggData} from "./block-digg";
import {getYouTubeData} from "./block-youtube";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Once} from "../../decorators/once-decorator";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import X2JS from 'x2js';
import {StoreModel} from "../../store/model/StoreModel";
import {blockCodes, HelperPepperService} from "../../services/helperpepper-service";
import * as _ from 'lodash';
import {Observable} from "rxjs";

export interface IBlockData {
    blockID: number;
    blockType: string;
    blockName: string;
    blockDescription: string;
    blockIcon: string;
    blockFontAwesome: string;
    blockAcronym: string;
    blockMinWidth: number;
    blockMinHeight: number;
    blockData: CampaignTimelineChanelPlayersModel
}

@Injectable()
export class BlockService {
    parser;

    private m_zIndex = -1;
    private m_minSize = {w: 50, h: 50};

    constructor(@Inject('BLOCK_PLACEMENT') private blockPlacement: string, private yp: YellowPepperService, private hp: HelperPepperService) {
        this.parser = new X2JS({
            escapeMode: true,
            attributePrefix: "_",
            arrayAccessForm: "none",
            emptyNodeForm: "text",
            enableToStringFunc: true,
            arrayAccessFormPaths: [],
            skipEmptyTextNodesForObj: true
        });
    }

    public getServiceType(): string {
        return this.blockPlacement;
    }

    // getPlayerData = (i_type) => {
    //     if (i_type == '1') {
    //         return getDiggData();
    //     } else {
    //         return getYouTubeData();
    //     }
    //
    // }

    /**
     Get block data as a json formatted object literal and return to caller
     @method getBlockData
     @return {object} data
     The entire block data members which can be made public
     **/
    public getBlockData(blockId): Observable<IBlockData> {

        return this.yp.getBlockRecord(blockId)
            .mergeMap((i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {

                var xml = i_campaignTimelineChanelPlayersModel.getPlayerData();
                let playerData = this.parser.xml2js(xml);

                if (playerData['Player']['_player']) {
                    /** Standard block **/
                    var code = playerData['Player']['_player'];
                    var blockType = blockCodes[code]
                    if (_.isUndefined(blockType)) {
                        var e = `Panic using a component / block which is not supported yet ${code} ${blockType}`;
                        throw new Error(e)
                    }

                } else {
                    /** Scene **/
                    var blockCode = blockCode['BLOCKCODE_SCENE'];
                    // if (_.isUndefined(i_scene_id)) {
                    //     var domPlayerData = $.parseXML(i_player_data);
                    //     i_scene_id = $(domPlayerData).find('Player').attr('hDataSrc');
                }

                var data = {
                    blockID: blockId,
                    blockType: blockType,
                    blockName: this.hp.getBlockBoilerplate(code).name,
                    blockDescription: this.hp.getBlockBoilerplate(code).description,
                    blockIcon: this.hp.getBlockBoilerplate(code).icon,
                    blockFontAwesome: this.hp.getBlockBoilerplate(code).fontAwesome,
                    blockAcronym: this.hp.getBlockBoilerplate(code).acronym,
                    blockMinWidth: this.m_minSize.w,
                    blockMinHeight: this.m_minSize.h,
                    blockData: i_campaignTimelineChanelPlayersModel
                };

                return Observable.of(data)
            })
    }

    // /**
    //  Get the XML player data of a block, depending where its placed
    //  If you like to view XML raw data, be sure to debug domPlayerData.children[0].outerHTML
    //  @method _getBlockPlayerData
    //  @return {Object} player data of block (aka player) parsed as DOM
    //  **/
    // private _getBlockPlayerData(i_block_id, i_cb: (campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => void) {
    //
    //     switch (this.blockPlacement) {
    //         case 'CHANNEL': {
    //             this._getPlayerData(i_block_id, (campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
    //                 var xml = campaignTimelineChanelPlayersModel.getPlayerData();
    //                 let playerData = this.parser.xml2js(xml);
    //                 if (playerData['Player']['_player']) {
    //                     // Standard block
    //                     var blockCode = playerData['Player']['_player'];
    //                     var blockType = blockCodes[blockCode];
    //                     console.log(blockCode + ' ' + blockType);
    //                     i_cb(campaignTimelineChanelPlayersModel)
    //                 } else {
    //                     // Scene
    //                     // var blockCode = const BLOCKCODE_SCENE;
    //                     // if (_.isUndefined(i_scene_id)) {
    //                     //     var domPlayerData = $.parseXML(i_player_data);
    //                     //     i_scene_id = $(domPlayerData).find('Player').attr('hDataSrc');
    //                 }
    //             })
    //
    //             // recBlock = pepper.getCampaignTimelineChannelPlayerRecord(self.m_block_id);
    //             // return $.parseXML(recBlock['player_data']);
    //             // to view data debug domPlayerData.children[0].outerHTML
    //             break;
    //         }
    //         case 'SCENE': {
    //             // return pepper.getScenePlayerdataBlock(self.m_sceneID, self.m_block_id);
    //             // to view data debug domPlayerData.children[0].outerHTML
    //             break;
    //         }
    //     }
    // }

    private _getPlayerDataV2(i_block_id): Observable<CampaignTimelineChanelPlayersModel> {
        return this.yp.getBlockRecord(i_block_id);
    }

    /**
     *  get player data from store for block id
     * @param i_block_id
     * @param i_cb
     * @returns {Subscription}
     * @private
     */
    @Once()
    private _getPlayerData(i_block_id, i_cb: (campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => void) {
        return this.yp.getBlockRecord(i_block_id)
            .catch((e) => {
                alert('e2' + e);
                return Observable.of(e);
            })
            .subscribe((v) => {
                console.log(v + ' ' + i_block_id);
                i_cb(v)
            }, (e) => console.error(e))
    }

}
