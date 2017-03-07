import {forwardRef, Inject, Injectable} from '@angular/core';
import {BlockLabels, PLACEMENT_SCENE} from "../interfaces/Consts";
import {BlockFabricScene} from "../app/blocks/block-fabric-scene";
import * as _ from 'lodash';
import X2JS from "x2js";
import {RedPepperService} from "./redpepper.service";
import {BlockFabric} from "../app/blocks/block-fabric";
import {BlockFabricImage} from "../app/blocks/block-fabric-image";
import {BlockFabricLabel} from "../app/blocks/block-fabric-label";
import {BlockFabricSvg} from "../app/blocks/block-fabric-svg";
import {BlockService} from "../app/blocks/block-service";

@Injectable()
export class BlockFactoryService {
    parser;

    constructor(private rp:RedPepperService, private bs: BlockService) {
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
     **/
    createBlock(block_id, i_player_data, i_placement, i_scene_id?) {
        var block = undefined;
        // uncomment to see XML when adding new components
        // console.log(i_player_data);
        var playerData = this.parser.xml2js(i_player_data);

        // if (playerData['Player']['_player']) {
        //     // Standard block
        //     blockCode = playerData['Player']['_player'];
        // } else {
        //     // Scene
        //     blockCode = BlockLabels.BLOCKCODE_SCENE;
        //     if (_.isUndefined(i_scene_id)) {
        //         var domPlayerData = $.parseXML(i_player_data);
        //         i_scene_id = $(domPlayerData).find('Player').attr('hDataSrc');
        //     }
        // }

        var blockCode = parseInt(playerData['Player']['_player']);

        // con('creating block ' + blockCode);
        
        switch (blockCode) {
            case BlockLabels.BLOCKCODE_SCENE: {
                block = new BlockFabricScene({
                    i_placement: i_placement,
                    i_block_id: block_id
                }, this.bs, this.rp);
                break;
            }

            case BlockLabels.BLOCKCODE_IMAGE: {
                block = new BlockFabricImage({
                    i_placement: i_placement,
                    i_block_id: block_id,
                    i_scene_player_data_id: i_scene_id
                }, this.bs, this.rp);
                break;
            }

            case BlockLabels.BLOCKCODE_SVG: {
                block = new BlockFabricSvg({
                    i_placement: i_placement,
                    i_block_id: block_id,
                    i_scene_player_data_id: i_scene_id
                }, this.bs, this.rp);
                break;
            }

            case BlockLabels.LABEL: {
                block = new BlockFabricLabel({
                    i_placement: i_placement,
                    i_block_id: block_id,
                    i_scene_player_data_id: i_scene_id
                }, this.bs, this.rp);
                break;
            }

            default: {
                block = new BlockFabric({
                    i_placement: i_placement,
                    i_block_id: block_id,
                    i_scene_player_data_id: i_scene_id
                }, this.bs, this.rp, blockCode);
                break;
            }
        }

        // subclass our block from fabric.Group if resides inside scene
        // if (i_placement == PLACEMENT_SCENE) {
        //     // var g = new fabric.Group([]);
        //     // _.extend(block, g);
        //     // g = undefined;
        // }
        return block;
    }
}