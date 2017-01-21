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
    selector: 'campaigns',
    styles: [`
        .ui-orderlist {
            width: 400px;
        }
        .ui-orderlist-list {
            width: 400px;
        }
    `],
    template: `
                    <h2>Campaigns</h2>
                    <button (click)="onRoute1()">camp</button>
                    <button (click)="onRoute2()">fq</button>
                    <button (click)="onRoute3()">res</button>
                    <button (click)="onRoute4()">sett</button>
                    <button (click)="onRoute5()">stations</button>
                    <button (click)="onRoute6()">pro</button>
                    <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
                    <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
                    <!--<h2>selected: {{selectedCampaign?.getCampaignName()}}</h2>-->
                    <button class="btn btn-primary" (click)="createCampaign()">create campaign</button>
                    <br/>
                    <button class="btn btn-primary" (click)="save()">save to server</button>
                    <ul class="list-group">
                        <li class="list-group-item" *ngFor="let campaign of campaigns$ | async">
                            <input #ren (focus)="selectedCampaign=campaign" (blur)="selectedCampaign=campaign ; renameCampaign(campaign,ren.value)" value="{{campaign?.getCampaignName()}}">
                            <button (click)="removeCampaign(campaign)" class="fa fa-remove"></button>
                        </li>
                    </ul>
                    <hr/>
                    <h4>ng-bootstrap dropdown</h4>
                    <div class="btn-group" dropdown (click)="$event.preventDefault()">
                        <button id="single-button" type="button" class="btn btn-primary" dropdownToggle>
                            Button dropdown <span class="caret"></span>
                        </button>
                        <ul dropdownMenu role="menu" aria-labelledby="single-button">
                            <li role="menuitem"><a class="dropdown-item" href="#">Action</a></li>
                            <li role="menuitem"><a class="dropdown-item" href="#">Another action</a></li>
                            <li role="menuitem"><a class="dropdown-item" href="#">Something else here</a></li>
                            <li class="divider dropdown-divider"></li>
                            <li role="menuitem"><a class="dropdown-item" href="#">Separated link</a></li>
                        </ul>
                    </div>
                    
                    <!--<p-orderList [responsive]="true" [value]="campaigns$ | async">-->
                        <!--<template let-car pTemplate="item">-->
                            <!--<div class="ui-helper-clearfix">-->
                                <!--&lt;!&ndash;<img src="showcase/resources/demo/images/car/{{car.brand}}.gif" style="display:inline-block;margin:2px 0 2px 2px"/>&ndash;&gt;-->
                                <!--<div style="font-size:14px;float:right;margin:15px 5px 0 0">{{car.getCampaignName()}}</div>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</p-orderList>-->
                    
                    <p-orderList [responsive]="true" [value]="campaigns$ | async | ListToArrayPipe ">
                        <template let-car pTemplate="item">
                            <div class="ui-helper-clearfix">
                                <!--<img src="showcase/resources/demo/images/car/{{car.brand}}.gif" style="display:inline-block;margin:2px 0 2px 2px"/>-->
                                <div style="font-size:14px;float:left;margin:15px 5px 0 0">{{car.getCampaignName()}}</div>
                            </div>
                        </template>
                    </p-orderList>
                    
                    <hr/>
                    
                    <!--<p-orderList [responsive]="true" [value]="cars">-->
                        <!--<template let-car pTemplate="item">-->
                            <!--<div class="ui-helper-clearfix">-->
                                <!--&lt;!&ndash;<img src="showcase/resources/demo/images/car/{{car.brand}}.gif" style="display:inline-block;margin:2px 0 2px 2px"/>&ndash;&gt;-->
                                <!--<div style="font-size:14px;float:right;margin:15px 5px 0 0">{{car.getCampaignName()}}</div>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</p-orderList>-->
                    
    `
})
export class Campaigns extends Compbaser {

    public campaigns$: Observable<any>;
    public userModel$: Observable<UserModel>;
    cars;
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

