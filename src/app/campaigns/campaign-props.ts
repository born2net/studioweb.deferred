import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";
import * as _ from "lodash";
import {Compbaser, NgmslibService} from "ng-mslib";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application.state";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'campaign-props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'onFormChange($event)'
    },
    template: `<div>
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
                                        maintain aspect ratio
                                        <div class="material-switch pull-right">
                                            <input (change)="onFormChange(customerNetwork2.checked)"
                                                   [formControl]="contGroup.controls['kiosk_mode']"
                                                   id="customerNetwork2" #customerNetwork2
                                                   name="customerNetwork2" type="checkbox"/>
                                            <label for="customerNetwork2" class="label-primary"></label>
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                                            <input [formControl]="contGroup.controls['campaign_name']" required
                                                   pattern="[0-9]|[a-z]|[A-Z]+"
                                                   type="text" class="form-control" minlength="3" maxlength="15"
                                                   placeholder="campaign name">
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-circle-o-notch"></i></span>
                                            <input type="number" [formControl]="contGroup.controls['campaign_playlist_mode']" min="0"
                                                   class="form-control"
                                                   placeholder="repetitions">
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

    private campaignModel: CampaignsModelExt;

    constructor(private fb: FormBuilder, private store: Store<ApplicationState>, private ngmslibService: NgmslibService, private yellowPepperService: YellowPepperService) {
        super();
        this.contGroup = fb.group({
            'campaign_name': [''],
            'campaign_playlist_mode': [0],
            'kiosk_mode': [0]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })

        this.cancelOnDestroy(
            this.store.select(store => store.appDb.uiState.campaign.campaignSelected).subscribe((i_campaignId) => {
                this.yellowPepperService.findCampaignById(i_campaignId).subscribe((campaign: CampaignsModelExt) => {
                    this.campaignModel = campaign;
                    this.renderFormInputs();
                })
            })
        )
    }


    @Input()
    set setCampaignModel(i_campaignModel) {
        if (i_campaignModel)
            this.renderFormInputs();
    }

    private contGroup: FormGroup;
    private formInputs = {};

    private onFormChange(event) {
        this.updateSore();
    }

    private updateSore() {
        setTimeout(() => {
            console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
            // this.appStore.dispatch(this.adnetAction.saveCustomerInfo(Lib.CleanCharForXml(this.contGroup.value), this.customerModel.customerId()))
        }, 1)
    }

    private renderFormInputs() {
        if (!this.campaignModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data;
            if (key=='kiosk_mode'){
                console.log(key);
                data = this.campaignModel.getKey(key);
                if (data=='True'){
                    data = true;
                } else {
                    data = false;
                }

            } else {
                data = this.campaignModel.getKey(key);
            }

            this.formInputs[key].setValue(data)
        });
    };

    destroy() {
        // this.listeners.unsubscribe();
    }
}

// var campaign1$ = this.yellowpepperService.findCampaignObs(0)
// var campaign2$ = this.yellowpepperService.findCampaignObs(1)
// var campaign3$ = this.yellowpepperService.findCampaignObs(1)
// campaign1$.concatMap((x: CampaignsModelExt) => {
//     return campaign2$;
// }, (a: CampaignsModelExt, b: CampaignsModelExt) => {
//     return a;
// }).concatMap((campaignsModel: CampaignsModelExt) => {
//     return this.yellowpepperService.findCampaignObs(campaignsModel.getCampaignId())
// }, (c: CampaignsModelExt, d: CampaignsModelExt) => {
//     console.log(c, d);
//     return d;
// }).concatMap((campaignsModel: CampaignsModelExt) => this.yellowpepperService.findCampaignObs(campaignsModel.getCampaignId()), (e: CampaignsModelExt, f: CampaignsModelExt) => {
//     console.log(e, f);
//     return e
// }).take(1).subscribe((g: CampaignsModelExt) => {
//     console.log(g);
// })

// private findCampaignObs(i_campaignId: number): Observable<CampaignsModelExt> {
//     return this.store.select(store => store.msDatabase.sdk.table_campaigns)
//         .take(1)
//         .map((i_campaigns: List<CampaignsModelExt>) => {
//             console.log('look up campaign ' + i_campaignId);
//             return i_campaigns.find((i_campaign: CampaignsModelExt) => {
//                 var id = i_campaign.getCampaignId();
//                 return id == i_campaignId;
//             });
//         });
// }

// private findCampaign(i_campaignId: number) {
//     let v;
//     this.store.select(store => store.msDatabase.sdk.table_campaigns).take(1).subscribe((i_campaigns: List<CampaignsModelExt>) => {
//         console.log('look up campaign ' + i_campaignId);
//         v = i_campaigns.find((i_campaign: CampaignsModelExt) => {
//             var id = i_campaign.getCampaignId();
//             return id == i_campaignId;
//         })
//     })
//     return v;
// }


// this.cancelOnDestroy(
//     this.yellowpepperService.findCampaignObsConcatTest(0).subscribe((camp:CampaignsModelExt)=>{
//         console.log(camp);
//     })
// )