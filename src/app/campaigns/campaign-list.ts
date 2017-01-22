import {Component, ChangeDetectionStrategy, ViewChild, trigger, transition, animate, state, style, ElementRef} from "@angular/core";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {List} from "immutable";
import {Compbaser} from "ng-mslib";
import {Router} from "@angular/router";
import {EFFECT_RENAME_CAMPAIGN, EFFECT_REMOVE_CAMPAIGN, EFFECT_CREATE_CAMPAIGN_BOARD} from "../../store/effects/msdb.effects";
import {UserModel} from "../../models/UserModel";
import {CampaignsModal, ResourcesModal} from "../../store/imsdb.interfaces_auto";
import {RedPepperService} from "../../services/redpepper.service";
import {CampaignsModalExt} from "../../store/model/msdb-models-extended";

@Component({
    selector: 'campaign-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './campaign-list.html'
})

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaign-list',
    styles: [`
        .ui-orderlist {width: 400px;}
        .ui-orderlist-list {width: 400px;}
    `],
    templateUrl: './campaign-list.html'
})
export class CampaignList extends Compbaser {

    public campaigns$: Observable<List<CampaignsModalExt>>;
    public userModel$: Observable<UserModel>;
    cars;

    constructor(private el: ElementRef, private store: Store<ApplicationState>, private redPepperService: RedPepperService, private router: Router) {
        super();


        this.store.select(store => store.msDatabase.participants[0].a.c).map((v) => {
            console.log(v);
        }).subscribe((e) => {
        });
        setTimeout(() => {
            this.store.dispatch(({type: 'AAA'}))
        }, 500)
        this.userModel$ = this.store.select(store => store.appDb.userModel);
        this.campaigns$ = this.store.select(store => store.msDatabase.sdk.table_campaigns).map((list: List<CampaignsModal>) => {
            this.cars = list;//.toArray();
            console.log(this.cars.length);
            return list.filter((campaignModel: CampaignsModal) => {
                if (campaignModel.getCampaignName().indexOf('bla_bla') > -1)
                    return false
                return true;
            })
        });
        this.store.select(store => store.msDatabase.sdk.table_resources).subscribe((resourceModels: List<ResourcesModal>) => {
            console.log(resourceModels.first().getResourceName());
            console.log(resourceModels.first().getResourceBytesTotal());
        })
    }


    onRoute1() {
        this.router.navigate(['/App1/Campaigns'])
    }

    onRoute2() {
        this.router.navigate(['/App1/Fasterq'])
    }

    onRoute3() {
        this.router.navigate(['/App1/Resources'])
    }

    onRoute4() {
        this.router.navigate(['/App1/Settings'])
    }

    onRoute5() {
        this.router.navigate(['/App1/Stations'])
    }

    onRoute6() {
        this.router.navigate(['/App1/StudioPro'])
    }

    _removeCampaign(campaign: CampaignsModal) {
        this.store.dispatch({type: EFFECT_REMOVE_CAMPAIGN, payload: campaign})
    }

    private renameCampaign(campaign, newName) {
        this.store.dispatch({type: EFFECT_RENAME_CAMPAIGN, payload: {campaign: campaign, newName: newName}})
    }

    private save() {
        console.log('saving...');
        this.redPepperService.save((result) => {
            alert('saved');
            console.log(result);
        });
    }

    private createCampaign() {
        this.store.dispatch({type: EFFECT_CREATE_CAMPAIGN_BOARD});
    }

    destroy() {
    }
}















