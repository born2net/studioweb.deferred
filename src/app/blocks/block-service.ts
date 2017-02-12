import {Inject, Injectable} from "@angular/core";
import {getDiggData} from "./block-digg";
import {getYouTubeData} from "./block-youtube";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Once} from "../../decorators/once-decorator";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import {Observable} from "rxjs";
// import * as xml2js from "xml2js";
// import "X2JS";
//
// declare const X2JS: any;

import X2JS from 'x2js';


@Injectable()
export class BlockService {
    parser;

    constructor(@Inject('BLOCK_PLACEMENT') private blockPlacement: string, private yp: YellowPepperService) {
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
    public getBlockPlayerData(i_block_id) {

        switch (this.blockPlacement) {
            case 'CHANNEL': {
                this._getPlayerData(i_block_id, (campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
                    var xml = campaignTimelineChanelPlayersModel.getPlayerData();
                    let playerData = this.parser.xml2js(xml);
                    if (playerData['Player']['_player']) {
                        // Standard block
                        var blockCode = playerData['Player']['_player'];
                        console.log(blockCode);
                    } else {
                        // Scene
                        // var blockCode = BB.CONSTS.BLOCKCODE_SCENE;
                        // if (_.isUndefined(i_scene_id)) {
                        //     var domPlayerData = $.parseXML(i_player_data);
                        //     i_scene_id = $(domPlayerData).find('Player').attr('hDataSrc');
                    }
                })

                // recBlock = pepper.getCampaignTimelineChannelPlayerRecord(self.m_block_id);
                // return $.parseXML(recBlock['player_data']);
                // to view data debug domPlayerData.children[0].outerHTML
                break;
            }
            case 'SCENE': {
                // return pepper.getScenePlayerdataBlock(self.m_sceneID, self.m_block_id);
                // to view data debug domPlayerData.children[0].outerHTML
                break;
            }
        }
        var data = {
            blockID: i_block_id,
            // blockType: self.m_blockType,
            // blockName: self.m_blockName,
            // blockDescription: self.m_blockDescription,
            // blockIcon: self.m_blockIcon,
            // blockFontAwesome: self.m_blockFontAwesome,
            // blockAcronym: self.m_blockAcronym,
            // blockMinWidth: self.m_minSize.w,
            // blockMinHeight: self.m_minSize.h,
            // blockData: self._getBlockPlayerData()
        };
        return data;
    }

    private processXml(context, xmlData, cb) {
        context.parseString(xmlData, {attrkey: 'attr'}, function (err, result) {
            if (err || !result)
                return cb(null);
            return cb(result);
        })
    }

    @Once()
    private _getPlayerData(i_block_id, i_cb) {
        return this.yp.getBlockRecord(i_block_id)
            .subscribe((result) => {
                i_cb(result)
            })
    }

}
