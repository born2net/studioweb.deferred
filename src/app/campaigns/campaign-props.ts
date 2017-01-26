import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";

@Component({
    selector: 'campaign-props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'onFormChange($event)'
    },
    template: `<div>
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
                                        kiosk mode
                                        <div class="material-switch pull-right">
                                            <input (change)="onFormChange(customerNetwork2.checked)"
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
                                        <div class="input-group">
                                            <span class="input-group-addon"><i class="fa fa-key"></i></span>
                                            <input type="number" [formControl]="m_contGroup.controls['campaign_playlist_mode']" min="0"
                                                   class="form-control"
                                                   placeholder="access key">
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>
                <button (click)="removeCampaign()"  class="btn">delete campaign</button>
            </div>
    `,
    styles: [`
        input.ng-invalid { border-right: 10px solid red;  }
        .material-switch {  position: relative; padding-top: 10px; }
        .input-group { padding-top: 10px; } 
        i { width: 20px; }
    `]
})
export class CampaignProps extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private formInputs = {};
    m_contGroup: FormGroup;

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

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected().subscribe((campaign:CampaignsModelExt)=>{
                this.campaignModel = campaign;
                this.renderFormInputs();
            })
        )
    }

    @Input()
    set setCampaignModel(i_campaignModel) {
        if (i_campaignModel)
            this.renderFormInputs();
    }

    private onFormChange(event) {
        this.updateSore();
    }

    @timeout()
    private updateSore() {
        console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.m_contGroup.value.campaign_name);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.m_contGroup.value.campaign_playlist_mode);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.m_contGroup.value.kiosk_mode);
        this.rp.reduxCommit()
    }

    private removeCampaign(){
        var campaignId = this.campaignModel.getCampaignId();
        this.rp.removeCampaignKeepBoards(campaignId);
        this.rp.reduxCommit();
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













// this.cancelOnDestroy(
//     this.yp.listenCampaignSelected().subscribe((i_campaignId) => {
//         this.yp.findCampaignByIdTest(i_campaignId).one((campaign: CampaignsModelExt) => {
//             this.campaignModel = campaign;
//             this.renderFormInputs();
//         })
//     })
// )
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
// import {Subscriber} from "rxjs";
// private listeners: Subscriber<any> = new Subscriber();
// this.listeners.add(
//     this.yp.listenCampaignSelected().subscribe((i_campaignId) => {
//
//         this.yp.findCampaignByIdTest(i_campaignId).subscribe((campaign: CampaignsModelExt) => {
//             this.campaignModel = campaign;
//             this.renderFormInputs();
//         })
//
//         this.yp.findCampaignByIdTest(i_campaignId).subscribe((campaign: CampaignsModelExt) => {
//             this.campaignModel = campaign;
//             this.renderFormInputs();
//         })
//
//         this.yp.findCampaignByIdTest(i_campaignId).subscribe((campaign: CampaignsModelExt) => {
//             this.campaignModel = campaign;
//             this.renderFormInputs();
//         })
//     })
// )
// destroy() {
//     // this.listeners.unsubscribe();
// }