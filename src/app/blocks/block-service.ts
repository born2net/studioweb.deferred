import {Inject, Injectable} from "@angular/core";
import {getDiggData} from "./block-digg";
import {getYouTubeData} from "./block-youtube";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Once} from "../../decorators/once-decorator";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import X2JS from 'x2js';


const blockCodes = {
    3510: 'BLOCKCODE_SCENE',
    4100: 'BLOCKCODE_COLLECTION',
    4500: 'BLOCKCODE_TWITTER',
    4505: 'BLOCKCODE_TWITTER_ITEM',
    4300: 'BLOCKCODE_JSON',
    4310: 'BLOCKCODE_JSON_ITEM',
    6010: 'BLOCKCODE_WORLD_WEATHER',
    6022: 'BLOCKCODE_GOOGLE_SHEETS',
    6020: 'BLOCKCODE_CALENDAR',
    6230: 'BLOCKCODE_TWITTERV3',
    6050: 'BLOCKCODE_INSTAGRAM',
    6000: 'BLOCKCODE_DIGG',
    3130: 'BLOCKCODE_IMAGE',
    3140: 'BLOCKCODE_SVG',
    3100: 'BLOCKCODE_VIDEO',
    3345: 'RSS',
    3430: 'QR',
    4600: 'YOUTUBE',
    4105: 'LOCATION',
    6100: 'FASTERQ',
    3160: 'IMAGE',
    3150: 'EXTERNAL_VIDEO',
    3320: 'CLOCK',
    3235: 'HTML',
    3241: 'LABEL',
    3340: 'MRSS'
}

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
    public getBlockPlayerData(i_block_id, i_cb:(campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel)=>void) {

        switch (this.blockPlacement) {
            case 'CHANNEL': {
                this._getPlayerData(i_block_id, (campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
                    var xml = campaignTimelineChanelPlayersModel.getPlayerData();
                    let playerData = this.parser.xml2js(xml);
                    if (playerData['Player']['_player']) {
                        // Standard block
                        var blockCode = playerData['Player']['_player'];
                        var blockType = blockCodes[blockCode];
                        console.log(blockCode + ' ' + blockType);
                        i_cb(campaignTimelineChanelPlayersModel)
                    } else {
                        // Scene
                        // var blockCode = const BLOCKCODE_SCENE;
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
    private _getPlayerData(i_block_id, i_cb: (campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => void) {
        return this.yp.getBlockRecord(i_block_id)
            .subscribe((v) => {
                i_cb(v)
            })
    }

}
