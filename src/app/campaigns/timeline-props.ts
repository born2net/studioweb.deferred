import {ChangeDetectionStrategy, Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";
import {Observable} from "rxjs";

@Component({
    selector: 'timeline-props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'onFormChange($event)'
    },
    template: `
        <div>
            <form novalidate autocomplete="off" [formGroup]="m_contGroup">
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
                                <!--<li class="list-group-item">-->
                                <!--Timeline duration:-->
                                <!--<h3>{{m_totalDuration$ | async }}</h3>-->
                                <!--</li>-->
                                <li class="list-group-item">
                                    Play mode: <i class="fa fa-plus"></i>

                                    <input type="text" [formControl]="m_contGroup.controls['timeline_name']"/>

                                </li>
                                <!--<label>{{(m_timelineSelected$ | async).getTimelineName()}}</label>-->
                                <!--<label>{{(m_timelineSelected$ | async).getTimelineName()}}</label>-->
                                <li class="list-group-item">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                        <!--<input [formControl]="m_contGroup.controls['campaign_name']" required-->
                                        <!--pattern="[0-9]|[a-z]|[A-Z]+"-->
                                        <!--type="text" class="form-control" minlength="3" maxlength="15"-->
                                        <!--placeholder="timeline name">-->
                                    </div>
                                    <br/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
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
export class TimelineProps extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private formInputs = {};
    // private duration: string = '00:00:00'
    private m_contGroup: FormGroup;
    private m_totalDuration$: Observable<string>;
    // private m_timelineSelected$: Observable<CampaignTimelinesModel>;

    constructor(private fb: FormBuilder, private ngmslibService: NgmslibService, private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.m_contGroup = fb.group({
            'campaign_name': [''],
            'timeline_name': ['']
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })

        this.renderFormInputsReactive();

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected()
                .subscribe((campaign: CampaignsModelExt) => {
                    this.campaignModel = campaign;
                    // this.renderFormInputs();
                })
        )

        this.m_totalDuration$ = this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected)
            .switchMap((i_campaignId: number) => {
                return this.yp.getTimelineTotalDuration(i_campaignId)
            })

        this.listenUpdatedForm();

        //this.m_timelineSelected$ = this.yp.getTimeline()
        // this.m_timelineSelected$ = this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected)

        this.cancelOnDestroy(
            this.yp.listenTimelineSelected()
                .subscribe((timeline: CampaignTimelinesModel) => {
                    console.log(timeline);
                })
        );

    }

    // @Input()
    // set setCampaignModel(i_campaignModel) {
    //     if (i_campaignModel)
    //         this.renderFormInputs();
    // }

    private onFormChange(event) {
        this.updateSore();
    }

    private listenUpdatedForm() {
        this.cancelOnDestroy(
            this.m_contGroup.statusChanges
                .filter(valid => valid === 'VALID')
                .withLatestFrom(this.m_contGroup.valueChanges, (valid, value) => value)
                .debounceTime(1000)
                .subscribe(value => {
                    console.log('res ' + JSON.stringify(value) + ' ' + Math.random())
                })
        )
    }

    @timeout()
    private updateSore() {
        console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.m_contGroup.value.campaign_name);
        this.rp.reduxCommit()
    }

    private renderFormInputsReactive() {
        this.cancelOnDestroy(
            this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected)
                .switchMap((i_timelineId: number) => {
                    return this.yp.getTimeline(i_timelineId)
                }).subscribe((v: CampaignTimelinesModel) => {
                var bb = v.toPureJs();
                this.m_contGroup.patchValue(bb);
            })
        )
    };

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
