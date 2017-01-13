import {Component, ChangeDetectionStrategy, ElementRef, ViewChild} from "@angular/core";
import {Compbaser} from "../../compbaser/Compbaser";
import {ApplicationState} from "../../../store/application.state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../../models/UserModel";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import {List} from 'immutable';
import {ResourcesModal, CampaignsModal} from "../../../store/imsdb.interfaces_auto";
import {EFFECT_RENAME_CAMPAIGN, EFFECT_CREATE_CAMPAIGN_BOARD, EFFECT_REMOVE_CAMPAIGN} from "../../../store/effects/msdb.effects";
import {RedPepperService} from "../../../services/redpepper.service";

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        button {
            width: 200px;
            margin: 5px;
        }
    `],
    template: `
               <h2>Dashboard</h2>
               <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
               <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
               
               <canvas #canvas width="300" height="300"></canvas>
               <h2>selected: {{selectedCampaign?.getCampaignName()}}</h2>
               <button class="btn btn-primary" (click)="createCampaign()">create campaign</button>
               <br/>
               <button class="btn btn-primary" (click)="save()">save to server</button>
                <ul class="list-group">
                   <li  class="list-group-item" *ngFor="let campaign of campaigns$ | async">
                        <input #ren (focus)="selectedCampaign=campaign" (blur)="selectedCampaign=campaign ; renameCampaign(campaign,ren.value)" value="{{campaign?.getCampaignName()}}">
                        <button (click)="removeCampaign(campaign)" class="fa fa-remove"></button>
                    </li>
                </ul>
                
           `,
})
export class Dashboard extends Compbaser {

    private campaigns$: Observable<any>;
    private userModel$: Observable<UserModel>;
    private fabricCanvas: fabric.IStaticCanvas;
    private selectedCampaign: CampaignsModal;

    @ViewChild('canvas')
    canvas;

    constructor(private store: Store<ApplicationState>, private redPepperService: RedPepperService) {
        super();
        this.userModel$ = this.store.select(store => store.appDb.userModel);
        this.campaigns$ = this.store.select(store => store.msDatabase.sdk.table_campaigns).map((list: List<CampaignsModal>) => {
            return list.filter((campaignModel: CampaignsModal) => {
                if (campaignModel.getCampaignName().indexOf('bla_bla') > -1)
                    return false
                return true;
            })
        });
        this.store.select(store => store.msDatabase.sdk.table_resources).subscribe((resourceModels: List<ResourcesModal>) => {
            // console.log(resourceModels.first().getResourceName());
            // console.log(resourceModels.first().getResourceBytesTotal());
        })
    }

    private removeCampaign(campaign: CampaignsModal) {
        this.store.dispatch({type: EFFECT_REMOVE_CAMPAIGN, payload: campaign})
    }

    private renameCampaign(campaign, newName) {
        this.fabricCanvas.setZoom(_.random(1, 1.5));
        this.store.dispatch({type: EFFECT_RENAME_CAMPAIGN, payload: {campaign: campaign, newName: newName}})
    }

    /**
     Populate the LI with all available campaigns from msdb
     @method _loadCampaignList
     @return none
     **/
    loadCampaignList() {
        // var campaignIDs = this.redPepperService.getCampaignIDs();

        // for (var i = 0; i < campaignIDs.length; i++) {
        //     var campaignID = campaignIDs[i];
        //     var recCampaign = this..getCampaignRecord(campaignID);
        //     var playListMode = recCampaign['campaign_playlist_mode'] == 0 ? 'sequencer' : 'scheduler';
        //
        //     var snippet = '<a href="#" class="' + BB.lib.unclass(Elements.CLASS_CAMPIGN_LIST_ITEM) + ' list-group-item" data-campaignid="' + campaignID + '">' +
        //         '<h4>' + recCampaign['campaign_name'] + '</h4>' +
        //         '<p class="list-group-item-text">play list mode:' + playListMode + '</p>' +
        //         '<div class="openProps">' +
        //         '<button type="button" class="' + BB.lib.unclass(Elements.CLASS_OPEN_PROPS_BUTTON) + ' btn btn-default btn-sm"><i style="font-size: 1.5em" class="fa fa-gear"></i></button>' +
        //         '</div>' +
        //         '</a>';
        //     $(Elements.CAMPAIGN_SELECTOR_LIST).append($(snippet));

    }


    ngOnInit() {
        this.fabricCanvas = new fabric.Canvas(this.canvas.nativeElement);
        var rect = new fabric.Rect({
            top: 100,
            left: 100,
            width: 60,
            height: 70,
            fill: 'red'
        });
        this.fabricCanvas.add(rect);
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