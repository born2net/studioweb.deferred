import {Injectable} from '@angular/core';
import {BlockLabels, PLACEMENT_SCENE} from "../interfaces/Consts";
import {BlockFabricScene} from "../app/blocks/block-fabric-scene";
import * as _ from 'lodash';
import X2JS from "x2js";
import {RedPepperService} from "./redpepper.service";
import {BlockFabric} from "../app/blocks/block-fabric";

@Injectable()
export class BlockFactoryService {
    parser;

    constructor(private rp:RedPepperService) {
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

    /**
     This is factory method produces block instances which will reside on the timeline and referenced within this
     channel instance. The factory will parse the blockCode and create the appropriate block type.
     @method createBlock
     @param {Number} block_id
     @param {String} i_playerData
     @param {String} i_placement where does the block reside, scene or channel
     @param {Number} i_scene_id
     @return {Object} reference to the block instance
     **/
    createBlock(bs, rp, block_id, i_player_data, i_placement, i_scene_id?) {
        var block = undefined;
        // uncomment to see XML when adding new components
        // console.log(i_player_data);
        var playerData = this.parser.xml2js(i_player_data);
        var blockCode;

        if (playerData['Player']['_player']) {
            // Standard block
            blockCode = playerData['Player']['_player'];
        } else {
            // Scene
            blockCode = BlockLabels.BLOCKCODE_SCENE;
            if (_.isUndefined(i_scene_id)) {
                var domPlayerData = $.parseXML(i_player_data);
                i_scene_id = $(domPlayerData).find('Player').attr('hDataSrc');
            }
        }
        switch (parseInt(blockCode)) {
            case BlockLabels.BLOCKCODE_SCENE: {
                block = new BlockFabricScene({
                    i_placement: i_placement,
                    i_block_id: block_id
                }, bs, rp);
                break;
            }

            default: {
                block = new BlockFabric({
                    i_placement: i_placement,
                    i_block_id: block_id,
                    i_scene_player_data_id: i_scene_id
                }, bs, rp, 3241);
                break;
            }

            // case 3345: {
            //     block = new this.m_blockRSS({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3430: {
            //     block = new this.m_blockQR({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 4600: {
            //     block = new this.m_blockYouTube({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_COLLECTION): {
            //     block = new this.m_blockCollection({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 4105: {
            //     block = new this.m_blockLocation({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 6100: {
            //     block = new this.m_blockFasterQ({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_TWITTER): {
            //     block = new this.m_blockTwitter({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_TWITTER_ITEM): {
            //     block = new this.m_blockTwitterItem({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_WORLD_WEATHER): {
            //     block = new this.m_blockWorldWeather({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_GOOGLE_SHEETS): {
            //     block = new this.m_blockGoogleSheets({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_TWITTERV3): {
            //     block = new this.m_blockTwitterV3({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_CALENDAR): {
            //     block = new this.m_blockGoogleCalendar({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_INSTAGRAM): {
            //     block = new this.m_blockInstagram({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_DIGG): {
            //     block = new this.m_blockDigg({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_VIDEO): {
            //     block = new this.m_blockVideo({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_SVG): {
            //     block = new this.m_blockSVG({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_IMAGE): {
            //     block = new this.m_blockImage({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3160: {
            //     block = new this.m_blockExtImage({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3150: {
            //     block = new this.m_blockExtVideo({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3320: {
            //     block = new this.m_blockClock({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3235: {
            //     block = new this.m_blockHTML({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3241: {
            //     block = new this.m_blockLabel({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case 3340: {
            //     block = new this.m_blockMRSS({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_JSON): {
            //     block = new this.m_blockJson({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
            // case parseInt(BB.CONSTS.BLOCKCODE_JSON_ITEM): {
            //     block = new this.m_blockJsonItem({
            //         i_placement: i_placement,
            //         i_block_id: block_id,
            //         i_scene_player_data_id: i_scene_id
            //     });
            //     break;
            // }
        }

        // subclass our block from fabric.Group if resides inside scene
        if (i_placement == PLACEMENT_SCENE) {
            var g = new fabric.Group([]);
            _.extend(block, g);
            g = undefined;
        }
        return block;
    }
}