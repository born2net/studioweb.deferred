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
import {Map, List} from 'immutable';
import {BoardTemplatesModel, BoardTemplateViewersModel} from "../../store/imsdb.interfaces_auto";

@Component({
    selector: 'screen-layout-editor-props',
    //changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    styles: [`
        :host > > > .ui-spinner-input {
            width: 60px;
        }

        .spinLabel {
            display: inline-block;
            width: 70px;
        }
    `],
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
                                    <div class="spinLabel">top:</div>
                                    <input class="numStepper" [formControl]="contGroup.controls['pixel_y']">
                                </li>
                                <li class="list-group-item">
                                    <div class="spinLabel">left:</div>
                                    <input class="numStepper" [formControl]="contGroup.controls['pixel_x']">
                                </li>
                                <li class="list-group-item">
                                    <div class="spinLabel">width:</div>
                                    <input class="numStepper" [formControl]="contGroup.controls['pixel_width']">
                                </li>
                                <li class="list-group-item">
                                    <div class="spinLabel">height:</div>
                                    <input class="numStepper" [formControl]="contGroup.controls['pixel_height']">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    `

})
export class ScreenLayoutEditorProps extends Compbaser {

    private boardTemplateModel: BoardTemplateViewersModel;
    private formInputs = {};
    private contGroup: FormGroup;

    constructor(private fb: FormBuilder, private ngmslibService: NgmslibService, private yp: YellowPepperService, private rp: RedPepperService) {
        super();

        this.contGroup = fb.group({
            'pixel_height': [0],
            'pixel_width': [0],
            'pixel_x': [0],
            'pixel_y': [0]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })


        this.cancelOnDestroy(
            this.yp.listenGlobalBoardSelectedChanged()
                .subscribe((boardTemplateModel:BoardTemplateViewersModel) => {
                    this.boardTemplateModel = boardTemplateModel;
                    this.renderFormInputs();
                })
        )
    }

    @timeout()
    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.contGroup.value.campaign_name);
        this.rp.reduxCommit()
    }

    private renderFormInputs() {
        if (!this.boardTemplateModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            console.log(key,value);
            let data = this.boardTemplateModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    destroy() {
    }
}