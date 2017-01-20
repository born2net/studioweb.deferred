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

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    animations: [
        
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    styles: [`
        .propPanel, .mainPanelWrap {
             border-left: 1px #808080 solid; 
            -webkit-transition: width 0.1s ease, margin 0.1s ease;
            -moz-transition: width 0.1s ease, margin 0.1s ease;
            -o-transition: width 0.1s ease, margin 0.1s ease;
            transition: width 0.1s ease, margin 0.1s ease;
        
        }
        button {
            width: 200px;
            margin: 5px;
        }
       
    `],
    templateUrl: './campaigns.navigation.html'
})
export class CampaignsNavigation extends Compbaser {

    public campaigns$: Observable<any>;
    public userModel$: Observable<UserModel>;

    constructor(private el:ElementRef, private store: Store<ApplicationState>, private redPepperService: RedPepperService, private router: Router) {
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

    toggle(){
        jQuery(this.el.nativeElement).find('.mainPanelWrap').removeClass('col-md-9 col-lg-9')
        jQuery(this.el.nativeElement).find('.mainPanelWrap').addClass('col-md-12 col-lg-12')
        jQuery(this.el.nativeElement).find('.propPanelWrap').removeClass('col-md-3 col-lg-3')

        setTimeout(()=>{
            jQuery(this.el.nativeElement).find('.mainPanelWrap').addClass('col-md-9 col-lg-9')
            jQuery(this.el.nativeElement).find('.mainPanelWrap').removeClass('col-md-12 col-lg-12')
            jQuery(this.el.nativeElement).find('.propPanelWrap').addClass('col-md-3 col-lg-3')
        },3000)
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

    private removeCampaign(campaign: CampaignsModal) {
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

