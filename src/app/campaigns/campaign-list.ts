import {Component, ChangeDetectionStrategy, ElementRef, Input} from "@angular/core";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {List} from "immutable";
import {Compbaser} from "ng-mslib";
import {Router} from "@angular/router";
import {EFFECT_RENAME_CAMPAIGN, EFFECT_REMOVE_CAMPAIGN, EFFECT_CREATE_CAMPAIGN_BOARD} from "../../store/effects/msdb.effects";
import {UserModel} from "../../models/UserModel";
import {ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {RedPepperService} from "../../services/redpepper.service";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {UiUserFocusItemEnum} from "../../comps/props/props";


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'test-comp',
    template: '<h3>campaign id selected: {{m_val}}</h3>'
})
export class TestComp extends Compbaser {
    m_val;

    @Input()
    set val(i_val) {
        this.m_val = i_val;
    }
}


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaign-list',
    styles: [`
        /*.selectedItem {*/
             /*background-color: green !important*/
         /*}*/
         /*a.list-group-item:focus,  button.list-group-item:focus  {*/
            /*background-color: pink !important;*/
        /*}*/

    `],
    templateUrl: './campaign-list.html'
})
export class CampaignList extends Compbaser {

    public campaigns$: Observable<List<CampaignsModelExt>>;
    public userModel$: Observable<UserModel>;
    public timelineSelected$: Observable<number>;
    cars;

    constructor(private el: ElementRef, private store: Store<ApplicationState>, private redPepperService: RedPepperService, private router: Router) {
        super();


        this.store.select(store => store.appDb.uiState.campaign).map((v) => {
            console.log(v);
        }).subscribe((e) => {
        });

        this.timelineSelected$ = this.store.select(store => store.appDb.uiState.campaign.timelineSelected).map(v => v);

        this.store.select(store => store.appDb.uiState.campaign.campaignSelected).map((v) => {
            console.log(v);
        }).subscribe((e) => {
        });
        setTimeout(() => {
            this.store.dispatch(({type: 'ALL'}))
        }, 1000)

        // setTimeout(() => {
        //     this.store.dispatch(({type: 'CAMP'}))
        // }, 2000)

        setTimeout(() => {
            this.store.dispatch(({type: 'TIME', payload: 10}))
        }, 3000)

        setTimeout(() => {
            this.store.dispatch(({type: 'TIME', payload: 20}))
        }, 5000)

        setTimeout(() => {
            this.store.dispatch(({type: 'TIME', payload: 10}))
        }, 6000)

        setTimeout(() => {
            this.store.dispatch(({type: 'TIME', payload: 10}))
        }, 7000)


        this.userModel$ = this.store.select(store => store.appDb.userModel);
        this.campaigns$ = this.store.select(store => store.msDatabase.sdk.table_campaigns).map((list: List<CampaignsModelExt>) => {
            this.cars = list;//.toArray();
            console.log(this.cars.length);
            return list.filter((campaignModel: CampaignsModelExt) => {
                if (campaignModel.getCampaignName().indexOf('bla_bla') > -1)
                    return false
                return true;
            })
        });
        this.store.select(store => store.msDatabase.sdk.table_resources).subscribe((resourceModels: List<ResourcesModel>) => {
            console.log(resourceModels.first().getResourceName());
            console.log(resourceModels.first().getResourceBytesTotal());
        })
    }

    m_selectedCampaign: CampaignsModelExt;

    _onCampaignSelected(event: MouseEvent, campaign: CampaignsModelExt) {
        if (jQuery(event.target).hasClass('settings')) {
            this.store.dispatch(({type: 'CAMP', payload: UiUserFocusItemEnum.campaign}))
        } else {
            this.store.dispatch(({type: 'CAMP', payload: UiUserFocusItemEnum.campaignBoard}))

        }
        this.m_selectedCampaign = campaign;

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

    _removeCampaign(campaign: CampaignsModelExt) {
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















