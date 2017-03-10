import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {BlockService, ISceneData} from "./block-service";

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
            <form novalidate autocomplete="off" [formGroup]="contGroup">
                <div class="row">
                    <div class="inner userGeneral">
                        <div class="row">
                            <div class="inner userGeneral">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <span i18n class="inliner">top</span>
                                        <input (change)="_saveToStore()" type="number" class="numStepper inliner" [formControl]="contGroup.controls['pixel_y']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">left</span>
                                        <input (change)="_saveToStore()" type="number" class="numStepper inliner" [formControl]="contGroup.controls['pixel_x']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">width</span>
                                        <input (change)="_saveToStore()" type="number" type="number" class="numStepper inliner" [formControl]="contGroup.controls['pixel_width']">
                                    </li>
                                    <li class="list-group-item">
                                        <span i18n class="inliner">height</span>
                                        <input (change)="_saveToStore()" type="number" class="numStepper inliner" [formControl]="contGroup.controls['pixel_height']">
                                    </li>
                                    <li class="list-group-item">
                                        <br/>
                                        <span i18n>unlocked</span>
                                        <div class="material-switch pull-right">
                                            <input (change)="saveToStore(locked.checked)"
                                                   [formControl]="contGroup.controls['locked']"
                                                   id="locked" #locked
                                                   name="locked" type="checkbox"/>
                                            <label for="locked" class="label-primary"></label>
                                        </div>
                                    </li>
                                    <br/>
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

    private formInputs = {};
    private contGroup: FormGroup;

    constructor(private fb: FormBuilder, private yp: YellowPepperService, private bs: BlockService, private cd: ChangeDetectorRef) {
        super();

        this.contGroup = fb.group({
            'pixel_y': [0],
            'pixel_x': [0],
            'pixel_width': [0],
            'pixel_height': [0],
            'locked': []
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })

        this.cancelOnDestroy(
            //
            this.yp.listenSceneOrBlockSelectedChanged(true)
                .subscribe((i_sceneData: ISceneData) => {
                    this.formInputs['pixel_height'].setValue(i_sceneData.domPlayerDataJson.Player.Data.Layout._height)
                    this.formInputs['pixel_width'].setValue(i_sceneData.domPlayerDataJson.Player.Data.Layout._width)
                    this.formInputs['pixel_x'].setValue(i_sceneData.domPlayerDataJson.Player.Data.Layout._x)
                    this.formInputs['pixel_y'].setValue(i_sceneData.domPlayerDataJson.Player.Data.Layout._y)
                    this.formInputs['locked'].setValue(i_sceneData.domPlayerDataJson.Player._label)
                    this.cd.markForCheck();
                }, (e) => console.error(e))
        )

        // this.cancelOnDestroy(
        //     //
        //     this.yp.listenSceneOrBlockSelectedChanged(true)
        //         .mergeMap((i_sceneData: ISceneData) => {
        //             return this.bs.getBlockDataInScene(i_sceneData)
        //         })
        //         .subscribe((blockData: IBlockData) => {
        //
        //             var a = $(blockData.playerDataDom).attr('locked');
        //             this.formInputs['pixel_height'].setValue(blockData.playerDataJson.Player.Data.Layout._height)
        //             this.formInputs['pixel_width'].setValue(blockData.playerDataJson.Player.Data.Layout._width)
        //             this.formInputs['pixel_x'].setValue(blockData.playerDataJson.Player.Data.Layout._x)
        //             this.formInputs['pixel_y'].setValue(blockData.playerDataJson.Player.Data.Layout._y)
        //             this.cd.markForCheck();
        //         }, (e) => console.error(e))
        // )

    }

    @timeout()
    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        // if (this.contGroup.status != 'VALID')
        //     return;
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.contGroup.value.campaign_name);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.contGroup.value.campaign_playlist_mode);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.contGroup.value.kiosk_mode);
        // this.rp.reduxCommit()
    }

    private renderFormInputs() {
        // _.forEach(this.formInputs, (value, key: string) => {
        // data = StringJS(data).booleanToNumber();
        // this.formInputs[key].setValue(data)
        // });
    };

    destroy() {
    }
}

