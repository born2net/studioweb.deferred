import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {timeout} from "../../decorators/timeout-decorator";
import {Subject} from "rxjs";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser} from "ng-mslib";
import {Lib} from "../../Lib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-common',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <form class="inner5" novalidate autocomplete="off" [formGroup]="contGroup">
            <div class="row">
                <div class="panel-heading">
                    <small class="release">common properties
                        <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
                    </small>

                </div>
                <ul class="list-group">
                    <li class="list-group-item">
                        alpha
                        <input id="slider1" (change)="_onAlphaChange($event)" [formControl]="contGroup.controls['alpha']" type="range" min="0" max="1" step="0.1"/>
                    </li>
                    <li class="list-group-item">
                        background
                        <button style="position: relative; top: 15px" (click)="_onRemoveBackgroundClicked()" class="btn btn-default btn-sm pull-right" type="button">
                            <i class="fa fa-times"></i>
                        </button>
                        <div id="bgColorGradientSelector"></div>
                    </li>

                    <li class="list-group-item">
                        <div style="padding-top: 20px; padding-bottom: 20px">
                            border
                            <br/>
                            <div class="material-switch pull-right">
                                <input #borderSelection (change)="_toggleBorder(borderSelection.checked)"
                                       [formControl]="contGroup.controls['border']"
                                       id="borderSelection"
                                       name="borderSelection" type="checkbox"/>
                                <label for="borderSelection" class="label-primary"></label>
                            </div>
                            <input #borderColor [disabled]="!borderSelection.checked" (colorPickerChange)="m_borderColorChanged.next($event)"
                                   [cpOKButton]="true" [cpOKButtonClass]="'btn btn-primary btn-xs'"
                                   [(colorPicker)]="m_color" [cpPosition]="'bottom'"
                                   [cpAlphaChannel]="'disabled'" style="width: 185px"
                                   [style.background]="m_color" [value]="m_color"/>
                        </div>
                    </li>
                </ul>
            </div>
        </form>
        <h5>block id {{m_blockData.blockID}}</h5>
    `
})
export class BlockPropCommon extends Compbaser implements AfterViewInit {

    private formInputs = {};
    private contGroup: FormGroup;
    private m_blockData: IBlockData;
    private m_borderColorChanged = new Subject();
    m_color;

    constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private rp: RedPepperService, private bs: BlockService, private el: ElementRef) {
        super();
        this.contGroup = fb.group({
            'alpha': [0],
            'borderColor': [],
            'border': [0]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })
        this._listenBorderChanged();
    }

    /**
     * set block data for the component.
     * on first selection we just set the blockData, in subsequent calls we only
     * re-render if we are dealing with a new block id, note that on componet creation
     * the rendering is done via ngAfterViewInit
     * @param i_blockData
     */
    @Input()
    set setBlockData(i_blockData) {
        if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
            this.m_blockData = i_blockData;
            this._render();
        } else {
            this.m_blockData = i_blockData;
        }
    }

    ngAfterViewInit() {
        this._listenBorderChanged();
        this._bgGradientWidgetInit();
        this._render();
    }

    /**
     * Render the component with latest data from BlockData
     */
    _render() {
        this._alphaPopulate();
        this._gradientPopulate();
        this._borderPropsPopulate();
    }

    _listenBorderChanged() {
        this.cancelOnDestroy(
            //
            this.m_borderColorChanged
                .debounceTime(500)
                .distinct()
                .subscribe((i_color) => {
                    var domPlayerData = this.m_blockData.playerDataDom;
                    var border = this._findBorder(domPlayerData);
                    jXML(border).attr('borderColor', Lib.HexToDecimal(i_color));
                    this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
                }, (e) => console.error(e))
        )
    }

    /**
     Toggle block background on UI checkbox selection
     @method _toggleBorder
     @param {event} e
     **/
    _toggleBorder(i_checked: boolean) {
        var self = this;
        var xBgSnippet = undefined;
        var domPlayerData = self.m_blockData.playerDataDom;
        var checked = i_checked == true ? 1 : 0;
        if (checked) {
            // self._enableBorderSelection();
            xBgSnippet = self.bs.getCommonBorderXML();
            var data = jXML(domPlayerData).find('Data').eq(0);
            var bgData: any = self._findBorder(data);
            if (bgData.length > 0 && !_.isUndefined(bgData.replace)) { // ie bug workaround
                bgData.replace(jXML(xBgSnippet));
            } else {
                jXML(data).append(jXML(xBgSnippet));
            }
            // var player_data = self.rp.xmlToStringIEfix(domPlayerData);
            // domPlayerData = jXML.parseXML(player_data);
            this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
            // self._borderPropsPopulate();
            //self._announceBlockChanged();
        } else {
            var xSnippet = self._findBorder(domPlayerData);
            jXML(xSnippet).remove();
            // self._borderPropsUnpopulate();
            this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
        }
    }

    /**
     On changes in msdb model updated UI common alpha properties
     @method _alphaPopulate
     **/
    _alphaPopulate() {
        var self = this;
        var domPlayerData = self.m_blockData.playerDataDom;
        var data = jXML(domPlayerData).find('Data').eq(0);
        var xSnippet = jXML(data).find('Appearance').eq(0);
        var a1: any = jXML(xSnippet).attr('alpha');
        if (_.isUndefined(a1)) a1 = 1;
        this.formInputs['alpha'].setValue(a1)
    }

    _onAlphaChange(event) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var data = jXML(domPlayerData).find('Data').eq(0);
        var xSnippet = jXML(data).find('Appearance').eq(0);
        jXML(xSnippet).attr('alpha', event.target.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    /**
     On changes in msdb model updated UI common border properties
     @method _borderPropsPopulate
     **/
    _borderPropsPopulate() {
        var self = this;
        var domPlayerData = self.m_blockData.playerDataDom;
        var xSnippet = self._findBorder(domPlayerData);
        if (xSnippet.length > 0) {
            var color = jXML(xSnippet).attr('borderColor');
            this._updateBorderColor(true, color)
        } else {
            this._updateBorderColor(false, '16777215')
        }
    }

    _updateBorderColor(i_value, i_color) {
        this.formInputs['border'].setValue(i_value);
        this.m_color = '#' + Lib.DecimalToHex(i_color);
        // this.cd.markForCheck();
    }

    /**
     Find the border section in player_data for selected block
     @method _findBorder
     @param  {object} i_domPlayerData
     @return {Xml} xSnippet
     **/
    _findBorder(i_domPlayerData) {
        return jXML(i_domPlayerData).find('Border');
    }

    /**
     Load jXML gradient component once
     @method _bgGradientWidgetInit
     **/
    _bgGradientWidgetInit() {
        var self = this;
        var lazyUpdateBgColor = _.debounce(function (points, styles) {
            if (points.length == 0)
                return;
            self._gradientChanged({points: points, styles: styles})
            // console.log('gradient 1...' + Math.random());
        }, 50);

        var gradientColorPickerClosed = function () {
            // console.log('gradient 2');
        };

        jQueryAny('#bgColorGradientSelector', self.el.nativeElement).gradientPicker({
            change: lazyUpdateBgColor,
            closed: gradientColorPickerClosed,
            fillDirection: "90deg"
        });

        // always close gradient color picker on mouseout
        // jXML('.colorpicker').on('mouseleave', function (e) {
        //     jXML(document).trigger('mousedown');
        //     console.log('gradient 3');
        // });
    }

    /**
     On changes in msdb model updated UI common gradient background properties
     @method _gradientPopulate
     **/
    _gradientPopulate() {
        var self = this;
        var gradient = jXML('#bgColorGradientSelector', self.el.nativeElement).data("gradientPicker-sel");
        // gradient.changeFillDirection("top"); /* change direction future support */
        this._bgGradientWidgetClear();
        var domPlayerData = self.m_blockData.playerDataDom;
        var xSnippet = self._findGradientPoints(domPlayerData);
        if (xSnippet.length > 0) {
            var points = jXML(xSnippet).find('Point');
            $.each(points, function (i, point) {
                var pointColor = Lib.DecimalToHex(jXML(point).attr('color'));
                var pointMidpoint = (parseInt(jXML(point).attr('midpoint')) / 250);
                gradient.addPoint(pointMidpoint, pointColor, true);
            });
        }
    }

    _bgGradientWidgetClear() {
        var gradient = jQuery('#bgColorGradientSelector', this.el.nativeElement).data("gradientPicker-sel");
        gradient.removeAllPoints();
        gradient.clear();
    }

    _gradientChanged(e) {
        var self = this;
        var points: any = e.points;
        var styles = e.styles;
        if (points.length == 0)
            return;
        var domPlayerData = self.m_blockData.playerDataDom;
        jXML(domPlayerData).find('Background').remove();
        var pointsXML = "";
        for (var i = 0; i < points.length; ++i) {
            var pointMidpoint: any = (points[i].position * 250);
            var color = Lib.ColorToDecimal(points[i].color);
            var xPoint = '<Point color="' + color + '" opacity="1" midpoint="' + pointMidpoint + '" />';
            // log(xPoint);
            // jXML(gradientPoints).append(xPoint);
            pointsXML += xPoint;
        }
        var xPointsSnippet = jXML.parseXML(this.bs.getCommonBackgroundXML());
        jXML(xPointsSnippet).find('GradientPoints').empty().append(pointsXML);
        var newGradientPoints = (new XMLSerializer()).serializeToString(xPointsSnippet);
        jXML(domPlayerData).find('Data').append(newGradientPoints)
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _findGradientPoints(i_domPlayerData) {
        var xSnippet = jXML(i_domPlayerData).find('GradientPoints');
        return xSnippet;
    }

    _onRemoveBackgroundClicked() {
        this._bgGradientWidgetClear();
        var domPlayerData = this.m_blockData.playerDataDom;
        var gradientPoints = this._findGradientPoints(domPlayerData);
        jXML(gradientPoints).empty();
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _findBackground(i_domPlayerData) {
        var xSnippet = jXML(i_domPlayerData).find('Background');
        return xSnippet;
    }

    destroy() {
        var gradient = jXML('#bgColorGradientSelector', this.el.nativeElement).data("gradientPicker-sel");
        gradient.destroyed();
    }
}

