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

@Component({
    selector: 'campaign-sched-props',
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
                            <!--<ul class="list-group">-->
                                <!--<li class="list-group-item">-->
                                    <!--kiosk mode-->
                                    <!--<div class="material-switch pull-right">-->
                                        <!--<input (change)="saveToStore(customerNetwork2.checked)"-->
                                               <!--[formControl]="contGroup.controls['kiosk_mode']"-->
                                               <!--id="customerNetwork2" #customerNetwork2-->
                                               <!--name="customerNetwork2" type="checkbox"/>-->
                                        <!--<label for="customerNetwork2" class="label-primary"></label>-->
                                    <!--</div>-->
                                <!--</li>-->
                                <!--<li class="list-group-item">-->
                                    <!--<div class="input-group">-->
                                        <!--<span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>-->
                                        <!--<input [formControl]="contGroup.controls['campaign_name']" required-->
                                               <!--pattern="[0-9]|[a-z]|[A-Z]+"-->
                                               <!--type="text" class="form-control" minlength="3" maxlength="15"-->
                                               <!--placeholder="campaign name">-->
                                    <!--</div>-->
                                <!--</li>-->
                                <!--<li class="list-group-item">-->
                                    <!--<div class="input-group">-->
                                        <!--<span class="input-group-addon"><i class="fa fa-key"></i></span>-->
                                        <!--<input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"-->
                                               <!--class="form-control"-->
                                               <!--placeholder="access key">-->
                                    <!--</div>-->
                                <!--</li>-->
                            <!--</ul>-->
                        </div>
                    </div>
                </div>


                <div id="schedulerContainer" class="schedulerClass">
                    <div class="bs-example">
                        <div style="height: 200px" id="schedulerRepeatMode" class="carousel slide" data-interval="false" data-ride="carousel">
                            <div class="carousel-inner">
                                <div class="active item">
                                    <div align="center">
                                        <h4 i18n>play once</h4>
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                        <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                               class="form-control"
                                               placeholder="access key">
                                    </div>
                                    
                                    <!--<span i18n startDate">Start date:</span>-->
                                    <!--<input id="datepickerSchedulerOnce" name="start_date" class="datepickerScheduler" type="text" type="text">-->
                                </div>
                                <div class="item">
                                    <div align="center">
                                        <h4 i18n>play daily</h4>
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                        <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                               class="form-control"
                                               placeholder="start date">
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                        <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                               class="form-control"
                                               placeholder="end date">
                                    </div>
                                    
                                    <!--<span i18n startDate">Start date:</span>-->
                                    <!--<input id="datepickerSchedulerDailyStart" name="start_date" class="datepickerScheduler" type="text" type="text">-->
                                    <!--<span i18n endDate">End date:</span>-->
                                    <!--<input id="datepickerSchedulerDailyEnd" name="end_date" class="datepicker-dropdown datepickerScheduler" type="text" type="text">-->
                                </div>
                                <div class="item">
                                    <div align="center">
                                        <h4 i18n>play weekly</h4>
                                    </div>

                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                        <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                               class="form-control"
                                               placeholder="start date">
                                    </div>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                        <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                               class="form-control"
                                               placeholder="end date">
                                    </div>
                                    
                                    <!--<span data-target="startDate">Start date:</span>-->
                                    <!--<input id="datepickerSchedulerWeekStart" name="start_date" class="datepickerScheduler" type="text" type="text">-->
                                    <!--<span i18n endDate">End date:</span>-->
                                    <!--<input id="datepickerSchedulerWeekEnd" name="end_date" class="datepickerScheduler" type="text" type="text">-->

                                    <div>
                                        <br/>
                                        <span i18n>Select the days:</span>

                                        <div style="padding-left: 10px">
                                            <table id="scheduledDays" border="0" width="100%" cellspacing="0" cellpadding="0" align="left">
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay" type="checkbox" value="7"><span i18n>Sunday</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay"  type="checkbox" value="2"><span i18n>Monday</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay" type="checkbox" value="3"><span i18n>Tuesday</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay" type="checkbox" value="4"><span i18n>Wednesday</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay" type="checkbox" value="5"><span i18n>Thursday</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay" type="checkbox" value="6"><span i18n>Friday</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input class="scheduleDay" type="checkbox" value="7"><span i18n>Saturday</span>
                                                    </td>
                                                </tr>                                                
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a class="carousel-control left" href="#schedulerRepeatMode" data-slide="prev">
                                <span class="glyphicon glyphicon-chevron-left"></span>
                            </a>
                            <a class="carousel-control right" href="#schedulerRepeatMode" data-slide="next">
                                <span class="glyphicon glyphicon-chevron-right"></span>
                            </a>
                        </div>
                    </div>

                </div>

            </form>
        </div>

    `,
    styles: [`
        .carousel-control.left, .carousel-control.right {
            background-image: none;

        }

        .carousel-control.left span, .carousel-control.right span {
            background-image: none;
            color: gray;
            font-size: 0.8em;
        }

        .carousel-control.left {
            position: absolute;
            left: -15px;
            top: -160px;

        }

        .carousel-control.right {
            position: absolute;
            top: -160px;
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
    `]
})
export class CampaignSchedProps extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private formInputs = {};
    private contGroup: FormGroup;
    private campaignModel$: Observable<CampaignsModelExt>;

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
    set setCampaignModel(i_campaignModel) {
        if (i_campaignModel)
            this.renderFormInputs();
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




