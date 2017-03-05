import {Injectable} from "@angular/core";
import * as _ from 'lodash';
import {Lib} from "../../Lib";
import {BlockService} from "./block-service";


export class BlockSceneBase extends fabric.Group {

    m_placement;
    m_block_id;
    m_sceneID;
    m_blockType;
    m_selected = false;
    m_zIndex = -1;
    m_minSize = {w: 50, h: 50};
    m_blockName;// = BB.PepperHelper.getBlockBoilerplate(m_blockType).name;
    m_blockAcronym;// = BB.PepperHelper.getBlockBoilerplate(m_blockType).acronym;
    m_blockDescription;// = BB.PepperHelper.getBlockBoilerplate(m_blockType).description;
    m_blockIcon;// = BB.PepperHelper.getBlockBoilerplate(m_blockType).icon;
    m_blockFontAwesome;// = BB.PepperHelper.getBlockBoilerplate(m_blockType).fontAwesome;
    m_blockSvg;// = BB.PepperHelper.getBlockBoilerplate(m_blockType).svg;
    m_resourceID;// = undefined;
    m_blockProperty;// = BB.comBroker.getService(BB.SERVICES['BLOCK_PROPERTIES']);
    m_blockService:BlockService;

    constructor(i_blockService) {
        super()
        this.m_blockService = i_blockService;
    }

    /**
     Get the XML player data of a block, depending where its placed
     If you like to view XML raw data, be sure to debug domPlayerData.children[0].outerHTML
     @method _getBlockPlayerData
     @return {Object} player data of block (aka player) parsed as DOM
     **/
    _getBlockPlayerData():XMLDocument {
        var self = this;
        var recBlock = undefined;

        // switch (self.m_placement) {
        //
        //     case BB.CONSTS.PLACEMENT_CHANNEL: {
        //         recBlock = pepper.getCampaignTimelineChannelPlayerRecord(self.m_block_id);
        //         return $.parseXML(recBlock['player_data']);
        //         // to view data debug domPlayerData.children[0].outerHTML
        //         break;
        //     }
        //
        //     case BB.CONSTS.PLACEMENT_SCENE: {
        //         return pepper.getScenePlayerdataBlock(self.m_sceneID, self.m_block_id);
        //         // to view data debug domPlayerData.children[0].outerHTML
        //         break;
        //     }
        // }

        return new XMLDocument()
    }

    /**
     Find the border section in player_data for selected block
     @method _findBorder
     @param  {object} i_domPlayerData
     @return {Xml} xSnippet
     **/
    _findBorder(i_domPlayerData) {
        var self = this;
        return $(i_domPlayerData).find('Border');
    }

    /**
     Fabricate alpha to canvas
     @method _fabricAlpha
     @param {Object} i_domPlayerData
     **/
    _fabricAlpha(i_domPlayerData) {
        var self = this;
        var appearance = $(i_domPlayerData).find('Appearance');
        var opacity: any = $(appearance).attr('alpha');
        self.setOpacity(opacity);
    }

    /**
     Fabricate color points to canvas
     @method _fabricColorPoints
     @param {xml} i_domPlayerData
     **/
    _fabricColorPoints(i_domPlayerData) {
        var self = this;
        var gradientPoints = $(i_domPlayerData).find('GradientPoints');
        var points = $(gradientPoints).find('Point');
        var colorStops = {}
        _.each(points, function (point) {
            var color = '#' + Lib.DecimalToHex(($(point).attr('color')));
            var offset: any = $(point).attr('midpoint');
            offset = offset / 250;
            colorStops[offset] = color;
        });
        return colorStops;
    }

    /**
     Config the fabric block border
     @method _fabricateBorder
     @param {i_options} i_options
     @return {object} object literal
     **/
    _fabricateBorder(i_options) {
        var self = this;
        var domPlayerData = self._getBlockPlayerData()
        var border = self._findBorder(domPlayerData);
        var color = border.length == 0 ? 'transparent' : '#' + Lib.DecimalToHex($(border).attr('borderColor'));
        return _.extend({
            // borderColor: '#5d5d5d',
            stroke: color,
            strokeWidth: 1
        }, i_options);
    }

    /**
     Build the options injected into a newly created fabric object
     @method _fabricateOptions
     @param {Number} i_top
     @param {Number} i_left
     @param {Number} i_width
     @param {Number} i_height
     @param {Number} i_angle
     @return {object} object literal
     **/
    _fabricateOptions(i_top, i_left, i_width, i_height, i_angle) {
        var self = this;
        var options = {
            top: i_top,
            left: i_left,
            width: i_width,
            height: i_height,
            angle: i_angle,
            fill: '#ececec',
            hasRotatingPoint: false,
            transparentCorners: false,
            cornerColor: 'black',
            cornerSize: 5,
            lockRotation: true,
            lineWidth: 1
        };

        return self._fabricateBorder(options);
    }

    /**
     Fabricate color points to canvas
     @method _fabricRect
     @param {number} i_width
     @param {number} i_height
     @param {xml} i_domPlayerData
     @return {object} r fabric js rectangular
     **/
    _fabricRect(i_width, i_height, i_domPlayerData) {
        var self = this;
        var options = self._fabricateOptions(0, 0, i_width, i_height, 0);
        var r = new fabric.Rect(options);
        r.setGradient('fill', {
            x1: 0 - (i_width / 2),
            y1: 0,
            x2: (i_width / 2),
            y2: 0,
            colorStops: self._fabricColorPoints(i_domPlayerData)
        });
        return r;
    }

    /**
     Convert the block into a fabric js compatible object, called externally on creation of block
     @Override
     @method fabricateBlock
     **/
    fabricateBlock(i_canvasScale, i_callback) {
        var self = this;

        var domPlayerData = self._getBlockPlayerData();
        var layout = $(domPlayerData).find('Layout');

        var w = parseInt(layout.attr('width'));
        var h = parseInt(layout.attr('height'));
        var rec = self._fabricRect(w, h, domPlayerData);

        fabric.loadSVGFromString(self.m_blockSvg, function (objects, options) {
            var groupSvg = fabric.util.groupSVGElements(objects, options);
            rec.originX = 'center';
            rec.originY = 'center';
            groupSvg.originX = 'center';
            groupSvg.originY = 'center';

            var o = {
                left: parseInt(layout.attr('x')),
                top: parseInt(layout.attr('y')),
                width: parseInt(layout.attr('width')),
                height: parseInt(layout.attr('height')),
                angle: parseInt(layout.attr('rotation')),
                hasRotatingPoint: false,
                stroke: 'transparent',
                cornerColor: 'black',
                cornerSize: 5,
                lockRotation: true,
                transparentCorners: false
            };
            _.extend(self, o);
            self.add(rec);
            self.add(groupSvg);
            self._fabricAlpha(domPlayerData);
            self._fabricLock();
            self['canvasScale'] = i_canvasScale;
            i_callback();
        });
    }

    /**
     On changes in msdb model updated UI common lock properties
     @method _fabricLock
     **/
    _fabricLock() {
        var self = this;
        var domPlayerData = self._getBlockPlayerData();
        var locked: any = $(domPlayerData).attr('locked');
        if (_.isUndefined(locked) || locked == '0') {
            locked = false;
        } else {
            locked = true;
        }
        self.lockMovementX = locked;
        self.lockMovementY = locked;
        //self.lockScalingX = locked; self.lockScalingY = locked; self.lockUniScaling = locked; self.lockRotation = locked;
        // if (!self.m_selected)
        //     return;
        // var dimensionProps = BB.comBroker.getService(BB.SERVICES['DIMENSION_PROPS_LAYOUT']);
        // if (_.isUndefined(dimensionProps))
        //     return;
        // dimensionProps.setLock(locked);
    }

    /**
     Get block data as a json formatted object literal and return to caller
     @method getBlockData
     @return {object} data
     The entire block data members which can be made public
     **/
    getBlockData() {
        var self = this;
        var data = {
            blockID: self.m_block_id,
            blockType: self.m_blockType,
            blockName: self.m_blockName,
            blockDescription: self.m_blockDescription,
            blockIcon: self.m_blockIcon,
            blockFontAwesome: self.m_blockFontAwesome,
            blockAcronym: self.m_blockAcronym,
            blockMinWidth: self.m_minSize.w,
            blockMinHeight: self.m_minSize.h,
            blockData: self._getBlockPlayerData()
        };
        return data;
    }

    /**
     Set a block's z-index in case we know it (i.e.: it is going to be a re-render of a previous block that
     was removed from the canvas)
     @method setZindex
     @param {Number} i_index
     **/
    setZindex(i_zIndex) {
        var self = this;
        self.m_zIndex = i_zIndex;
    }

    /**
     Get a block's z-index
     @method getZindex
     @param {Number} i_index
     **/
    getZindex(i_zIndex) {
        var self = this;
        return self.m_zIndex;
    }

    /**
     Delete block is a public method used as fall back method, if not overridden by inherited instance.
     It is also a semi abstract method, all implementations should go into _deleteBlock();
     @method deleteBlock
     @params {Boolean} i_memoryOnly if true only remove from existance but not from msdb
     @return none
     **/
    deleteBlock(i_memoryOnly) {
        /* semi-abstract, overridden, do not modify */
        var self = this;
        self._deleteBlock(i_memoryOnly);
    }

    /**
     Delete block is a private method that is always called regardless if instance has
     been inherited or not. Used for releasing memory for garbage collector.
     @method _deleteBlock
     @params {Boolean} i_memoryOnly if true only remove from existance but not from msdb
     @return none
     **/
    _deleteBlock(i_memoryOnly) {
        var self = this;
        // if (!i_memoryOnly)
        //     pepper.removeBlockFromTimelineChannel(self.m_block_id);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.BLOCK_SELECTED, self);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.BLOCK_LENGTH_CHANGING, self);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.GRADIENT_COLOR_CHANGED, self);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.GRADIENT_COLOR_CLOSED, self);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.BLOCK_BORDER_CHANGE, self);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.ALPHA_CHANGED, self);
        // BB.comBroker.stopListenWithNamespace(BB.EVENTS.LOCK_CHANGED, self);
        // $(Elements.SHOW_BACKGROUND).off(self.m_proxyToggleBgKey, self.m_proxyToggleBg);
        // $(Elements.SHOW_BORDER).off(self.m_proxyToggleBorderKey, self.m_proxyToggleBorder);

        // if (self.off != undefined)
        //     self.off('modified');
        //
        // if (self.m_sceneSelectedHandler)
        //     self.m_canvas.off('object:selected', self.m_sceneSelectedHandler);
        //
        // $.each(self, function (k) {
        //     self[k] = undefined;
        // });
    }
}