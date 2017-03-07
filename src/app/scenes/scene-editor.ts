import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISceneData, YellowPepperService} from "../../services/yellowpepper.service";
import {BlockService} from "../blocks/block-service";
import {CommBroker, IMessage} from "../../services/CommBroker";
import {RedPepperService} from "../../services/redpepper.service";
import * as _ from "lodash";
import {PLACEMENT_IS_SCENE, PLACEMENT_SCENE} from "../../interfaces/Consts";
import {Consts} from "../../Conts";
import {BlockFactoryService} from "../../services/block-factory-service";

export const JSON_EVENT_ROW_CHANGED = 'JSON_EVENT_ROW_CHANGED';
export const STATIONS_POLL_TIME_CHANGED = 'STATIONS_POLL_TIME_CHANGED';
export const THEME_CHANGED = 'THEME_CHANGED';
export const SELECTED_STACK_VIEW = 'SELECTED_STACK_VIEW';
// export const SCENE_BLOCK_LIST_UPDATED = 'SCENE_BLOCK_LIST_UPDATED';
// export const SCENE_ITEM_SELECTED = 'SCENE_ITEM_SELECTED';
export const ADD_NEW_BLOCK_SCENE = 'ADD_NEW_BLOCK_SCENE';
export const BLOCK_SELECTED = 'BLOCK_SELECTED';
export const SCENE_ZOOM_IN = 'SCENE_ZOOM_IN';
export const SCENE_ZOOM_OUT = 'SCENE_ZOOM_OUT';
export const SCENE_ZOOM_RESET = 'SCENE_ZOOM_RESET';
export const SCENE_PUSH_TOP = 'SCENE_PUSH_TOP';
export const SCENE_PUSH_BOTTOM = 'SCENE_PUSH_BOTTOM';
export const SCENE_BLOCKS_RENDERED = 'SCENE_BLOCKS_RENDERED';
export const SCENE_BLOCK_CHANGE = 'SCENE_BLOCK_CHANGE';
export const SCENE_EDITOR_REMOVE = 'SCENE_EDITOR_REMOVE';
export const SCENE_ITEM_REMOVE = 'SCENE_ITEM_REMOVE';
export const SCENE_CANVAS_SELECTED = 'SCENE_CANVAS_SELECTED';
export const WIZARD_EXIT = 'WIZARD_EXIT';
export const NEW_SCENE_ADD = 'NEW_SCENE_ADD';
export const SCENE_LIST_UPDATED = 'SCENE_LIST_UPDATED';
export const SCENE_UNDO = 'SCENE_UNDO';
export const SCENE_REDO = 'SCENE_REDO';
export const REMOVING_SCENE = 'REMOVING_SCENE';
export const REMOVED_SCENE = 'REMOVED_SCENE';
export const REMOVING_RESOURCE = 'REMOVING_RESOURCE';
export const REMOVED_RESOURCE = 'REMOVED_RESOURCE';
export const ADDED_RESOURCE = 'ADDED_RESOURCE';
export const MOUSE_ENTERS_CANVAS = 'MOUSE_ENTERS_CANVAS';
export const FONT_SELECTION_CHANGED = 'FONT_SELECTION_CHANGED';
export const CAMPAIGN_LIST_LOADING = 'CAMPAIGN_LIST_LOADED';

@Component({
    selector: 'scene-editor',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <scene-toolbar (onItemSelected)="_onItemSelectedFromToolbar($event)" [blocks]="this.m_blocks.blocksPost" (onToolbarAction)="_onToolbarAction($event)"></scene-toolbar>
        <loading *ngIf="m_isLoading" [size]="'50px'" [style]="{'margin-top': '150px'}"></loading>
        <div [ngClass]="{hidden: m_isLoading}">
            <div id="sceneCanvasContainer" data-toggle="context" data-target="#sceneContextMenu" class="yScroll context sceneElements" style=" overflow-x: visible" align="center"></div>
        </div>
    `
})
export class SceneEditor extends Compbaser implements AfterViewInit {

    m_isLoading = true;
    m_selectedSceneID = undefined;
    m_sceneScrollTop = 0;
    m_sceneScrollLeft = 0;
    m_objectScaling = 0;
    m_mouseX: any = 0;
    m_mouseY: any = 0;
    m_gridMagneticMode = 0;
    m_rendering = false;
    m_memento = {};
    m_canvas: any;
    _sceneBlockModified;
    m_sceneBlock;
    m_canvasMouseState = 0;
    m_copiesObjects = [];
    m_canvasScale = 1;
    SCALE_FACTOR = 1.2;
    PUSH_TOP = 1;
    PUSH_BOTTOM = 0;
    m_blocks = {
        blocksPre: [],
        blocksPost: {},
        blockSelected: undefined
    };

    @ViewChild('canvas1')
    canvas1;

    @ViewChild('canvas2')
    canvas2;

    constructor(private blockFactory: BlockFactoryService, private rp: RedPepperService, private el: ElementRef, private yp: YellowPepperService, private cd: ChangeDetectorRef, private bs: BlockService, private commBroker: CommBroker) {
        super();
        // this.cd.detach();
        // var a = new BlockFabric(bs);
    }

    ngAfterViewInit() {
        var self = this;
        self.m_selectedSceneID = undefined;
        self.m_sceneScrollTop = 0;
        self.m_sceneScrollLeft = 0;
        self.m_objectScaling = 0;
        self.m_mouseX = 0;
        self.m_mouseY = 0;
        self.m_gridMagneticMode = 0;
        self.m_rendering = false;
        self.m_memento = {};
        self.m_canvasMouseState = 0;
        self.m_copiesObjects = [];
        self.PUSH_TOP = 1;
        self.PUSH_BOTTOM = 0;
        self.m_blocks = {
            blocksPre: [],
            blocksPost: {},
            blockSelected: undefined
        };
        self.m_canvas = undefined;
        self.m_canvasScale = 1;
        self.SCALE_FACTOR = 1.2;

        self._listenSceneSelection();
        self._listenAddBlockWizard();
        self._listenToCanvasScroll();
        self._listenSceneChanged();
        self._listenContextMenu();
        self._listenSelectNextBlock();
        self._listenSceneRemove();
        self._listenSceneBlockRemove();
        self._listenSceneNew();
        self._listenAppResized();
        self._delegateSceneBlockModified();
    }

    ngOnInit() {
    }

    @Output()
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    _onToolbarAction(event) {
        con('toolbar ' + event);
        switch (event) {
            case 'back': {
                this.onGoBack.emit();
                break;
            }
            case 'add': {
                break;
            }
            case 'removeItem': {
                break;
            }
            case 'playPreview': {
                break;
            }
            case 'pushItemToTopButtonToolTip': {
                if (_.isUndefined(this.m_selectedSceneID))
                    return;
                var block = this.m_canvas.getActiveObject();
                if (_.isNull(block)) {
                    this._discardSelections();
                    return;
                }
                this.m_canvas.bringToFront(block);
                this._updateZorder(this.PUSH_TOP, block);
                this._mementoAddState();
                break;
            }
            case 'pushItemToBottomButtonToolTip': {
                if (_.isUndefined(this.m_selectedSceneID))
                    return;
                var block = this.m_canvas.getActiveObject();
                if (_.isNull(block)) {
                    this._discardSelections();
                    return;
                }
                this.m_canvas.sendToBack(block);
                this._updateZorder(this.PUSH_BOTTOM, block);
                this._mementoAddState();
                break;
            }
            case 'sceneZoomIn': {
                this._zoomIn();
                this._discardSelections();
                this._resetAllObjectScale();
                this.m_canvas.renderAll();
                break;
            }
            case 'sceneZoomOut': {
                this._zoomOut();
                this._discardSelections();
                this._resetAllObjectScale();
                this.m_canvas.renderAll();
                break;
            }
            case 'sceneZoomReset': {
                this._zoomReset();
                this._resetAllObjectScale();
                this.m_canvas.renderAll();
                break;
            }
            case 'undo': {
                if (this.m_rendering)
                    return;
                this.m_blocks.blockSelected = undefined;
                this._discardSelections();
                this._mementoLoadState('undo');
                break;
            }
            case 'redo': {
                if (this.m_rendering)
                    return;
                this.m_blocks.blockSelected = undefined;
                this._discardSelections();
                this._mementoLoadState('redo');
                break;
            }
            case 'magneticGrid': {
                if (this.m_rendering || _.isUndefined(this.m_canvas))
                    return;
                switch (this.m_gridMagneticMode) {
                    case 0: {
                        this.m_gridMagneticMode = 1;
                        break;
                    }
                    case 1: {
                        this.m_gridMagneticMode = 2;
                        break;
                    }
                    case 2: {
                        this.m_gridMagneticMode = 0;
                        break;
                    }
                }
                this.m_sceneBlock.setCanvas(this.m_canvas, this.m_gridMagneticMode);
                break;
            }
        }
    }

    /**
     Listen to changes in a new scene selection
     @method _listenSceneSelection
     **/
    _listenSceneSelection() {

        this.cancelOnDestroy(
            //
            this.yp.listenSceneSelected()
                .delay(1000)
                .subscribe((sceneData: ISceneData) => {
                    this.m_selectedSceneID = sceneData.pseudo_id;
                    this._loadScene();
                    this._sceneCanvasSelected();
                    if (this._mementoInit())
                        this._mementoAddState();
                })
        )
    }

    // _initDimensionProps() {
    // var self = this;
    // require(['DimensionProps'],  (DimensionProps) => {
    //     self.m_dimensionProps = new DimensionProps({
    //         appendTo: Elements.SCENE_BLOCK_PROPS,
    //         showAngle: true,
    //         showLock: true,
    //         hideSpinners: true
    //     });
    //     // self.m_dimensionProps.hideSpinners();
    //     BB.comBroker.setService(BB.SERVICES['DIMENSION_PROPS_LAYOUT'], self.m_dimensionProps);
    //     $(self.m_dimensionProps).on('changed',  (e) => {
    //         var block = self.m_canvas.getActiveObject();
    //         if (_.isNull(block))
    //             return;
    //         var props = e.target.getValues();
    //         var block_id = block.getBlockData().blockID;
    //         self._updateBlockCords(block, false, props.x, props.y, props.w, props.h, props.a);
    //         BB.comBroker.fire(BB.EVENTS['SCENE_BLOCK_CHANGE'], self, null, [block_id]);
    //     });
    //     self._sceneActive();
    // })
    // }

    /**
     Bring the scene into view
     @method _sceneActive
     **/
    _sceneActive() {
        // $('#sceneToolbar').fadeIn();
        // $('#sceneToolbar').fadeTo(500, 1);
    }

    /**
     Init a new canvas and listen to even changes on that new canvas
     @method _initializeCanvas
     @param {Number} w width
     @param {Number} h height
     **/
    _initializeCanvas(w, h) {
        $('#sceneCanvasContainer', this.el.nativeElement).empty();
        $('#sceneCanvasContainer', this.el.nativeElement).append(`<canvas id="sceneCanvas" width="${w}px" height="${h}px"/>`);
        this.m_canvas = new fabric.Canvas('sceneCanvas');
        this.m_canvas.renderOnAddRemove = false;
        $('#sceneCanvas', this.el.nativeElement).addClass('basicBorder');
        this._listenBlockModified();
        this._listenCanvasSelections();
        this._listenKeyboard();
    }

    /**
     Init a new scene and subclass off a standard Block
     @method _initializeScene
     **/
    _initializeScene(i_selectedSceneID) {
        var scene_player_data = this.rp.getScenePlayerdata(i_selectedSceneID);
        this.m_sceneBlock = this.blockFactory.createBlock(i_selectedSceneID, scene_player_data);
        this.m_sceneBlock.setCanvas(this.m_canvas, this.m_gridMagneticMode);
        ////_.extend(this.m_canvas, this.m_sceneBlock);
    }

    /**
     Load a new scene and dispose of any previous ones
     @return {Number} Unique clientId.
     **/
    _loadScene() {
        var self = this;
        if (_.isUndefined(this.m_selectedSceneID))
            return -1;
        this.m_isLoading = true;
        self._disposeBlocks();
        self.disposeScene();
        self._zoomReset();
        // self.m_property.resetPropertiesView();
        var domPlayerData = self.rp.getScenePlayerdataDom(self.m_selectedSceneID);
        var l = $(domPlayerData).find('Layout').eq(0);
        var w = $(l).attr('width');
        var h = $(l).attr('height');
        self._initializeCanvas(w, h);
        self._initializeScene(self.m_selectedSceneID);
        self._preRender(domPlayerData);

        // this._sceneProcessing(true, jQueryAny.proxy(function () {
        //     self._disposeBlocks();
        //     self.disposeScene();
        //     self._zoomReset();
        //     // self.m_property.resetPropertiesView();
        //     var domPlayerData = self.rp.getScenePlayerdataDom(self.m_selectedSceneID);
        //     var l = $(domPlayerData).find('Layout').eq(0);
        //     var w = $(l).attr('width');
        //     var h = $(l).attr('height');
        //     self._initializeCanvas(w, h);
        //     // self._initializeScene(self.m_selectedSceneID);
        //     self._initializeScene();
        //     self._preRender(domPlayerData);
        // }), this);
    }

    /**
     Listen to selection of next block
     @method _listenSelectNextDivision
     **/
    _listenSelectNextBlock() {
        this.commBroker.onEvent('SCENE_SELECT_NEXT').subscribe((e: IMessage) => {
            if (_.isUndefined(this.m_selectedSceneID))
                return;
            var viewer = this.m_canvas.getActiveObject();
            var viewIndex = this.m_canvas.getObjects().indexOf(viewer);
            var totalViews = this.m_canvas.getObjects().length;
            var blockID = undefined;
            if (viewIndex == totalViews - 1) {
                this.m_canvas.setActiveObject(this.m_canvas.item(0));
                blockID = this.m_canvas.getActiveObject().getBlockData().blockID;
                this.commBroker.fire({event: BLOCK_SELECTED, fromInstance: this, message: blockID});
            } else {
                this.m_canvas.setActiveObject(this.m_canvas.item(viewIndex + 1));
                blockID = this.m_canvas.getActiveObject().getBlockData().blockID;
                this.commBroker.fire({event: BLOCK_SELECTED, fromInstance: this, message: blockID});
            }
        });
    }

    /**
     Listen to when a user selects to delete a block
     @method _listenSceneBlockRemove
     **/
    _listenSceneBlockRemove() {
        this.commBroker.onEvent(SCENE_ITEM_REMOVE).subscribe((msg: IMessage) => {
            this._onContentMenuSelection('remove');
        });
    }

    /**
     Listen to when a user selects to delete a scene
     @method _listenSceneRemove
     **/
    _listenSceneRemove() {
        this.commBroker.onEvent(SCENE_EDITOR_REMOVE).subscribe((e: IMessage) => {
            if (this.m_canvas)
                this.m_canvas.setBackgroundColor('#ffffff', () => {
                }).renderAll();
            // remove a scene and notify before so channel instances
            // can remove corresponding blocks and after so channelList can refresh UI
            var sceneID = this.rp.getSceneIdFromPseudoId(e.message);
            this.commBroker.fire({event: REMOVING_SCENE, fromInstance: this, message: sceneID});
            this.rp.removeBlocksWithSceneID(sceneID);
            this.rp.removeSceneFromBlockCollectionInScenes(sceneID);
            this.rp.removeSceneFromBlockCollectionsInChannels(sceneID);
            this.rp.removeScene(sceneID);
            this.commBroker.fire({event: SCENE_LIST_UPDATED, fromInstance: this});
            this.disposeScene();
            this._zoomReset();
            // this.m_property.resetPropertiesView();
            this.m_selectedSceneID = undefined;
            $('#sceneCanvas', this.el.nativeElement).removeClass('basicBorder');
            // this._updateBlockCount();
            // this.commBroker.fire({event: REMOVED_SCENE, fromInstance: this, message: this.m_selected_resource_id});
        });

    }

    /**
     Listen to keyboard events
     @method _listenKeyboard
     **/
    _listenKeyboard() {
        // if (_.isUndefined(this.m_canvas))
        //     return;
        // $('canvas',this.el.nativeElement).attr('tabindex', '1');
        // var keyDown = _.debounce( (e) => {
        //     if (this.m_objectScaling)
        //         return;
        //     if (this.m_canvasMouseState)
        //         return;
        //     var block = this.m_canvas.getActiveObject();
        //     if (_.isNull(block))
        //         return;
        //     var dimensionProps = BB.comBroker.getService(BB.SERVICES['DIMENSION_PROPS_LAYOUT']);
        //     var values = dimensionProps.getValues();
        //     var val = e.shiftKey ? 25 : 1;
        //     switch (e.keyCode) {
        //         case 38: {
        //             values.y = values.y - val;
        //             break;
        //         }
        //         case 40: {
        //             values.y = values.y + val;
        //             break;
        //         }
        //         case 37: {
        //             values.x = values.x - val;
        //             break;
        //         }
        //         case 39: {
        //             values.x = values.x + val;
        //             break;
        //         }
        //     }
        //     dimensionProps.setValues(values, true);
        //     return false;
        // }, 100);
        // $('.upper-canvas').keydown(keyDown);
    }

    /**
     Listen to user selection of new scene
     @method _listenSceneNew
     **/
    _listenSceneNew() {
        this.commBroker.onEvent(NEW_SCENE_ADD).subscribe((msg: IMessage) => {
            var player_data = this.bs.getBlockBoilerplate('3510').getDefaultPlayerData(PLACEMENT_IS_SCENE);
            this.createScene(player_data, false, true, msg.message.mimeType, msg.message.name);
        });
    }

    /**
     Listen when mouse enters canvas wrapper and announce it
     @method _listenMouseEnterCanvas
     **/
    _listenMouseEnterCanvas() {
        $('#sceneCanvasContainer', this.el.nativeElement).on("mouseover", (e) => {
            this.commBroker.fire({event: MOUSE_ENTERS_CANVAS, fromInstance: this});
        });
    }

    /**
     Listen to the event of scene changes which normally comes from a block that modified its data
     and re-render all scene content
     @method _listenSceneChanged
     **/
    _listenSceneChanged() {
        this.commBroker.onEvent(SCENE_BLOCK_CHANGE).subscribe((msg: IMessage) => {
            if (this.m_rendering)
                return;
            var blockIDs = msg.message;
            con('block(s) edited ' + blockIDs);
            var domPlayerData = this.rp.getScenePlayerdataDom(this.m_selectedSceneID);
            this.m_blocks.blockSelected = blockIDs[0];
            this._preRender(domPlayerData, blockIDs);
            this._mementoAddState();
        });
    }

    /**
     Listen to any canvas right click
     @method _listenContextMenu
     **/
    _listenContextMenu() {
        // var self = this;
        // $('#sceneCanvasContainer', this.el.nativeElement).contextmenu({
        //     target: Elements.SCENE_CONTEXT_MENU,
        //     before:  (e, element, target) => {
        //         e.preventDefault();
        //         // no canvas
        //         if (_.isUndefined(self.m_canvas)) {
        //             this.closemenu();
        //             return false;
        //         }
        //         // remember right click position for pasting
        //         self.m_mouseX = e.offsetX;
        //         self.m_mouseY = e.offsetY;
        //
        //         // group selected
        //         var active = self.m_canvas.getActiveGroup();
        //         if (active) {
        //             $('.blocksOnly', Elements.SCENE_CONTEXT_MENU).show();
        //             return true;
        //         }
        //         // scene selected
        //         var block = self.m_canvas.getActiveObject();
        //         if (_.isNull(block)) {
        //             $('.blocksOnly', Elements.SCENE_CONTEXT_MENU).hide();
        //             return true;
        //         }
        //         // object selected
        //         $('.blocksOnly', Elements.SCENE_CONTEXT_MENU).show();
        //         return true;
        //     }
        //     onItem:  (context, e) => {
        //         self._onContentMenuSelection($(e.target).attr('name'))
        //     }
        // });
    }

    /**
     On Scene right click context menu selection command
     @method _onContentMenuSelection
     @param {String} i_command
     **/
    _onContentMenuSelection(i_command) {
        var blocks = [];

        var contextCmd = (i_blocks) => {
            switch (i_command) {
                case 'copy': {
                    this.m_copiesObjects = [];
                    _.each(i_blocks, (selectedObject) => {
                        var blockPlayerData = selectedObject.getBlockData().blockData;
                        blockPlayerData = this.rp.stripPlayersID(blockPlayerData);
                        this.m_copiesObjects.push(blockPlayerData);
                    });
                    break;
                }

                case 'cut': {
                    this.m_copiesObjects = [];
                    _.each(i_blocks, (selectedObject) => {
                        var blockData = selectedObject.getBlockData();
                        var blockPlayerData = blockData.blockData;
                        this._discardSelections();
                        this.rp.removeScenePlayer(this.m_selectedSceneID, blockData.blockID);
                        this._disposeBlocks(blockData.blockID);
                        blockPlayerData = this.rp.stripPlayersID(blockPlayerData);
                        this.m_copiesObjects.push(blockPlayerData);
                    });
                    this.m_canvas.renderAll();
                    // this._updateBlockCount();
                    break;
                }

                case 'remove': {
                    _.each(i_blocks, (selectedObject) => {
                        var blockData = selectedObject.getBlockData();
                        this._discardSelections();
                        this.rp.removeScenePlayer(this.m_selectedSceneID, blockData.blockID);
                        this._disposeBlocks(blockData.blockID);
                    });
                    this.m_canvas.renderAll();
                    // this._updateBlockCount();
                    break;
                }

                case 'paste': {
                    var x: any, y: any, blockID, origX: any, origY: any, blockIDs = [];
                    _.each(this.m_copiesObjects, (domPlayerData, i: any) => {
                        blockID = this.rp.generateSceneId();
                        $(domPlayerData).attr('id', blockID);
                        blockIDs.push(blockID);
                        var layout: any = $(domPlayerData).find('Layout');
                        if (i == 0) {
                            origX = parseInt(layout.attr('x'));
                            origY = parseInt(layout.attr('y'));
                            x = this.m_mouseX;
                            y = this.m_mouseY;
                        } else {
                            var a: any = layout.attr('x') - origX;
                            var b: any = layout.attr('y') - origY;
                            x = this.m_mouseX + a;
                            y = this.m_mouseY + b;
                        }
                        layout.attr('x', x);
                        layout.attr('y', y);
                        var player_data = (new XMLSerializer()).serializeToString(domPlayerData);
                        this.rp.appendScenePlayerBlock(this.m_selectedSceneID, player_data);
                    });
                    this._discardSelections();
                    if (this.m_copiesObjects.length == 1) {
                        this.commBroker.fire({event: SCENE_BLOCK_CHANGE, fromInstance: this, message: [blockID]});
                    } else {
                        this.commBroker.fire({event: SCENE_BLOCK_CHANGE, fromInstance: this, message: blockID});
                    }
                    // this._updateBlockCount();
                    break;
                }
            }
        };

        // no canvas
        if (_.isUndefined(this.m_canvas)) {
            return;
        }
        // group selected
        var group = this.m_canvas.getActiveGroup();
        if (group) {
            con(i_command + ' on group');
            blocks = [];
            _.each(group.objects, (selectedObject) => {
                blocks.push(selectedObject);
            });
            contextCmd(blocks);
            return;
        }
        // scene selected
        var block = this.m_canvas.getActiveObject();
        if (_.isNull(block)) {
            con(i_command + ' on scene');
            contextCmd(null);
            return;
        }
        // object selected
        con(i_command + ' on object');
        blocks = [];
        blocks.push(block);
        contextCmd(blocks);
        return true;
    }

    /**
     Listen to canvas scrolling
     @method _listenToCanvasScroll
     **/
    _listenToCanvasScroll() {
        var self = this;
        var sceneScrolling = _.debounce(() => {
            $('#sceneCanvasContainer', this.el.nativeElement).scroll((e) => {
                self.m_sceneScrollTop = $('#scenesPanel').scrollTop();
                self.m_sceneScrollLeft = $('#scenesPanel').scrollLeft();
                self.m_canvas.calcOffset();
            });
        }, 500);
        $('#sceneCanvasContainer', this.el.nativeElement).scroll(sceneScrolling);
    }

    /**
     Listen to and add new component / resources to scene
     @method _listenAddBlockWizard
     @param {event} e
     **/
    _listenAddBlockWizard() {
        this.commBroker.onEvent(ADD_NEW_BLOCK_SCENE).subscribe((msg: IMessage) => {
            var blockID = this.rp.generateSceneId();
            var player_data = this.bs.getBlockBoilerplate(msg.message.blockCode).getDefaultPlayerData(PLACEMENT_SCENE, msg.message.resourceID);
            var domPlayerData = $.parseXML(player_data);
            $(domPlayerData).find('Player').attr('id', blockID);
            player_data = (new XMLSerializer()).serializeToString(domPlayerData);
            this.rp.appendScenePlayerBlock(this.m_selectedSceneID, player_data);
            this.commBroker.fire({event: SCENE_BLOCK_CHANGE, fromInstance: this, message: [blockID]});
        });

    }

    // /**
    //  Listen to re-order of screen division, putting selected on top
    //  @method _listenPushToTop
    //  **/
    // _listenPushToTop() {
    //     this.commBroker.onEvent(SCENE_PUSH_TOP).subscribe((msg: IMessage) => {
    //         if (_.isUndefined(this.m_selectedSceneID))
    //             return;
    //         var block = this.m_canvas.getActiveObject();
    //         if (_.isNull(block)) {
    //             this._discardSelections();
    //             return;
    //         }
    //         this.m_canvas.bringToFront(block);
    //         this._updateZorder(this.PUSH_TOP, block);
    //         this._mementoAddState();
    //     });
    // }

    // /**
    //  Listen to re-order of screen division, putting selected at bottom
    //  @method _listenPushToBottom
    //  **/
    // _listenPushToBottom() {
    //     this.commBroker.onEvent(SCENE_PUSH_BOTTOM).subscribe((msg: IMessage) => {
    //         if (_.isUndefined(this.m_selectedSceneID))
    //             return;
    //         var block = this.m_canvas.getActiveObject();
    //         if (_.isNull(block)) {
    //             this._discardSelections();
    //             return;
    //         }
    //         this.m_canvas.sendToBack(block);
    //         this._updateZorder(this.PUSH_BOTTOM, block);
    //         this._mementoAddState();
    //     });
    // }

    // /**
    //  Listen grid magnet when dragging objects
    //  @method _listenGridMagnet
    //  **/
    // _listenGridMagnet() {
    //     $('#sceneGridMagnet', this.el.nativeElement).on('click', () => {
    //         if (this.m_rendering || _.isUndefined(this.m_canvas))
    //             return;
    //         switch (this.m_gridMagneticMode) {
    //             case 0: {
    //                 this.m_gridMagneticMode = 1;
    //                 break;
    //             }
    //             case 1: {
    //                 this.m_gridMagneticMode = 2;
    //                 break;
    //             }
    //             case 2: {
    //                 this.m_gridMagneticMode = 0;
    //                 break;
    //             }
    //         }
    //         this.m_sceneBlock.setCanvas(this.m_canvas, this.m_gridMagneticMode);
    //     });
    // }

    /**
     @method _sceneProcessing
     **/
    _sceneProcessing(i_status, i_callBack, from?) {
        if (i_status) {
            $('#sceneProcessing', this.el.nativeElement).css({
                width: $('#scenePanelWrap').width(),
                height: $('#scenePanelWrap').height()
            })
            $('#sceneProcessing', this.el.nativeElement).fadeTo('fast', 0.7, i_callBack);
        } else {
            this.m_isLoading = false;
            this.cd.markForCheck();
            $('#sceneProcessing', this.el.nativeElement).fadeOut('slow', i_callBack);
        }
    }

    // /**
    //  Listen to undo and redo
    //  @method _listenMemento
    //  **/
    // _listenMemento() {
    //     this.commBroker.onEvent(SCENE_UNDO).subscribe((msg: IMessage) => {
    //         if (this.m_rendering)
    //             return;
    //         this.m_blocks.blockSelected = undefined;
    //         this._discardSelections();
    //         this._mementoLoadState('undo');
    //     });
    //     this.commBroker.onEvent(SCENE_REDO).subscribe((msg: IMessage) => {
    //         if (this.m_rendering)
    //             return;
    //         this.m_blocks.blockSelected = undefined;
    //         this._discardSelections();
    //         this._mementoLoadState('redo');
    //     });
    // }

    /**
     Init a undo / redo via memento pattern
     @method _mementoInit
     @return {Boolean} return true if memento created false if one already existed
     **/
    _mementoInit() {
        if (_.isUndefined(this.m_memento[this.m_selectedSceneID])) {
            this.m_memento[this.m_selectedSceneID] = {
                playerData: [],
                cursor: -1
            };
            return true;
        }
        return false;
    }

    /**
     Remember current memento state
     @method _mementoAddState
     **/
    _mementoAddState() {
        var MAX = 100;
        if (_.isUndefined(this.m_selectedSceneID))
            return;
        this._mementoInit();

        // maintain memento to stack MAX value
        if (this.m_memento[this.m_selectedSceneID].playerData.length > MAX)
            this.m_memento[this.m_selectedSceneID].playerData.shift();

        // if undo / redo was executed, remove ahead mementos
        if (this.m_memento[this.m_selectedSceneID].cursor != this.m_memento[this.m_selectedSceneID].playerData.length - 1)
            this.m_memento[this.m_selectedSceneID].playerData.splice(this.m_memento[this.m_selectedSceneID].cursor + 1);

        var player_data = this.rp.getScenePlayerdata(this.m_selectedSceneID);
        this.m_memento[this.m_selectedSceneID].playerData.push(player_data);
        this.m_memento[this.m_selectedSceneID].cursor = this.m_memento[this.m_selectedSceneID].playerData.length - 1;
    }

    /**
     Remember current memento state
     @method _mementoLoadState
     **/
    _mementoLoadState(i_direction) {
        if (_.isUndefined(this.m_selectedSceneID))
            return;
        this._mementoInit();
        if (this.m_memento[this.m_selectedSceneID].playerData.length == 0)
            return;

        switch (i_direction) {
            case 'undo': {
                var cursor = this.m_memento[this.m_selectedSceneID].cursor;
                if (cursor == 0)
                    return;
                this.m_memento[this.m_selectedSceneID].cursor--;
                cursor = this.m_memento[this.m_selectedSceneID].cursor;
                break;
            }
            case 'redo': {
                var cursor = this.m_memento[this.m_selectedSceneID].cursor;
                if (cursor == this.m_memento[this.m_selectedSceneID].playerData.length - 1)
                    return;
                this.m_memento[this.m_selectedSceneID].cursor++;
                cursor = this.m_memento[this.m_selectedSceneID].cursor;
                break;
            }
        }
        var player_data = this.m_memento[this.m_selectedSceneID].playerData[cursor];
        this.rp.setScenePlayerData(this.m_selectedSceneID, player_data);
        this._loadScene();
        this.commBroker.fire({event: SCENE_LIST_UPDATED, fromInstance: this});
    }

    /**
     Update the z-order index of an object
     @method _updateZorder
     @param {String} i_pushDirection
     @param {Object} i_block
     **/
    _updateZorder(i_pushDirection, i_block) {
        if (_.isUndefined(this.m_selectedSceneID))
            return;
        var active = this.m_canvas.getActiveGroup();
        if (active)
            return;
        var blockID = i_block.getBlockData().blockID;
        var sceneDomPlayerData = this.rp.getScenePlayerdataDom(this.m_selectedSceneID);
        var domBlockData = $(sceneDomPlayerData).find('[id="' + blockID + '"]');
        switch (i_pushDirection) {
            case this.PUSH_TOP: {
                $(sceneDomPlayerData).find('Players').append($(domBlockData));
                break;
            }
            case this.PUSH_BOTTOM: {
                $(sceneDomPlayerData).find('Players').prepend($(domBlockData));
                break;
            }
        }
        this.rp.setScenePlayerData(this.m_selectedSceneID, (new XMLSerializer()).serializeToString(sceneDomPlayerData));
    }

    /**
     Pre render creates all of the Fabric blocks that will later get added when we call _render
     This allows for smooth (non flickering) rendering since when we are ready to render, the blocks have
     already been instantiated and ready to be added to canvas
     @method _preRender
     @param {Object} i_domPlayerData
     @param {Object} [i_blockIDs] optionally render only a single block
     **/
    _preRender(i_domPlayerData, i_blockIDs?) {
        var zIndex = -1;
        this._renderPause();
        this.m_blocks.blocksPre = [];
        this.m_blocks.blocksPost = {};
        con('pre-rendering new blocks');

        // if rendering specific blocks instead of entire canvas
        if (i_blockIDs) {
            $(i_domPlayerData).find('Players').children('Player').each((i, player) => {
                zIndex++;
                var blockID = $(player).attr('id');
                if (_.indexOf(i_blockIDs, blockID) > -1) {
                    var block = {
                        blockID: blockID,
                        blockType: $(player).attr('player'),
                        zIndex: zIndex,
                        player_data: (new XMLSerializer()).serializeToString(player)
                    };
                    this.m_blocks.blocksPre.push(block);
                }
            });
        } else {
            $(i_domPlayerData).find('Players').children('Player').each((i, player) => {
                var block = {
                    blockID: $(player).attr('id'),
                    blockType: $(player).attr('player'),
                    zIndex: -1,
                    player_data: (new XMLSerializer()).serializeToString(player)

                };
                this.m_blocks.blocksPre.push(block);
            });
        }
        this._createBlock(i_blockIDs);
    }

    /**
     Render the pre created blocks (via _preRender) and add all blocks to fabric canvas
     @method _render
     **/
    _render(i_blockIDs) {
        if (!this.m_canvas)
            return;
        var nZooms = Math.round(Math.log(1 / this.m_canvasScale) / Math.log(1.2));
        var selectedBlockID = this.m_blocks.blockSelected;
        var createAll = i_blockIDs[0] == undefined ? true : false; // if to re-render entire canvas

        if (createAll) {
            this._disposeBlocks();
            this._zoomReset();
        } else {
            // if to re-render only changed blocks
            for (var i = 0; i < i_blockIDs.length; i++)
                this._disposeBlocks(i_blockIDs[i]);
        }
        _.forEach(this.m_blocks.blocksPost, (i_block) => {
            this.m_canvas.add(i_block);
        });
        if (createAll) {
            this._resetAllObjectScale();
            this._zoomTo(nZooms);
        } else {
            // if to re-render only changed blocks
            _.forEach(this.m_blocks.blocksPost, (i_block: any) => {
                var zIndex = i_block.getZindex();
                if (zIndex > -1)
                    i_block.moveTo(zIndex);
                this.m_canvas.setActiveObject(i_block);
                this._zoomToBlock(nZooms, i_block);
                this._resetObjectScale(i_block);
            });
        }
        this._scrollTo(this.m_sceneScrollTop, this.m_sceneScrollLeft);
        this.m_canvas.renderAll();
        this._sceneProcessing(false, () => {
        });
        this._renderContinue();
        // if (createAll)
        //     this._updateBlockCount();

        // select previous selection
        if (_.isUndefined(selectedBlockID))
            return;
        if (createAll) {
            for (var i = 0; i < this.m_canvas.getObjects().length; i++) {
                if (selectedBlockID == this.m_canvas.item(i).getBlockData().blockID) {
                    this._blockSelected(this.m_canvas.item(i));
                    break;
                }
            }
        } else {
            var block = this.m_blocks.blocksPost[Object.keys(this.m_blocks.blocksPost)[0]];
            this._blockSelected(block);
        }
    }

    /**
     Prevent rendering of canvas to continue and remove canvas listeners
     @method _renderPause
     **/
    _renderPause() {
        this.m_rendering = true;
        if (_.isUndefined(this.m_canvas))
            return;
        this.m_canvas.removeListeners();
    }

    /**
     Allow rendering of canvas to continue and add canvas listeners
     @method _renderContinue
     **/
    _renderContinue() {
        this.m_rendering = false;
        if (_.isUndefined(this.m_canvas))
            return;
        this.m_canvas._initEventListeners();
    }

    /**
     Create all the blocks that have been pre injected to m_blocks.blocksPre and after each block
     is created created the next block; thus creating blocks sequentially due to fabric bug. When no
     more blocks are to be created (m_blocks.blocksPre queue is empty) we _render the canvas
     @method _createBlock
     @param {Array} [i_blockIDs] optional array of block ids to render, or non if we render the entire canvas
     **/
    _createBlock(i_blockIDs) {
        var blockData = this.m_blocks.blocksPre.shift();
        if (blockData == undefined) {
            this._render([i_blockIDs]);
            return;
        }
        var newBlock = this.blockFactory.createBlock(blockData.blockID, blockData.player_data, this.m_selectedSceneID);
        newBlock.setZindex(blockData.zIndex);
        var blockID = newBlock.getBlockData().blockID;
        newBlock.fabricateBlock(this.m_canvasScale, () => {
            this.m_blocks.blocksPost[blockID] = newBlock;
            this._createBlock(i_blockIDs);
        });
    }

    /**
     Announce to all that scene was re-rendered but do it via debounce
     @method _delegateSceneBlockModified
     **/
    _delegateSceneBlockModified() {
        var self = this;
        self._sceneBlockModified = _.debounce(function (e) {
            self.commBroker.fire({event: SCENE_BLOCKS_RENDERED, fromInstance: self.m_canvas, message: ''});
            self._mementoAddState();
            // self._drawGrid();
        }, 200);
    }

    /**
     Anytime the containing StackView is selected, re-render
     removed while we were gone
     @method _listenStackViewSelected
     **/
    _listenStackViewSelected() {
        // var appContentFaderView = BB.comBroker.getService(BB.SERVICES['APP_CONTENT_FADER_VIEW']);
        // appContentFaderView.on(BB.EVENTS.SELECTED_STACK_VIEW,  (e) => {
        //     if (e == BB.comBroker.getService(BB.SERVICES['SCENES_LOADER_VIEW'])) {
        //         setTimeout( () => {
        //             if (_.isUndefined(this.m_canvas))
        //                 return;
        //             this.m_canvas.calcOffset();
        //         }, 500);
        //     }
        // });
    }

    /**
     Listen to when the app is resized so we can re-render
     @method _listenAppResized
     **/
    _listenAppResized() {
        this.commBroker.onEvent(Consts.Events().WIN_SIZED).subscribe((msg: IMessage) => {
            if (_.isUndefined(this.m_canvas))
                return;
            this.m_canvas.calcOffset();
        });
    }

    /**
     Scene block scales via mouse UI
     @method _sceneBlockScaled
     @param {Event} e
     **/
    _sceneBlockScaled(e) {
        if (this.m_objectScaling)
            return;
        this.m_objectScaling = 1;
        var block = e.target;
        if (_.isUndefined(block))
            return;
        block.on('modified', () => {
            setTimeout(() => {
                block.off('modified');
                var blockID = block.getBlockData().blockID;
                this.commBroker.fire({event: SCENE_BLOCK_CHANGE, fromInstance: this, message: [blockID]});
                this.m_objectScaling = 0;
            }, 15);
        });
    }

    /**
     Scene block moving
     @method _sceneBlockMoving
     @param {Object} i_options
     **/
    _sceneBlockMoving(i_options) {
        var grid = 0;
        if (i_options.target.lockMovementX)
            return;
        if (this.m_gridMagneticMode == 0)
            return;
        if (this.m_gridMagneticMode == 1)
            grid = 5;
        if (this.m_gridMagneticMode == 2)
            grid = 10;
        i_options.target.set({
            left: Math.round(i_options.target.left / grid) * grid,
            top: Math.round(i_options.target.top / grid) * grid
        });
    }

    /**
     Listen to changes in scale so we can reset back to non-zoom on any block object
     @method _listenBlockModified
     **/
    _listenBlockModified() {
        var self = this;
        self.m_canvas.on({
            //'object:moving': self.m_objectScaleHandler,
            //'object:selected': self.m_objectScaleHandler,
            'object:modified': () => {
                self._sceneBlockModified();
            },
            'object:scaling': $.proxy(self._sceneBlockScaled, self)
        });
        self.m_canvas.on('object:moving', $.proxy(self._sceneBlockMoving, self));
    }

    _drawGrid() {
        this.m_canvas.setBackgroundColor('', this.m_canvas.renderAll.bind(this.m_canvas));
        var c: any = $(this.m_canvas)[0];
        var context = c.getContext("2d");
        var h = 600;
        var w = 700;
        for (var x = 0.5; x < (w + 1); x += 10) {
            context.moveTo(x, 0);
            context.lineTo(x, (h + 1));
        }
        for (var y = 0.5; y < (h + 1); y += 10) {
            context.moveTo(0, y);
            context.lineTo(w, y);
        }
        context.globalAlpha = 0.1;
        context.strokeStyle = "black";
        context.stroke();
        context.globalAlpha = 1;
    }

    /**
     Listen to canvas user selections
     @method _listenCanvasSelections
     **/
    _listenCanvasSelections() {

        //this.m_canvas.on('object:selected',  (e) => {
        //    var blockID = e.target.m_blockType;
        //    BB.comBroker.fire(BB.EVENTS.BLOCK_SELECTED, this, null, blockID);
        //});

        this.m_canvas.on('mouse:down', (options) => {
            this.m_canvasMouseState = 1;
        });

        this.m_canvas.on('mouse:up', (options) => {
            this.m_canvasMouseState = 0;
            var active = this.m_canvas.getActiveObject();
            var group = this.m_canvas.getActiveGroup();

            //options.e.stopImmediatePropagation();
            //options.e.preventDefault();

            //// Group
            if (group) {
                con('group selected');
                var selectedGroup = options.target || group;
                _.each(group.objects, (selectedObject) => {
                    var objectPos = {
                        x: (selectedGroup.left + (selectedObject.left)),
                        y: (selectedGroup.top + (selectedObject.top))
                    };
                    if (objectPos.x < 0 && objectPos.y < 0) {
                        // objectPos.x = objectPos.x * -1;
                        // objectPos.y = objectPos.y * -1;
                        return;
                    }
                    var blockID = selectedObject.getBlockData().blockID;
                    con('object: ' + selectedObject.m_blockType + ' ' + blockID);
                    this._updateBlockCords(selectedObject, true, objectPos.x, objectPos.y, selectedObject.currentWidth, selectedObject.currentHeight, selectedObject.angle);
                    // this._updateZorder();
                });
                // this._mementoAddState();
                selectedGroup.hasControls = false;
                // this.m_property = BB.comBroker.getService(BB.SERVICES['PROPERTIES_VIEW']).resetPropertiesView();
                return;
            }

            //// Object
            if (options.target || active) {
                var block = options.target || active;
                this._blockSelected(block);
                return;
            }

            //// Scene
            this._sceneCanvasSelected();
            con('scene: ' + this.m_selectedSceneID);
            // log('object ' + options.e.clientX + ' ' + options.e.clientY + ' ' + options.target.m_blockType);

        });
    }

    /**
     Select a block object on the canvas
     @method _blockSelected
     @param {Object} i_block
     **/
    _blockSelected(i_block) {
        this.m_canvas.setActiveObject(i_block);
        var blockID = i_block.getBlockData().blockID;
        con('object: ' + i_block.m_blockType + ' ' + blockID);
        this._updateBlockCords(i_block, true, i_block.left, i_block.top, i_block.currentWidth, i_block.currentHeight, i_block.angle);
        this.commBroker.fire({event: BLOCK_SELECTED, fromInstance: this, message: blockID});
    }

    /**
     Deselect current group and or block selections
     @method _canvasDiscardSelections
     **/
    _discardSelections() {
        if (!this.m_canvas)
            return;
        this.m_canvas.discardActiveGroup();
        this.m_canvas.discardActiveObject();
    }

    /**
     Set the scene (i.e.: Canvas) as the selected block
     @method _sceneCanvasSelected
     **/
    _sceneCanvasSelected() {
        var self = this;
        if (_.isUndefined(self.m_selectedSceneID))
            return;
        self._discardSelections();
        this.commBroker.fire({event: BLOCK_SELECTED, fromInstance: this, message: self.m_selectedSceneID});
    }

    _onItemSelectedFromToolbar(blockID) {
        if (blockID == 'SCENE')
            return this._sceneCanvasSelected();

        for (var i = 0; i < this.m_canvas.getObjects().length; i++) {
            if (this.m_canvas.item(i).getBlockData().blockID == blockID) {
                this._blockSelected(this.m_canvas.item(i));
                break;
            }
        }
    }

    /**
     Update the coordinates of a block in pepper db, don't allow below w/h MIN_SIZE
     @method _updateBlockCords
     @param {String} blockID
     @param {Boolean} i_calcScale
     @param {Number} x
     @param {Number} y
     @param {Number} w
     @param {Number} h
     **/
    _updateBlockCords(i_block, i_calcScale, x, y, w, h, a) {

        var blockID = i_block.getBlockData().blockID;
        var blockMinWidth = i_block.getBlockData().blockMinWidth;
        var blockMinHeight = i_block.getBlockData().blockMinHeight;

        if (i_calcScale) {
            var sy = 1 / this.m_canvasScale;
            var sx = 1 / this.m_canvasScale;
            h = h * sy;
            w = w * sx;
            x = x * sx;
            y = y * sy;
        }

        if (h < blockMinHeight)
            h = blockMinHeight;
        if (w < blockMinWidth)
            w = blockMinWidth;

        var domPlayerData = this.rp.getScenePlayerdataBlock(this.m_selectedSceneID, blockID);
        var layout = $(domPlayerData).find('Layout');
        layout.attr('rotation', parseInt(a));
        layout.attr('x', parseInt(x));
        layout.attr('y', parseInt(y));
        layout.attr('width', parseInt(w));
        layout.attr('height', parseInt(h));
        var player_data = (new XMLSerializer()).serializeToString(domPlayerData);
        this.rp.setScenePlayerdataBlock(this.m_selectedSceneID, blockID, player_data);
    }

    /**
     Reset all canvas objects to their scale is set to 1
     @method _resetAllObjectScale
     **/
    _resetAllObjectScale() {
        if (_.isUndefined(this.m_selectedSceneID))
            return;
        _.each(this.m_canvas.getObjects(), (obj) => {
            this._resetObjectScale(obj);
        });
        // this.m_canvas.renderAll();
    }

    /**
     Reset a canvas object so its scale is set to 1
     @method _resetObjectScale
     **/
    _resetObjectScale(i_target) {
        if (_.isNull(i_target))
            return;
        if (i_target.width != i_target.currentWidth || i_target.height != i_target.currentHeight) {
            i_target.width = i_target.currentWidth;
            i_target.height = i_target.currentHeight;
            i_target.scaleX = 1;
            i_target.scaleY = 1;
        }
    }

    /**
     Remove all block instances
     @method _disposeBlocks
     @params {Number} [i_blockID] optional to remove only a single block
     **/
    _disposeBlocks(i_blockID?) {
        var i;
        if (_.isUndefined(this.m_canvas))
            return;
        var totalObjects = this.m_canvas.getObjects().length;
        var c = -1;
        for (i = 0; i < totalObjects; i++) {
            c++;
            var block = this.m_canvas.item(c);
            // single block
            if (i_blockID) {
                if (block.getBlockData().blockID == i_blockID) {
                    block.selectable = false; // fix fabric scale block bug
                    this.m_canvas.remove(block);
                    block.deleteBlock();
                    break;
                }
            } else {
                // all blocks
                block.selectable = false; // fix fabric scale block bug
                this.m_canvas.remove(block);
                if (block) {
                    block.deleteBlock();
                    c--;
                }
            }
        }
        if (!i_blockID)
            this.m_canvas.clear();
    }

    _canvasUnselectable() {
        var i;
        if (_.isUndefined(this.m_canvas))
            return;
        this.m_canvas.removeListeners();
        //this.m_canvas.interactive = false;
        // this.m_canvas.selection = false;
        var totalObjects = this.m_canvas.getObjects().length;
        var c = -1;
        for (i = 0; i < totalObjects; i++) {
            c++;
            var block = this.m_canvas.item(c);
            block.selectable = false;
            if (block)
                c--;
        }
    }

    // /**
    //  Listen to all zoom events via wiring the UI
    //  @method _listenZoom
    //  **/
    // _listenZoom() {
    //     this.commBroker.onEvent(SCENE_ZOOM_IN).subscribe((msg: IMessage) => {
    //         // this.m_property = BB.comBroker.getService(BB.SERVICES['PROPERTIES_VIEW']).resetPropertiesView();
    //         this._zoomIn();
    //         this._discardSelections();
    //         this._resetAllObjectScale();
    //         this.m_canvas.renderAll();
    //     });
    //
    //     this.commBroker.onEvent(SCENE_ZOOM_OUT).subscribe((msg: IMessage) => {
    //         // this.m_property = BB.comBroker.getService(BB.SERVICES['PROPERTIES_VIEW']).resetPropertiesView();
    //         this._zoomOut();
    //         this._discardSelections();
    //         this._resetAllObjectScale();
    //         this.m_canvas.renderAll();
    //     });
    //
    //     this.commBroker.onEvent(SCENE_ZOOM_RESET).subscribe((msg: IMessage) => {
    //         // this.m_property = BB.comBroker.getService(BB.SERVICES['PROPERTIES_VIEW']).resetPropertiesView();
    //         this._zoomReset();
    //         this._resetAllObjectScale();
    //         this.m_canvas.renderAll();
    //     });
    // }

    /**
     Zoom to scale size
     @method _zoomTo
     @param {Number} nZooms
     **/
    _zoomTo(nZooms) {
        var i;
        if (nZooms > 0) {
            for (i = 0; i < nZooms; i++)
                this._zoomOut();
        } else {
            for (i = 0; i > nZooms; nZooms++)
                this._zoomIn();
        }
    }

    /**
     Zoom to scale size
     @method _zoomTo
     @param {Number} nZooms
     **/
    _zoomToBlock(nZooms, block) {
        var i;
        if (nZooms > 0) {
            for (i = 0; i < nZooms; i++)
                this._zoomOutBlock(block);
        } else {
            for (i = 0; i > nZooms; nZooms++)
                this._zoomInBlock(block);
        }
    }

    /**
     Scroll canvas to set position
     @method _scrollTo
     @param {Number} i_top
     @param {Number} i_left
     **/
    _scrollTo(i_top, i_left) {
        var self = this;
        $('#scenesPanel', this.el.nativeElement).scrollTop(i_top);
        $('#scenesPanel', this.el.nativeElement).scrollLeft(i_left);
    }

    /**
     Zoom scene in
     @method _zoomIn
     **/
    _zoomIn() {
        if (_.isUndefined(this.m_selectedSceneID))
            return;
        this.m_canvasScale = this.m_canvasScale * this.SCALE_FACTOR;
        this.m_canvas.setHeight(this.m_canvas.getHeight() * this.SCALE_FACTOR);
        this.m_canvas.setWidth(this.m_canvas.getWidth() * this.SCALE_FACTOR);

        var objects = this.m_canvas.getObjects();
        for (var i in objects) {
            if (_.isNull(objects[i]))
                return;
            this._zoomInBlock(objects[i]);
        }
    }

    /**
     Zoom scene in
     @method _zoomIn
     **/
    _zoomInBlock(i_block) {
        var scaleX = i_block.scaleX;
        var scaleY = i_block.scaleY;
        var left = i_block.left;
        var top = i_block.top;
        var tempScaleX = scaleX * this.SCALE_FACTOR;
        var tempScaleY = scaleY * this.SCALE_FACTOR;
        var tempLeft = left * this.SCALE_FACTOR;
        var tempTop = top * this.SCALE_FACTOR;

        i_block['canvasScale'] = this.m_canvasScale;
        i_block.scaleX = tempScaleX;
        i_block.scaleY = tempScaleY;
        i_block.left = tempLeft;
        i_block.top = tempTop;
        i_block.setCoords();

        if (i_block.forEachObject != undefined) {
            i_block.forEachObject((obj) => {
                var scaleX = obj.scaleX;
                var scaleY = obj.scaleY;
                var left = obj.left;
                var top = obj.top;
                var tempScaleX = scaleX * this.SCALE_FACTOR;
                var tempScaleY = scaleY * this.SCALE_FACTOR;
                var tempLeft = left * this.SCALE_FACTOR;
                var tempTop = top * this.SCALE_FACTOR;
                obj['canvasScale'] = this.m_canvasScale;
                obj.scaleX = tempScaleX;
                obj.scaleY = tempScaleY;
                obj.left = tempLeft;
                obj.top = tempTop;
                obj.setCoords();
            });
        }
    }

    /**
     Zoom scene out
     @method _zoomOut
     **/
    _zoomOutBlock(i_block) {
        var scaleX = i_block.scaleX;
        var scaleY = i_block.scaleY;
        var left = i_block.left;
        var top = i_block.top;
        var tempScaleX = scaleX * (1 / this.SCALE_FACTOR);
        var tempScaleY = scaleY * (1 / this.SCALE_FACTOR);
        var tempLeft = left * (1 / this.SCALE_FACTOR);
        var tempTop = top * (1 / this.SCALE_FACTOR);
        i_block['canvasScale'] = this.m_canvasScale;
        i_block.scaleX = tempScaleX;
        i_block.scaleY = tempScaleY;
        i_block.left = tempLeft;
        i_block.top = tempTop;
        i_block.setCoords();

        if (i_block.forEachObject != undefined) {
            i_block.forEachObject((obj) => {
                var scaleX = obj.scaleX;
                var scaleY = obj.scaleY;
                var left = obj.left;
                var top = obj.top;
                var tempScaleX = scaleX * (1 / this.SCALE_FACTOR);
                var tempScaleY = scaleY * (1 / this.SCALE_FACTOR);
                var tempLeft = left * (1 / this.SCALE_FACTOR);
                var tempTop = top * (1 / this.SCALE_FACTOR);
                obj['canvasScale'] = this.m_canvasScale;
                obj.scaleX = tempScaleX;
                obj.scaleY = tempScaleY;
                obj.left = tempLeft;
                obj.top = tempTop;
                obj.setCoords();
            });
        }
    }

    /**
     Zoom scene out
     @method _zoomOut
     **/
    _zoomOut() {
        if (_.isUndefined(this.m_selectedSceneID))
            return;
        this.m_canvasScale = this.m_canvasScale / this.SCALE_FACTOR;
        this.m_canvas.setHeight(this.m_canvas.getHeight() * (1 / this.SCALE_FACTOR));
        this.m_canvas.setWidth(this.m_canvas.getWidth() * (1 / this.SCALE_FACTOR));
        var objects = this.m_canvas.getObjects();
        for (var i in objects) {
            if (_.isNull(objects[i]))
                return;
            this._zoomOutBlock(objects[i]);
        }
    }

    /**
     Zoom reset back to scale 1
     @method _zoomReset
     **/
    _zoomReset() {
        if (_.isUndefined(this.m_selectedSceneID) || _.isUndefined(this.m_canvas)) {
            this.m_canvasScale = 1;
            return;
        }
        this._discardSelections();
        this.m_canvas.setHeight(this.m_canvas.getHeight() * (1 / this.m_canvasScale));
        this.m_canvas.setWidth(this.m_canvas.getWidth() * (1 / this.m_canvasScale));
        var objects = this.m_canvas.getObjects();
        for (var i in objects) {
            if (_.isNull(objects[i]))
                return;
            var scaleX = objects[i].scaleX;
            var scaleY = objects[i].scaleY;
            var left = objects[i].left;
            var top = objects[i].top;
            var tempScaleX = scaleX * (1 / this.m_canvasScale);
            var tempScaleY = scaleY * (1 / this.m_canvasScale);
            var tempLeft = left * (1 / this.m_canvasScale);
            var tempTop = top * (1 / this.m_canvasScale);
            objects[i].scaleX = tempScaleX;
            objects[i].scaleY = tempScaleY;
            objects[i].left = tempLeft;
            objects[i].top = tempTop;
            objects[i].setCoords();
            objects[i]['canvasScale'] = 1;

            if (objects[i].forEachObject != undefined) {
                objects[i].forEachObject((obj) => {
                    var scaleX = obj.scaleX;
                    var scaleY = obj.scaleY;
                    var left = obj.left;
                    var top = obj.top;
                    var tempScaleX = scaleX * (1 / this.m_canvasScale);
                    var tempScaleY = scaleY * (1 / this.m_canvasScale);
                    var tempLeft = left * (1 / this.m_canvasScale);
                    var tempTop = top * (1 / this.m_canvasScale);
                    obj.scaleX = tempScaleX;
                    obj.scaleY = tempScaleY;
                    obj.left = tempLeft;
                    obj.top = tempTop;
                    obj.setCoords();
                    obj['canvasScale'] = 1;
                });
            }
        }
        this.m_canvasScale = 1;
    }

    /**
     Remove a Scene and cleanup after
     @method disposeScene
     **/
    disposeScene() {
        if (_.isUndefined(this.m_canvas))
            return;
        this.m_canvas.off('mouse:up');
        this.m_blocks.blocksPost = {};
        this._disposeBlocks();
        this.m_sceneBlock.deleteBlock();
        this.m_canvas.dispose();
        this.m_canvas = undefined;
        // this.m_property.resetPropertiesView();
    }

    /**
     Create a new scene based on player_data and strip injected IDs if arged
     @method createScene
     @param {String} i_scenePlayerData
     @optional {Boolean} i_stripIDs
     @optional {Boolean} i_loadScene
     @optional {String} i_mimeType
     @optional {String} i_name
     **/
    createScene(i_scenePlayerData, i_stripIDs, i_loadScene, i_mimeType, i_name) {
        if (i_stripIDs)
            i_scenePlayerData = this.rp.stripPlayersID(i_scenePlayerData);
        this.m_selectedSceneID = this.rp.createScene(i_scenePlayerData, i_mimeType, i_name);
        // BB.comBroker.fire(BB.EVENTS.NEW_SCENE_ADDED, this, null, this.m_selectedSceneID);
        if (i_loadScene)
            this._loadScene();
        this.commBroker.fire({event: SCENE_LIST_UPDATED, fromInstance: this});
    }

    /**
     Get currently selected scene id
     @method getSelectedSceneID
     @return {Number} scene id
     **/
    getSelectedSceneID() {
        return this.m_selectedSceneID;
    }

    destroy() {
    }
}




// /**
//  Announce that block count changed with block array of ids
//  @method self._updateBlockCount();
//  **/
// _updateBlockCount() {
// var blocks = [];
// if (_.isUndefined(this.m_selectedSceneID)) {
//     // this.commBroker.fire({event: SCENE_BLOCK_LIST_UPDATED, fromInstance: this});
//     return;
// }
// // cpu breather
// setTimeout(() => {
//     if (_.isUndefined(this.m_canvas))
//         return;
//     var objects = this.m_canvas.getObjects().length;
//     for (var i = 0; i < objects; i++) {
//         blocks.push({
//             id: this.m_canvas.item(i).m_block_id,
//             name: this.m_canvas.item(i).m_blockName
//         });
//     }
//     // this.commBroker.fire({event: SCENE_BLOCK_LIST_UPDATED, fromInstance: this, message: blocks});
// }, 500);

// }