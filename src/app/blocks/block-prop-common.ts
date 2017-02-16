import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import {Observable} from "rxjs";
import {simpleRegExp} from "../../Lib";
import * as _ from "lodash";
import {IBlockData} from "./block-service";

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
                                    Alpha
                                    <input id="slider1" type="range" min="100" max="500" step="10"/>
                                </li>
                                <li class="list-group-item">
                                    <input id="sceneBorderColorSelector" type="text" name="colorSelect" class="fontSelectorMiniColor fontFormatter form-control minicolor-mini" data-control="hue">
                                </li>
                                <li class="list-group-item">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                        <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                               class="form-control"
                                               placeholder="access key">
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <input [(colorPicker)]="m_color" [cpPosition]="'bottom'" [style.background]="m_color" [value]="m_color"/>
        <hr/>
        <div id="bgColorGradientSelector"></div>
        <input id="sceneBackgroundSelector" type="text" name="colorSelect" class="fontSelectorMiniColor fontFormatter form-control minicolor-mini" data-control="hue">
        <hr/>
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
export class BlockPropCommon extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private formInputs = {};
    private contGroup: FormGroup;
    private campaignModel$: Observable<CampaignsModelExt>;
    private m_blockData: IBlockData;
    m_color;


    constructor(private fb: FormBuilder, private ngmslibService: NgmslibService, private yp: YellowPepperService, private rp: RedPepperService) {
        super();

        this.contGroup = fb.group({
            'campaign_name': ['', [Validators.required, Validators.pattern(simpleRegExp)]],
            'campaign_playlist_mode': [0],
            'kiosk_mode': [0]
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

    ngAfterViewInit() {
        this._bgGradientInit();
        this._bgSceneInit();
        this._bgFasterQColorInit();
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
            // BB.comBroker.fire(BB.EVENTS.GRADIENT_COLOR_CLOSED, self, null);
        };

        $('#bgColorGradientSelector').gradientPicker({
            change: lazyUpdateBgColor,
            closed: gradientColorPickerClosed,
            fillDirection: "90deg"
        });

        // always close gradient color picker on mouseout
        $('.colorpicker').on('mouseleave', function (e) {
            $(document).trigger('mousedown');
            // BB.comBroker.fire(BB.EVENTS.GRADIENT_COLOR_CLOSED, self, self);
        });

        // to destroy the plugin instance
        // gradient = {}; $(Elements.BG_COLOR_GRADIENT_SELECTOR).remove();
    }

    /**
     Init the scene background selector
     @method _bgSceneInit
     **/
    _bgSceneInit() {
        var self = this;
        var colorSettings = {
            animationSpeed: 50,
            animationEasing: 'swing',
            change: $.proxy(self._onSceneBgColorSelected, self),
            changeDelay: 100,
            control: 'hue',
            value: '#ffffff',
            defaultValue: '#428bca',
            show: $.proxy(self._onSceneColorToggle, self),
            hide: $.proxy(self._onSceneColorToggle, self),
            hideSpeed: 100,
            inline: false,
            letterCase: 'lowercase',
            opacity: false,
            position: 'bottom left',
            showSpeed: 100,
            theme: 'bootstrap'
        };
        $('#sceneBackgroundSelector').minicolors(colorSettings);
    }

    /**
     Init the fasterq background color selector
     @method _bgFasterQColorInit
     **/
    _bgFasterQColorInit() {
        var self = this;
        // show: $.proxy(self._onSceneColorToggle, self),
        // hide: $.proxy(self._onSceneColorToggle, self),
        var colorSettings = {
            animationSpeed: 50,
            animationEasing: 'swing',
            change: $.proxy(self._onFasterQBgColorSelected, self),
            changeDelay: 100,
            control: 'hue',
            value: '#ffffff',
            defaultValue: '#428bca',
            hideSpeed: 100,
            inline: false,
            letterCase: 'lowercase',
            opacity: false,
            position: 'bottom left',
            showSpeed: 100,
            theme: 'bootstrap'
        };
        // $(Elements.FASTERQ_BLOCK_COLOR_SELECTOR).minicolors(colorSettings);
    }

    /**
     Init the scene backgroud selector
     @method _bgSceneInit
     **/
    _borderSceneColorInit() {
        var self = this;
        var colorSettings = {
            animationSpeed: 50,
            animationEasing: 'swing',
            change: $.proxy(self._onSceneBorderColorSelected, self),
            changeDelay: 100,
            control: 'hue',
            value: '#ffffff',
            defaultValue: '#428bca',
            show: $.proxy(self._onSceneColorToggle, self),
            hide: $.proxy(self._onSceneColorToggle, self),
            hideSpeed: 100,
            inline: false,
            letterCase: 'lowercase',
            opacity: false,
            position: 'bottom left',
            showSpeed: 100,
            theme: 'bootstrap'
        };
        $('#sceneBorderColorSelector').minicolors(colorSettings);
    }

    /**
     On fasterQ background color selected by minicolors
     @method _onFasterQBgColorSelected
     @param {String} i_color
     **/
    _onFasterQBgColorSelected(i_color) {
        var self = this;
        // BB.comBroker.fire(BB.EVENTS.FASTERQ_BG_COLOR_CHANGE, self, self, i_color);
    }

    /**
     On scene block border color selected by minicolors
     @method _onSceneBorderColorSelected
     @param {String} i_color
     **/
    _onSceneBorderColorSelected(i_color) {
        var self = this;
        // if (self.m_showBorderOn)
        // BB.comBroker.fire(BB.EVENTS.BLOCK_BORDER_CHANGE, self, self, i_color);
    }

    _onSceneColorToggle(e) {
        var self = this;
        // if (self.m_showBorderOn) {
        //     self.m_showBorderOn = undefined;
        // } else {
        //     self.m_showBorderOn = 1;
        // }
    }

    /**
     On scene background color selected by minicolors
     @method _onSceneBgColorSelected
     @param {String} i_color
     **/
    _onSceneBgColorSelected(i_color) {
        var self = this;
        // BB.comBroker.fire(BB.EVENTS.SCENE_BG_COLOR_CHANGED, self, self, i_color);
    }

    @Input()
    set setBlockData(i_blockData) {
        this.m_blockData = i_blockData;
    }

    @timeout()
    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.contGroup.value.campaign_name);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.contGroup.value.campaign_playlist_mode);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.contGroup.value.kiosk_mode);
        this.rp.reduxCommit()
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
    }
}