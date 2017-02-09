import {AfterViewInit, Component, EventEmitter, Output} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Once} from "../../decorators/once-decorator";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {Observable} from "rxjs";
import {List} from "immutable";
import {StoreModel} from "../../store/model/StoreModel";

interface selectTimelineBoardIdResult {
    campaignTimelinesModel: CampaignTimelinesModel,
    campaign_timeline_board_template_ids: number[]
}

@Component({
    selector: 'screen-layout-editor',
    template: `
        <small class="release">my component
            <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
        </small>
        <small class="debug">{{me}}</small>
        <div id="screenLayoutEditorView">
            <button (click)="_goBack()" id="prev" type="button" class="openPropsButton btn btn-default btn-sm">
                <span class="glyphicon glyphicon-chevron-left"></span>
            </button>
            <h3 data-localize="empty" data-localize="editScreenLayoutTitle">Edit screen layout</h3>

            <div class="btn-group">
                <button id="layoutEditorAddNew" type="button" data-localize-tooltip="addButtonToolTip" title="add" class="btn btn-default btn-sm">
                    <i style="font-size: 1em" class="fa fa-plus"> </i>
                </button>
                <button id="layoutEditorRemove" type="button" data-localize-tooltip="removeButtonToolTip" title="remove division" class="btn btn-default btn-sm">
                    <i style="font-size: 1em" class="fa fa-minus"> </i>
                </button>
                <button id="layoutEditorPushTop" type="button" data-localize-tooltip="pushDivToTopButtonToolTip" title="push division to top" class="btn btn-default btn-sm">
                    <i style="font-size: 1em" class="fa fa-angle-double-up"> </i>
                </button>
                <button id="layoutEditorPushBottom" type="button" data-localize-tooltip="pushDivToBottomButtonToolTip" title="push division to bottom" class="btn btn-default btn-sm">
                    <i style="font-size: 1em" class="fa fa-angle-double-down"> </i>
                </button>
                <button id="layoutEditorNext" type="button" data-localize-tooltip="getNextDivButtonToolTip" title="get next division" class="btn btn-default btn-sm">
                    <i style="font-size: 1em" class="fa fa-external-link"> </i>
                </button>
            </div>
        </div>
    `,
})
export class ScreenLayoutEditor extends Compbaser implements AfterViewInit {

    RATIO = 4;
    m_canvas;
    m_canvasID;
    m_selectedViewerID;
    m_dimensionProps;
    m_render: boolean = false;

    constructor(private yp: YellowPepperService) {
        super();
    }

    /**
     Constructor
     @method initialize
     **/
    ngAfterViewInit() {
        this.cancelOnDestroy(
            this.yp.listenTimelineSelected()
                .concatMap((i_campaignTimelinesModel: CampaignTimelinesModel) => {
                    return this.yp.getTemplatesOfTimeline(i_campaignTimelinesModel.getCampaignTimelineId())
                        .flatMap((i_campaign_timeline_board_template_ids) => {
                            return Observable.of({
                                campaign_timeline_board_template_ids: i_campaign_timeline_board_template_ids,
                                campaignTimelinesModel: i_campaignTimelinesModel
                            })
                        })
                }).subscribe((result: selectTimelineBoardIdResult) => {
                this.selectView(result.campaignTimelinesModel.getCampaignTimelineId(), result.campaign_timeline_board_template_ids[0])
            })
        )


        // this._listenAddDivision();
        // this._listenRemoveDivision();
        // this._listenPushToTopDivision();
        // this._listenPushToBottomDivision();
        // this._listenSelectNextDivision();

        // this.listenTo(this.options.stackView, BB.EVENTS.SELECTED_STACK_VIEW, function (e) {
        //     if (e == this) {
        //         if (this.m_dimensionProps == undefined) {
        //             require(['DimensionProps'], function (DimensionProps) {
        //                 this.m_dimensionProps = new DimensionProps({
        //                     appendTo: Elements.VIEWER_DIMENSIONS,
        //                     showAngle: false
        //                 });
        //                 $(this.m_dimensionProps).on('changed', function (e) {
        //                     var props = e.target.getValues();
        //                     this._updateDimensionsInDB(this.m_canvas.getActiveObject(), props);
        //                     this._moveViewer(props);
        //                 });
        //                 this._render();
        //             });
        //         } else {
        //             this._render();
        //         }
        //     }
        // });
    }

    // @Once()
    // private _getSelectedBoard() {
    // this.yp.getTemplatesOfTimeline()
    // var boardTemplateIDs = pepper.getTemplatesOfTimeline(self.m_selected_timeline_id);
    // screenLayoutEditor.selectView(self.m_selected_timeline_id, boardTemplateIDs[0]);
    // }

    /**
     Load the editor into DOM using the StackView using animation slider
     @method  selectView
     **/
    selectView(i_campaign_timeline_id, i_campaign_timeline_board_template_id) {
        // this.m_global_board_template_id = pepper.getGlobalTemplateIdOfTimeline(i_campaign_timeline_board_template_id);
        // this.m_screenProps = pepper.getTemplateViewersScreenProps(this.m_campaign_timeline_id, this.m_campaign_timeline_board_template_id);
        // this.m_orientation = BB.comBroker.getService(BB.SERVICES['ORIENTATION_SELECTOR_VIEW']).getOrientation();
        // this.m_resolution = BB.comBroker.getService(BB.SERVICES['RESOLUTION_SELECTOR_VIEW']).getResolution();
        //
        // this.options.stackView.slideToPage(this, 'right');
        //
        // var w = parseInt(this.m_resolution.split('x')[0]) / this.RATIO;
        // var h = parseInt(this.m_resolution.split('x')[1]) / this.RATIO;
        //
        // this._canvasFactory(w, h);
        // this._listenObjectChanged();
        // this._listenObjectsOverlap();
        // this._listenBackgroundSelected();
    }

//
//     /**
//      On render load default dashboard properties
//      @method _render
//      **/
//     _render() {
//         var this = this;
//         this.m_property.resetPropertiesView();
//     }
//
// ,
//
//     /**
//      Listen to the addition of a new viewer
//      @method (totalViews - i)
//      **/
//     _listenAddDivision() {
//         var this = this;
//         $(Elements.LAYOUT_EDITOR_ADD_NEW, this.$el).on('click', function () {
//             var props = {
//                 x: 0,
//                 y: 0,
//                 w: 100,
//                 h: 100
//             }
//             var board_viewer_id = pepper.createViewer(this.m_global_board_template_id, props);
//             var campaign_timeline_chanel_id = pepper.createTimelineChannel(this.m_campaign_timeline_id);
//             pepper.assignViewerToTimelineChannel(this.m_campaign_timeline_board_template_id, board_viewer_id, campaign_timeline_chanel_id);
//
//             var viewer = new fabric.Rect({
//                 left: 0,
//                 top: 0,
//                 fill: '#ececec',
//                 id: board_viewer_id,
//                 hasRotatingPoint: false,
//                 borderColor: '#5d5d5d',
//                 stroke: 'black',
//                 strokeWidth: 1,
//                 borderScaleFactor: 0,
//                 lineWidth: 1,
//                 width: 100,
//                 height: 100,
//                 cornerColor: 'black',
//                 cornerSize: 5,
//                 lockRotation: true,
//                 transparentCorners: false
//             });
//             this.m_canvas.add(viewer);
//
//             var props = {
//                 x: 0,
//                 y: 0,
//                 w: viewer.get('width') * this.RATIO,
//                 h: viewer.get('height') * this.RATIO
//             }
//             this._updateDimensionsInDB(viewer, props);
//         });
//     }
//
//     /**
//      Listen to the removal of an existing screen division
//      @method _listenRemoveDivision
//      **/
//     _listenRemoveDivision() {
//         var this = this;
//         $(Elements.LAYOUT_EDITOR_REMOVE, this.$el).on('click', function () {
//             if (_.isUndefined(this.m_canvas))
//                 return;
//             var totalViews = this.m_canvas.getObjects().length;
//             if (totalViews < 2) {
//                 bootbox.alert($(Elements.MSG_BOOTBOX_AT_LEAST_ONE_DIV).text());
//                 return;
//             }
//             var campaign_timeline_chanel_id = pepper.removeTimelineBoardViewerChannel(this.m_selectedViewerID);
//             pepper.removeBoardTemplateViewer(this.m_campaign_timeline_board_template_id, this.m_selectedViewerID);
//             pepper.removeChannelFromTimeline(campaign_timeline_chanel_id);
//             pepper.removeBlocksFromTimelineChannel(campaign_timeline_chanel_id);
//             this.m_canvas.remove(this.m_canvas.getActiveObject());
//             this.m_canvas.renderAll();
//             /*var viewer = this.m_canvas.item(0);
//              var props = {
//              y: viewer.get('top'),
//              x: viewer.get('left'),
//              w: viewer.get('width') * this.RATIO,
//              h: viewer.get('height') * this.RATIO
//              };
//              this._updateDimensionsInDB(viewer, props);*/
//             BB.comBroker.fire(BB.EVENTS.VIEWER_REMOVED, this, this, {
//                 campaign_timeline_chanel_id: campaign_timeline_chanel_id
//             });
//             pepper.announceTemplateViewerEdited(this.m_campaign_timeline_board_template_id);
//         });
//     }
//
//     /**
//      Listen to re-order of screen division, putting selected on top
//      @method _listenPushToTopDivision
//      **/
//     _listenPushToTopDivision() {
//         var this = this;
//         $(Elements.LAYOUT_EDITOR_PUSH_TOP, this.$el).on('click', function () {
//             var viewer = this.m_canvas.getActiveObject();
//             if (!viewer)
//                 return;
//             this.m_canvas.bringToFront(viewer);
//             this._updateZorder();
//         });
//     }
//
// ,
//
//     /**
//      Listen to re-order of screen division, putting selected at bottom
//      @method _listenPushToBottomDivision
//      **/
//     _listenPushToBottomDivision() {
//         var this = this;
//         $(Elements.LAYOUT_EDITOR_PUSH_BOTTOM, this.$el).on('click', function () {
//             var viewer = this.m_canvas.getActiveObject();
//             if (!viewer)
//                 return;
//             this.m_canvas.sendToBack(viewer);
//             this._updateZorder();
//         });
//     }
//
//     /**
//      Change the z-order of viewers in pepper
//      @method _updateZorder
//      **/
//     _updateZorder() {
//         var this = this;
//         var viewers = this.m_canvas.getObjects();
//         for (var i in viewers) {
//             // log(viewers[i].get('id') + ' ' + i);
//             pepper.updateTemplateViewerOrder(viewers[i].get('id'), i);
//         }
//         var active = this.m_canvas.getActiveObject();
//         this.m_canvas.setActiveObject(active);
//     }
//
//     /**
//      Listen to selection of next viewer
//      @method _listenSelectNextDivision
//      **/
//     _listenSelectNextDivision() {
//         var this = this;
//         $(Elements.LAYOUT_EDITOR_NEXT, this.$el).on('click', function () {
//             var viewer = this.m_canvas.getActiveObject();
//             var viewIndex = this.m_canvas.getObjects().indexOf(viewer);
//             var totalViews = this.m_canvas.getObjects().length;
//             if (viewIndex == totalViews - 1) {
//                 this.m_canvas.setActiveObject(this.m_canvas.item(0));
//             } else {
//                 this.m_canvas.setActiveObject(this.m_canvas.item(viewIndex + 1));
//             }
//         });
//     }
//
//     /**
//      Unload the editor from DOM using the StackView animated slider
//      @method  selectView
//      **/
//     _deSelectView() {
//         var this = this;
//         this._destroy();
//         this.m_property.resetPropertiesView();
//         this.options.stackView.slideToPage(this.options.from, 'left');
//     }
//
//     /**
//      Create the canvas to render the screen division
//      @method _canvasFactory
//      @param {Number} i_width
//      @param {Number} i_height
//      **/
//     _canvasFactory(i_width, i_height) {
//         var this = this;
//
//         var offsetH = i_height / 2;
//         var offsetW = (i_width / 2) + 30;
//         this.m_canvasID = _.uniqueId('screenLayoutEditorCanvas');
//         $('#screenLayoutEditorCanvasWrap').append('' +
//             '<div>' +
//             '<span align="center">' + this.m_resolution.split('x')[0] + 'px </span>' +
//             '<canvas id="' + this.m_canvasID + '" width="' + i_width + 'px" height="' + i_height + 'px" style="border: 1px solid rgb(170, 170, 170);"></canvas>' +
//             '<span style="position: relative; top: -' + offsetH + 'px; left: -' + offsetW + 'px;">' + this.m_resolution.split('x')[1] + 'px</span>' +
//             '</div>');
//
//         this.m_canvas = new fabric.Canvas(this.m_canvasID);
//         this.m_canvas.selection = false;
//
//         var screenTemplateData = {
//             orientation: this.m_orientation,
//             resolution: this.m_resolution,
//             screenProps: this.m_screenProps,
//             scale: this.RATIO
//         };
//
//         var screenTemplate = new ScreenTemplateFactory({
//             i_screenTemplateData: screenTemplateData,
//             i_thisDestruct: true,
//             i_owner: this
//         });
//
//         var rects = screenTemplate.getDivisions();
//
//         for (var i = 0; i < rects.length; i++) {
//             var rectProperties = rects[i];
//             var rect = new fabric.Rect({
//                 left: rectProperties.x.baseVal.value,
//                 top: rectProperties.y.baseVal.value,
//                 fill: '#ececec',
//                 id: $(rectProperties).data('campaign_timeline_board_viewer_id'),
//                 hasRotatingPoint: false,
//                 borderColor: '#5d5d5d',
//                 stroke: 'black',
//                 strokeWidth: 1,
//                 borderScaleFactor: 0,
//                 lineWidth: 1,
//                 width: rectProperties.width.baseVal.value,
//                 height: rectProperties.height.baseVal.value,
//                 cornerColor: 'black',
//                 cornerSize: 5,
//                 lockRotation: true,
//                 transparentCorners: false
//             });
//             this.m_canvas.add(rect);
//
//             //rect.on('selected', function () {
//             //  log('object selected a rectangle');
//             //});
//         }
//
//         //this.m_canvas.on('object:moving', function (e) {
//         //    log('savings: ' + this.m_global_board_template_id);
//         //});
//
//         setTimeout(function () {
//             if (!this.m_canvas)
//                 return;
//             this.m_canvas.setHeight(i_height);
//             this.m_canvas.setWidth(i_width);
//             this.m_canvas.renderAll();
//         }, 500);
//     }
//
//     /**
//      Listen to changes on selecting the background canvas
//      @method _listenBackgroundSelected
//      **/
//     _listenBackgroundSelected() {
//         var this = this;
//         this.m_bgSelectedHandler = function (e) {
//             this.m_property.resetPropertiesView();
//         };
//         this.m_canvas.on('selection:cleared', this.m_bgSelectedHandler);
//     }
//
//     /**
//      Listen to changes in viewer overlaps
//      @method _listenObjectsOverlap
//      **/
//     _listenObjectsOverlap() {
//         var this = this;
//         this.m_onOverlap = function (options) {
//             options.target.setCoords();
//             this.m_canvas.forEachObject(function (obj) {
//                 if (obj === options.target) return;
//                 obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 1);
//             });
//         }
//
//         this.m_canvas.on({
//             'object:moving': this.m_onOverlap,
//             'object:scaling': this.m_onOverlap,
//             'object:rotating': this.m_onOverlap
//         });
//     }
//
// ,
//
//     /**
//      Make sure that at least one screen division is visible within the canvas
//      @method _enforceViewerVisible
//      **/
//     _enforceViewerVisible() {
//         var this = this;
//         var pass = 0;
//         var viewer;
//         this.m_canvas.forEachObject(function (o) {
//             viewer = o;
//             if (pass)
//                 return;
//             if (o.get('left') < (0 - o.get('width')) + 20) {
//             } else if (o.get('left') > this.m_canvas.getWidth() - 20) {
//             } else if (o.get('top') < (0 - o.get('height') + 20)) {
//             } else if (o.get('top') > this.m_canvas.getHeight() - 20) {
//             } else {
//                 pass = 1;
//             }
//         });
//         if (!pass && viewer) {
//             viewer.set({left: 0, top: 0}).setCoords();
//             viewer.setCoords();
//             this.m_canvas.renderAll();
//             bootbox.alert({
//                 message: $(Elements.MSG_BOOTBOX_AT_LEAST_ONE_DIV).text(),
//                 title: $(Elements.MSG_BOOTBOX_SCREEN_DIV_POS_RESET).text()
//             });
//             var props = {
//                 x: viewer.get('top'),
//                 y: viewer.get('left'),
//                 w: viewer.get('width') * this.RATIO,
//                 h: viewer.get('height') * this.RATIO
//             }
//             this._updateDimensionsInDB(viewer, props);
//         }
//     }
//
//     /**
//      Enforce minimum x y w h props
//      @method this._enforceViewerMinimums(i_viewer);
//      @param {Object} i_rect
//      **/
//     _enforceViewerMinimums(i_viewer) {
//         var this = this;
//         var MIN_SIZE = 50;
//         if ((i_viewer.width * this.RATIO) < MIN_SIZE || (i_viewer.height * this.RATIO) < MIN_SIZE) {
//             i_viewer.width = MIN_SIZE / this.RATIO;
//             i_viewer.height = MIN_SIZE / this.RATIO;
//             var props = {
//                 x: i_viewer.get('top'),
//                 y: i_viewer.get('left'),
//                 w: MIN_SIZE,
//                 h: MIN_SIZE
//             }
//             this._updateDimensionsInDB(i_viewer, props);
//         }
//     }
//
//     /**
//      Listen to changes in a viewer changes in cords and update pepper
//      @method i_props
//      **/
//     _listenObjectChanged() {
//         var this = this;
//         this.m_objectMovingHandler = _.debounce(function (e) {
//             var o = e.target;
//             if (o.width != o.currentWidth || o.height != o.currentHeight) {
//                 o.width = o.currentWidth;
//                 o.height = o.currentHeight;
//                 o.scaleX = 1;
//                 o.scaleY = 1;
//             }
//
//             this._enforceViewerMinimums(o);
//             this._enforceViewerVisible();
//
//             var x = BB.lib.parseToFloatDouble(o.left) * this.RATIO;
//             var y = BB.lib.parseToFloatDouble(o.top) * this.RATIO;
//             var w = BB.lib.parseToFloatDouble(o.currentWidth) * this.RATIO;
//             var h = BB.lib.parseToFloatDouble(o.currentHeight) * this.RATIO;
//             // var a = o.get('angle');
//             var props = {
//                 w: w,
//                 h: h,
//                 x: x,
//                 y: y
//             };
//             this.m_property.viewPanel(Elements.VIEWER_EDIT_PROPERTIES);
//             this.m_dimensionProps.setValues(props);
//             this.m_selectedViewerID = o.id;
//             this._updateDimensionsInDB(o, props);
//
//         }, 200);
//
//         this.m_canvas.on({
//             'object:moving': this.m_objectMovingHandler,
//             'object:scaling': this.m_objectMovingHandler,
//             'object:selected': this.m_objectMovingHandler,
//             'object:modified': this.m_objectMovingHandler
//         });
//     }
//
//     /**
//      Move the object / viewer to new set of coords
//      @method _moveViewer
//      @param {Object} i_props
//      **/
//     _moveViewer(i_props) {
//         var this = this;
//         // log('moving viewer');
//         var viewer = this.m_canvas.getActiveObject();
//         if (viewer) {
//             viewer.setWidth(i_props.w / this.RATIO);
//             viewer.setHeight(i_props.h / this.RATIO);
//             viewer.set('left', i_props.x / this.RATIO);
//             viewer.set('top', i_props.y / this.RATIO);
//
//             this._enforceViewerMinimums(viewer);
//             this._enforceViewerVisible();
//
//             viewer.setCoords();
//             this.m_canvas.renderAll();
//         }
//     }
//
//     /**
//      Update Pepper with latest object dimensions
//      @method _updateDimensionsInDB
//      @param {Object} i_props
//      **/
//     _updateDimensionsInDB(i_viewer, i_props) {
//         var this = this;
//         log('Pepper ' + i_viewer.get('id') + ' ' + JSON.stringify(i_props));
//         pepper.setBoardTemplateViewer(this.m_campaign_timeline_board_template_id, i_viewer.get('id'), i_props);
//         i_viewer.setCoords();
//         this.m_canvas.renderAll();
//     }
//
//     /**
//      One exit UI destroy all members
//      @method _destroy
//      **/
//     _destroy() {
//         var this = this;
//         if (!_.isUndefined(this.m_canvas)) {
//             this.m_canvas.off('selection:cleared', this.m_bgSelectedHandler);
//             this.m_canvas.off({
//                 'object:moving': this.m_objectMovingHandler,
//                 'object:scaling': this.m_objectMovingHandler,
//                 'object:selected': this.m_objectMovingHandler,
//                 'object:modified': this.m_objectMovingHandler
//             });
//             this.m_canvas.off({
//                 'object:moving': this.m_onOverlap,
//                 'object:scaling': this.m_onOverlap,
//                 'object:rotating': this.m_onOverlap
//             });
//             this.m_canvas.clear().renderAll();
//         }
//         $('#screenLayoutEditorCanvasWrap').empty()
//         this.m_canvasID = undefined;
//         this.m_canvas = undefined;
//         this.m_campaign_timeline_id = undefined;
//         this.m_campaign_timeline_board_template_id = undefined;
//         this.m_screenProps = undefined;
//         this.m_orientation = undefined;
//         this.m_resolution = undefined;
//         this.m_global_board_template_id = undefined;
//         this.m_selectedViewerID = undefined;
//     }

    @Output()
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    _goBack() {
        this.onGoBack.emit();
    }

    ngOnInit() {
    }

    destroy() {
        console.log('dest screen-layout-editor');
    }
}