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
                                    kiosk mode
                                    <div class="material-switch pull-right">
                                        <input (change)="saveToStore(customerNetwork2.checked)"
                                               [formControl]="contGroup.controls['kiosk_mode']"
                                               id="customerNetwork2" #customerNetwork2
                                               name="customerNetwork2" type="checkbox"/>
                                        <label for="customerNetwork2" class="label-primary"></label>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                        <input [formControl]="contGroup.controls['campaign_name']" required
                                               pattern="[0-9]|[a-z]|[A-Z]+"
                                               type="text" class="form-control" minlength="3" maxlength="15"
                                               placeholder="campaign name">
                                    </div>
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
        <h5>block id {{m_blockId}}</h5>

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
    private m_blockId:number;
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


    @Input()
    set setBlockId(i_blockId) {
        this.m_blockId = i_blockId;
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