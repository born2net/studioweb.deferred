import {Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {Observable} from "rxjs";
import {List} from "immutable";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";

@Component({
    selector: 'campaign-props',
    host: {
        '(input-blur)': 'listenUpdatedFormBlur($event)'
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
                                <li class="list-group-item">
                                    <span i18n>campaign id: </span>
                                    {{campaignModel?.getCampaignId()}}
                                </li>
                                <li class="list-group-item">
                                    <span i18n>kiosk mode</span>
                                    <div class="material-switch pull-right">
                                        <input (change)="listenUpdatedFormBlur(customerNetwork2.checked)"
                                               [formControl]="m_contGroup.controls['kiosk_mode']"
                                               id="customerNetwork2" #customerNetwork2
                                               name="customerNetwork2" type="checkbox"/>
                                        <label for="customerNetwork2" class="label-primary"></label>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                        <input [formControl]="m_contGroup.controls['campaign_name']" required
                                               pattern="[0-9]|[a-z]|[A-Z]+"
                                               type="text" class="form-control" minlength="3" maxlength="15"
                                               placeholder="campaign name">
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <span i18n id="campaignModeLabel">Campaign playback mode:</span>
                                    <div class="row paddingCeilingFloor20">
                                        <div class="center-block" style="width: 240px">
                                            <button type="button" (click)="_onChangePlaylistMode('0')"
                                                    [ngClass]="{faded: ((campaignModel$ | async)?.getCampaignPlaylistMode() == 1)}"
                                                    class="campaignPlayMode btn btn-default">
                                                <span class="fa fa-repeat"></span>
                                            </button>
                                            <button type="button" (click)="_onChangePlaylistMode('1')"
                                                    [ngClass]="{faded: ((campaignModel$ | async)?.getCampaignPlaylistMode() == 0)}"
                                                    class="campaignPlayMode btn btn-default">
                                                <span class="fa fa-calendar"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div *ngIf="(campaignModel$ | async)?.getCampaignPlaylistMode() == 0">
                                        <p i18n>Sequencer (simple mode):</p>
                                        <p i18n>Play timelines for this campaign in a continuous loop. It is easy to setup and simple to use</p>
                                    </div>
                                    <div *ngIf="(campaignModel$ | async)?.getCampaignPlaylistMode() == 1">
                                        <p i18n>Scheduler (advanced mode): </p>
                                        <p i18n>Play timelines for this campaign only on specific times. For example, play Timeline A in the morning and Timeline B at night.</p>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <div class="center-block row paddingCeilingFloor20" style="width: 144px">
                                        <button (click)="removeCampaign()" class="btn btn-danger">
                                            <i class="fa fa-remove"></i>
                                            delete campaign
                                        </button>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .faded {
            opacity: 0.4;
        }

        .campaignPlayMode {
            font-size: 4em;
            width: 118px;
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
export class CampaignProps extends Compbaser {

    /**
     * In this example we demonstrate two ways we can bind to the store values:
     *
     * 1. campaignModel$ via Observable subscription using async into the template: [ngClass]="{faded: ((campaignModel$ | async)?.getCampaignPlaylistMode() == 1)}" ...
     * 2. campaignModel direct grabbing the campaignModel from the store and doing a loop over keys: _.forEach(this.formInputs, (value, key: string) => { ...
     *
     * We also demoing here two ways of upding store:
     * 1. reacting to input changes both via blur
     * 2. reacting to the Observable of statusChanges
     **/

    private campaignModel: CampaignsModelExt;
    private campaignModel$: Observable<CampaignsModelExt>;
    private formInputs = {};
    private m_contGroup: FormGroup;

    constructor(private fb: FormBuilder, private ngmslibService: NgmslibService, private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.m_contGroup = fb.group({
            'campaign_name': [''],
            'campaign_playlist_mode': [0],
            'kiosk_mode': [0]
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })

        // example 1: subscribe to store slice via subscription and and set to local member campaignModel
        this.cancelOnDestroy(
            this.yp.listenCampaignSelected()
                .subscribe((campaign: CampaignsModelExt) => {
                    this.campaignModel = campaign;
                    this.renderFormInputsManual();
                    this.renderFormInputsReactive();
                })
        );

        // example 2: hook to store slice observable and pipe to async in template
        var campaignIdSelected$ = this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.campaignSelected)
        var campaigns$ = this.yp.ngrxStore.select(store => store.msDatabase.sdk.table_campaigns);
        this.campaignModel$ = campaignIdSelected$.combineLatest(campaigns$, (campaignId: number, campaigns: List<CampaignsModelExt>) => {
            return campaigns.find((i_campaign: CampaignsModelExt) => {
                return i_campaign.getCampaignId() == campaignId;
            });
        });

        this.listenUpdatedFormReactive();
    }

    @Input()
    set setCampaignModel(i_campaignModel) {
        if (i_campaignModel)
            this.renderFormInputsManual();
    }

    _onChangePlaylistMode(mode: string) {
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', mode);
        this.rp.reduxCommit();
    }

    // example 1 on input update via manually for looping
    private renderFormInputsManual() {
        if (!this.campaignModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data = this.campaignModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    // example 2 on input update via observable and patch value
    private renderFormInputsReactive() {
        this.cancelOnDestroy(
            this.yp.listenCampaignSelected()
                .subscribe((i_campaignModel: CampaignsModelExt) => {
                    this.campaignModel = i_campaignModel;
                    var bb = this.campaignModel.toPureJs();
                    // this.m_contGroup.patchValue(bb);
                })
        );
    };

    // example on changes 1 blur
    private listenUpdatedFormBlur(event) {
        this.saveToStore();
    }

    // example 2 on changes observable
    private listenUpdatedFormReactive() {
        this.cancelOnDestroy(
            this.m_contGroup.statusChanges
                .filter(valid => valid === 'VALID')
                .withLatestFrom(this.m_contGroup.valueChanges, (valid, value) => value)
                .debounceTime(100)
                .subscribe(value => {
                    // console.log('res ' + JSON.stringify(value) + ' ' + Math.random())
                    this.saveToStore();
                })
        )
    }

    @timeout()
    private saveToStore() {
        // console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.m_contGroup.value.campaign_name);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.m_contGroup.value.campaign_playlist_mode);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.m_contGroup.value.kiosk_mode);
        this.rp.reduxCommit()
    }

    private removeCampaign() {
        bootbox.confirm({
            message: "Are you sure you want to delete the campaign, there is NO WAY BACK?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: (result) => {
                if (result) {
                    var campaignId = this.campaignModel.getCampaignId();
                    this.rp.removeCampaignKeepBoards(campaignId);
                    this.rp.reduxCommit();
                    var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
                    this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
                }
            }
        });
    }

    destroy() {
    }
}

