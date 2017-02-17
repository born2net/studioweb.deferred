import {AfterViewInit, Component, ElementRef, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import {Observable} from "rxjs";
import {Lib, simpleRegExp} from "../../Lib";
import * as _ from "lodash";
import {BlockService, IBlockData} from "./block-service";
import {HelperPepperService} from "../../services/helperpepper-service";

@Component({
    selector: 'block-prop-common',
    //changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    template: `
        <div>
            <form novalidate autocomplete="off" [formGroup]="contGroup">
                <div class="row">
                    <div class="inner userGeneral">
                        <div class="panel panel-default tallPanel">
                            <div class="panel-heading">
                                <small class="release">target properties
                                    <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
                                </small>
                                <small class="debug">{{me}}</small>
                            </div>
                            <ul class="list-group">
                                <li class="list-group-item">
                                    alpha
                                    <input id="slider1" (change)="_onAlphaChange($event)" [formControl]="contGroup.controls['alpha']" type="range" min="0" max="1" step="0.1"/>
                                </li>
                                <li class="list-group-item">
                                    background
                                    <div style="position: relative; top: 12px" class="material-switch pull-right">
                                        <input (change)="saveToStore(backgroundSelection.checked)"
                                               [formControl]="contGroup.controls['background']"
                                               id="backgroundSelection" #backgroundSelection
                                               name="backgroundSelection" type="checkbox"/>
                                        <label for="backgroundSelection" class="label-primary"></label>
                                    </div>
                                    <div id="bgColorGradientSelector"></div>
                                </li>

                                <li class="list-group-item">
                                    <div style="padding-top: 20px; padding-bottom: 20px">
                                        border
                                        <div class="material-switch pull-right">
                                            <input (change)="saveToStore(borderSelection.checked)"
                                                   [formControl]="contGroup.controls['border']"
                                                   id="borderSelection" #borderSelection
                                                   name="borderSelection" type="checkbox"/>
                                            <label for="borderSelection" class="label-primary"></label>
                                        </div>
                                        <input [(colorPicker)]="m_color" [cpPosition]="'bottom'" [style.background]="m_color" [value]="m_color"/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <!--<input id="sceneBackgroundSelector" type="text" name="colorSelect" class="fontSelectorMiniColor fontFormatter form-control minicolor-mini" data-control="hue">-->
        <h5>block id {{m_blockData.blockID}}</h5>
    `,
    styles: [`
        input.ng-invalid {
            border-right: 10px solid red;
        }

        .material-switch {
            position: relative;
            padding-top: 10px;
        }

        .input-group {
            padding-top: 10px;
        }

        i {
            width: 20px;
        }
    `]
})
export class BlockPropCommon extends Compbaser implements AfterViewInit {

    private campaignModel: CampaignsModelExt;
    private formInputs = {};
    private contGroup: FormGroup;
    private campaignModel$: Observable<CampaignsModelExt>;
    private m_blockData: IBlockData;
    private m_viewReady: boolean = false;
    m_color;

    constructor(private fb: FormBuilder, private ngmslibService: NgmslibService, private bs:BlockService, private hp: HelperPepperService, private yp: YellowPepperService, private el: ElementRef) {
        super();
        this.contGroup = fb.group({
            'alpha': [0],
            'border': [0],
            'background': [0]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected().subscribe((campaign: CampaignsModelExt) => {
                this.campaignModel = campaign;
                this.renderFormInputs();
            })
        )
        this.campaignModel$ = this.yp.listenCampaignValueChanged()
    }

    @Input()
    set setBlockData(i_blockData) {
        this.m_blockData = i_blockData;
        this._render();
    }

    ngAfterViewInit() {
        this.m_viewReady = true;
        this._bgGradientInit();
        this._render();
    }

    private _render() {
        if (!this.m_viewReady) return;
        this._alphaPopulate();
        this._bgPropsPopulate();
        this._populateBackgroundCheckbox();
    }

    /**
     On changes in msdb model updated UI common alpha properties
     @method _alphaPopulate
     **/
    _alphaPopulate() {
        var self = this;
        var domPlayerData = self.m_blockData.playerDataDom;
        var data = $(domPlayerData).find('Data').eq(0);
        var xSnippet = $(data).find('Appearance').eq(0);
        var a1: any = $(xSnippet).attr('alpha');
        if (_.isUndefined(a1)) a1 = 1;
        this.formInputs['alpha'].setValue(a1)
    }

    _onAlphaChange(event){
        var domPlayerData = this.m_blockData.playerDataDom;
        var data = $(domPlayerData).find('Data').eq(0);
        var xSnippet = $(data).find('Appearance').eq(0);
        jQuery(xSnippet).attr('alpha', event.target.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    /**
     Toggle block background on UI checkbox selection
     @method _toggleBackgroundColorHandler
     @param {event} e
     **/
    _populateBackgroundCheckbox() {
        // var self = this;
        // var xBgSnippet = undefined;
        // var domPlayerData = self.m_blockData.playerDataDom;
        // var xSnippet = $(domPlayerData).find('Background');
        // console.log(xSnippet);
        // $(xSnippet).remove();
        // self._bgPropsUnpopulate();
        // self._setBlockPlayerData(domPlayerData);
        //var checked = jQuery(e.target).prop('checked') == true ? 1 : 0;
        // if (checked) {
        //     self._enableBgSelection();
        //     xBgSnippet = self.hp.getCommonBackgroundXML();
        //     var data = $(domPlayerData).find('Data').eq(0);
        //     var bgData = $(data).find('Background');
        //     if (bgData.length > 0 && !_.isUndefined(bgData.replace)) { // ie bug workaround
        //         bgData.replace($(xBgSnippet));
        //     } else {
        //         $(data).append($(xBgSnippet));
        //     }
        //     var player_data = pepper.xmlToStringIEfix(domPlayerData);
        //     domPlayerData = $.parseXML(player_data);
        //     self._setBlockPlayerData(domPlayerData, BB.CONSTS.NO_NOTIFICATION);
        //     self._bgPropsPopulate();
        //     //self._announceBlockChanged();
        // } else {
        //     var xSnippet = self._findBackground(domPlayerData);
        //     $(xSnippet).remove();
        //     self._bgPropsUnpopulate();
        //     self._setBlockPlayerData(domPlayerData);
        // }
    }

    /**
     Load jquery gradient component once
     @method _bgGradientInit
     **/
    _bgGradientInit() {
        var self = this;
        var lazyUpdateBgColor = _.debounce(function (points, styles) {
            if (points.length == 0)
                return;
            // BB.comBroker.fire(BB.EVENTS.GRADIENT_COLOR_CHANGED, self, null, {points: points, styles: styles});
        }, 50);

        var gradientColorPickerClosed = function () {
            // log('render gradient');
            // BB.comBroker.fire(BB.EVENTS.GRADIENT_COLOR_CLOSED, self, null);
        };

        jQueryAny('#bgColorGradientSelector', self.el.nativeElement).gradientPicker({
            change: lazyUpdateBgColor,
            closed: gradientColorPickerClosed,
            fillDirection: "90deg"
        });

        // always close gradient color picker on mouseout
        $('.colorpicker').on('mouseleave', function (e) {
            $(document).trigger('mousedown');
            // BB.comBroker.fire(BB.EVENTS.GRADIENT_COLOR_CLOSED, self, self);
        });
    }

    /**
     On changes in msdb model updated UI common gradient background properties
     @method _bgPropsPopulate
     **/
    _bgPropsPopulate() {
        var self = this;
        var gradient = jQuery('#bgColorGradientSelector', self.el.nativeElement).data("gradientPicker-sel");
        // gradient.changeFillDirection("top"); /* change direction future support */
        gradient.removeAllPoints();
        var domPlayerData = self.m_blockData.playerDataDom;
        var xSnippet = self._findGradientPoints(domPlayerData);
        if (xSnippet.length > 0) {
            // self._enableBgSelection();
            var points = $(xSnippet).find('Point');
            $.each(points, function (i, point) {
                var pointColor = Lib.DecimalToHex(jQuery(point).attr('color'));
                var pointMidpoint = (parseInt($(point).attr('midpoint')) / 250);
                gradient.addPoint(pointMidpoint, pointColor, true);
            });
        } else {
            self._bgDisable();
        }
    }

    /**
     Disable the gradient background UI
     @method _bgPropsUnpopulate
     **/
    _bgDisable() {
        var self = this;
        // $(Elements.SHOW_BACKGROUND).prop('checked', false);
        // $(Elements.BG_COLOR_GRADIENT_SELECTOR).hide();
        // $(Elements.BG_COLOR_SOLID_SELECTOR).hide();
        // var domPlayerData = self._getBlockPlayerData();
        // var gradientPoints = self._findGradientPoints(domPlayerData);
        // $(gradientPoints).empty();
    }

    /**
     Find the gradient blocks in player_data for selected block
     @method _findGradientPoints
     @param  {object} i_domPlayerData
     @return {Xml} xSnippet
     **/
    _findGradientPoints(i_domPlayerData) {
        var xSnippet = $(i_domPlayerData).find('GradientPoints');
        return xSnippet;
    }

    @timeout()
    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.contGroup.value.campaign_name);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.contGroup.value.campaign_playlist_mode);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.contGroup.value.kiosk_mode);
        // this.rp.reduxCommit()
    }

    private renderFormInputs() {
        if (!this.campaignModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data = this.campaignModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    destroy() {
        var gradient = jQuery('#bgColorGradientSelector', this.el.nativeElement).data("gradientPicker-sel");
        gradient.destroyed();
    }
}