import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {BlockService, IBlockData, ISceneData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Once} from "../../decorators/once-decorator";

@Component({
    selector: 'block-prop-position',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    styles: [`
        li {
            padding-top: 3px;
            padding-bottom: 3px;
        }

        form {
            padding: 20px;
        }

        .inliner {
            display: inline-block;
            width: 50px;
        }

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
    `],
    template: `
        <div>
            <form novalidate autocomplete="off" [formGroup]="m_contGroup">
                <div class="row">
                    <div class="inner userGeneral">
                        <div class="row">
                            <div class="inner userGeneral">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <span i18n class="inliner">top</span>
                                        <input type="number" class="numStepper inliner" [formControl]="m_contGroup.controls['pixel_y']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">left</span>
                                        <input type="number" class="numStepper inliner" [formControl]="m_contGroup.controls['pixel_x']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">width</span>
                                        <input type="number" type="number" class="numStepper inliner" [formControl]="m_contGroup.controls['pixel_width']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">height</span>
                                        <input type="number" class="numStepper inliner" [formControl]="m_contGroup.controls['pixel_height']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">angle</span>
                                        <input type="number" class="numStepper inliner" [formControl]="m_contGroup.controls['angle']">
                                    </li>
                                    <li class="list-group-item">
                                        <br/>
                                        <span i18n>locked</span>
                                        <div class="material-switch pull-right">
                                            <input (change)="saveToStore(locked.checked)"
                                                   [formControl]="m_contGroup.controls['locked']"
                                                   id="locked" #locked
                                                   name="locked" type="checkbox"/>
                                            <label for="locked" class="label-primary"></label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `
})
export class BlockPropPosition extends Compbaser {

    private m_formInputs = {};
    private m_contGroup: FormGroup;
    private m_blockData: IBlockData;
    private m_canvasScale = -1;

    constructor(private fb: FormBuilder, private rp: RedPepperService, private yp: YellowPepperService, private bs: BlockService, private cd: ChangeDetectorRef) {
        super();

        this.m_contGroup = fb.group({
            'pixel_y': [0],
            'pixel_x': [0],
            'pixel_width': [0],
            'pixel_height': [0],
            'angle': [0],
            'locked': []
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.m_formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })

        this.cancelOnDestroy(
            //
            this.yp.listenSceneOrBlockSelectedChanged(true)
                .combineLatest(this.yp.listenFabricSceneScaled(), (i_sceneData: ISceneData, i_scale: number) => {
                    this.m_canvasScale = i_scale;
                    return i_sceneData
                })
                .mergeMap((i_sceneData: ISceneData) => {
                    return this.bs.getBlockDataInScene(i_sceneData)
                })
                .subscribe((blockData: IBlockData) => {
                    this.m_blockData = blockData;
                    this.m_formInputs['locked'].setValue(StringJS(blockData.playerDataJson.Player._locked).booleanToNumber());
                    this.m_formInputs['pixel_height'].setValue(blockData.playerDataJson.Player.Data.Layout._height);
                    this.m_formInputs['pixel_width'].setValue(blockData.playerDataJson.Player.Data.Layout._width);
                    this.m_formInputs['pixel_x'].setValue();
                    this.m_formInputs['pixel_y'].setValue(blockData.playerDataJson.Player.Data.Layout._y);
                    this.populateValues(blockData.playerDataJson.Player.Data.Layout._x, blockData.playerDataJson.Player.Data.Layout._y, blockData.playerDataJson.Player.Data.Layout._width,  blockData.playerDataJson.Player.Data.Layout._height)
                    this.cd.markForCheck();
                }, (e) => console.error(e))
        )
    }

    /**
     Update the coordinates of a block in pepper db, don't allow below w/h MIN_SIZE
     **/
    _saveBlockCords(domPlayerData, x, y, w, h, a) {
        var blockMinWidth = 50;
        var blockMinHeight = 50;
        if (h < blockMinHeight)
            h = blockMinHeight;
        if (w < blockMinWidth)
            w = blockMinWidth;
        var layout = $(domPlayerData).find('Layout');
        layout.attr('rotation', parseInt(a));
        layout.attr('x', parseInt(x));
        layout.attr('y', parseInt(y));
        layout.attr('width', parseInt(w));
        layout.attr('height', parseInt(h));
        // var player_data = (new XMLSerializer()).serializeToString(domPlayerData);
    }

    private populateValues(x, y, w, h, a = 0){
        this.m_formInputs['pixel_height'].setValue(h);
        this.m_formInputs['pixel_width'].setValue(w);
        this.m_formInputs['pixel_x'].setValue(x);
        this.m_formInputs['pixel_y'].setValue(y);
        this.m_formInputs['angle'].setValue(a);
    }

    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        var v = this.m_contGroup.value.locked == true ? 1 : 0;
        jXML(domPlayerData).find('Player').attr('locked', v);
        this._saveBlockCords(domPlayerData, this.m_contGroup.value.pixel_x, this.m_contGroup.value.pixel_y, this.m_contGroup.value.pixel_width, this.m_contGroup.value.pixel_height, 1)
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    destroy() {
    }
}
