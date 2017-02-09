import {AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, ElementRef, EventEmitter, Output, ViewChild, ViewContainerRef} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {Observable} from "rxjs";
import {List} from "immutable";
import {StoreModel} from "../../store/model/StoreModel";
import {OrientationEnum} from "./campaign-orientation";
import {IScreenTemplateData, ScreenTemplate} from "../../comps/screen-template/screen-template";
import * as _ from 'lodash';
import Any = jasmine.Any;
import {Lib} from "../../Lib";

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
        <div [hidden]="true">
            <ng-container #container></ng-container>
        </div>
        <div id="screenLayoutEditorCanvasWrap"></div>
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
    m_orientation: OrientationEnum;
    m_objectMovingHandler;
    m_resolution: string;
    m_screenTemplateData: IScreenTemplateData;
    m_global_board_template_id: number = -1;

    private componentRef: ComponentRef<ScreenTemplate>;

    constructor(private yp: YellowPepperService, private componentFactoryResolver: ComponentFactoryResolver, private el: ElementRef) {
        super();
    }

    @ViewChild('container', {read: ViewContainerRef})
    container: ViewContainerRef;

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

    /**
     Load the editor into DOM using the StackView using animation slider
     @method  selectView
     **/
    selectView(i_campaign_timeline_id, i_campaign_timeline_board_template_id) {
        this.cancelOnDestroy(
            this.yp.getGlobalTemplateIdOfTimeline(i_campaign_timeline_board_template_id)
                .concatMap((i_board_template_id) => {
                    this.m_global_board_template_id = i_board_template_id[0];
                    return this.yp.getTemplateViewersScreenProps(i_campaign_timeline_id, i_campaign_timeline_board_template_id)
                })
                .subscribe((screenTemplateData: IScreenTemplateData) => {
                    this.m_orientation = screenTemplateData.orientation;
                    this.m_resolution = screenTemplateData.resolution;
                    this.m_screenTemplateData = screenTemplateData;
                    var w = parseInt(this.m_resolution.split('x')[0]) / this.RATIO;
                    var h = parseInt(this.m_resolution.split('x')[1]) / this.RATIO;
                    this._canvasFactory(w, h);
                    this._listenObjectChanged();
                    // this._listenObjectsOverlap();
                    // this._listenBackgroundSelected();
                })
        )
    }

    /**
     Create the canvas to render the screen division
     @method _canvasFactory
     @param {Number} i_width
     @param {Number} i_height
     **/
    _canvasFactory(i_width, i_height) {
        var self = this;
        var offsetH = i_height / 2;
        var offsetW = (i_width / 2) + 30;
        this.m_canvasID = _.uniqueId('screenLayoutEditorCanvas');
        jQuery('#screenLayoutEditorCanvasWrap', this.el.nativeElement).append(`
            <div>
            <span align="center">${this.m_resolution.split('x')[0]}px</span> 
            <canvas id="${this.m_canvasID}" width="${i_width}px" height="${i_height}px" style="border: 1px solid rgb(170, 170, 170);"></canvas>
            <span style="position: relative; top: "-${offsetH}px" left: "-${offsetW}px">
                ${this.m_resolution.split('x')[1]}px
            </span>
            </div>`);
        this.m_canvas = new fabric.Canvas(this.m_canvasID);
        this.m_canvas.selection = false;
        let factory = this.componentFactoryResolver.resolveComponentFactory(ScreenTemplate);
        this.componentRef = this.container.createComponent(factory);
        this.m_screenTemplateData.scale = 4;
        this.componentRef.instance.setTemplate = this.m_screenTemplateData;
        var rects = this.componentRef.instance.getDivisions();

        for (var i = 0; i < rects.length; i++) {
            var rectProperties: any = rects[i];
            var rect: any = new fabric.Rect({
                left: rectProperties.x.baseVal.value,
                top: rectProperties.y.baseVal.value,
                fill: '#ececec',
                id: jQueryAny(rectProperties).data('campaign_timeline_board_viewer_id'),
                hasRotatingPoint: false,
                borderColor: '#5d5d5d',
                stroke: 'black',
                strokeWidth: 1,
                borderScaleFactor: 0,
                width: rectProperties.width.baseVal.value,
                height: rectProperties.height.baseVal.value,
                cornerColor: 'black',
                cornerSize: 5,
                lockRotation: true,
                transparentCorners: false
            });
            this.m_canvas.add(rect);

            //rect.on('selected', function () {
            //  log('object selected a rectangle');
            //});
        }

        //this.m_canvas.on('object:moving', function (e) {
        //    log('savings: ' + this.m_global_board_template_id);
        //});

        setTimeout(function () {
            if (!self.m_canvas)
                return;
            self.m_canvas.setHeight(i_height);
            self.m_canvas.setWidth(i_width);
            self.m_canvas.renderAll();
        }, 500);

    }

    /**
     Make sure that at least one screen division is visible within the canvas
     @method _enforceViewerVisible
     **/
    _enforceViewerVisible() {
        var self = this;
        var pass = 0;
        var viewer;
        self.m_canvas.forEachObject(function (o) {
            viewer = o;
            if (pass)
                return;
            if (o.get('left') < (0 - o.get('width')) + 20) {
            } else if (o.get('left') > self.m_canvas.getWidth() - 20) {
            } else if (o.get('top') < (0 - o.get('height') + 20)) {
            } else if (o.get('top') > self.m_canvas.getHeight() - 20) {
            } else {
                pass = 1;
            }
        });
        if (!pass && viewer) {
            viewer.set({left: 0, top: 0}).setCoords();
            viewer.setCoords();
            self.m_canvas.renderAll();
            bootbox.alert({
                message: "you must keep at least one viewable screen division",
                title: "screen division position reset"
            });
            var props = {
                x: viewer.get('top'),
                y: viewer.get('left'),
                w: viewer.get('width') * self.RATIO,
                h: viewer.get('height') * self.RATIO
            }
            self._updateDimensionsInDB(viewer, props);
        }
    }

    /**
     Enforce minimum x y w h props
     @method this._enforceViewerMinimums(i_viewer);
     @param {Object} i_rect
     **/
    _enforceViewerMinimums(i_viewer) {
        var MIN_SIZE = 50;
        if ((i_viewer.width * this.RATIO) < MIN_SIZE || (i_viewer.height * this.RATIO) < MIN_SIZE) {
            i_viewer.width = MIN_SIZE / this.RATIO;
            i_viewer.height = MIN_SIZE / this.RATIO;
            var props = {
                x: i_viewer.get('top'),
                y: i_viewer.get('left'),
                w: MIN_SIZE,
                h: MIN_SIZE
            }
            this._updateDimensionsInDB(i_viewer, props);
        }
    }

    /**
     Listen to changes in a viewer changes in cords and update pepper
     @method i_props
     **/
    _listenObjectChanged() {
        var self = this;
        self.m_objectMovingHandler = _.debounce(function (e) {
            var o = e.target;
            if (o.width != o.currentWidth || o.height != o.currentHeight) {
                o.width = o.currentWidth;
                o.height = o.currentHeight;
                o.scaleX = 1;
                o.scaleY = 1;
            }

            self._enforceViewerMinimums(o);
            self._enforceViewerVisible();

            var x = Lib.ParseToFloatDouble(o.left) * self.RATIO;
            var y = Lib.ParseToFloatDouble(o.top) * self.RATIO;
            var w = Lib.ParseToFloatDouble(o.currentWidth) * self.RATIO;
            var h = Lib.ParseToFloatDouble(o.currentHeight) * self.RATIO;
            // var a = o.get('angle');
            var props = {
                w: w,
                h: h,
                x: x,
                y: y
            };
            // self.m_property.viewPanel(Elements.VIEWER_EDIT_PROPERTIES);
            //todo: props
            //self.m_dimensionProps.setValues(props);
            self.m_selectedViewerID = o.id;
            self._updateDimensionsInDB(o, props);

        }, 200);

        self.m_canvas.on({
            'object:moving': self.m_objectMovingHandler,
            'object:scaling': self.m_objectMovingHandler,
            'object:selected': self.m_objectMovingHandler,
            'object:modified': self.m_objectMovingHandler
        });
    }

    /**
     Update Pepper with latest object dimensions
     @method _updateDimensionsInDB
     @param {Object} i_props
     **/
    _updateDimensionsInDB(i_viewer, i_props) {
        // var this = this;
        // log('Pepper ' + i_viewer.get('id') + ' ' + JSON.stringify(i_props));
        // pepper.setBoardTemplateViewer(this.m_campaign_timeline_board_template_id, i_viewer.get('id'), i_props);
        // i_viewer.setCoords();
        // this.m_canvas.renderAll();
    }


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