import {Component, ElementRef, EventEmitter, Output} from "@angular/core";
import {Observable} from "rxjs";
import {Compbaser} from "ng-mslib";
import {Router} from "@angular/router";
import {RedPepperService} from "../../services/redpepper.service";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ISceneData} from "../blocks/block-service";

@Component({
    // changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'scene-manager',
    template: `
        <small class="debug" style="padding-left: 30px">{{me}}</small>

        <div style="padding-bottom: 10px">
            <span i18n style="font-size: 1.8em;" i18n>campaign selection</span>
        </div>
        <div>
            <div class="btn-group">
                <button (click)="_createCampaign()" type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-rocket"></i>
                    <span i18n>new campaign</span>
                </button>
                <button disabled="true" type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-trash-o"></i>
                    <span i18n>remove</span>
                </button>
                <button disabled="true" type="button" class="btn btn-danger">
                    <i class="fa fa-magic"></i>
                    <span i18n>Get Wizard help</span>
                </button>
            </div>
        </div>
        <button i18n class="btn btn-primary" (click)="save()">save to server</button>
        <!-- move scroller to proper offset -->
        <div class="responsive-pad-right">
            <div matchBodyHeight="350" style="overflow: scroll">

                <scene-list [scenes]="scenes$ | async"  (slideToSceneEditor)="slideToSceneEditor.emit($event)" (onSceneSelected)="_onSceneSelected($event)">
                </scene-list>

                <!--<scene-list (onCampaignSelected)="_onSceneSelected($event)"-->
                <!--(slideToCampaignName)="slideToCampaignName.emit($event)"-->
                <!--(slideToCampaignEditor)="slideToCampaignEditor.emit($event)"-->
                <!--[scenes]="scenes$ | async">-->
                <!--</scene-list>-->
            </div>
        </div>
    `
})
export class SceneManager extends Compbaser {


    public scenes$: Observable<Array<ISceneData>>
    // public userModel$: Observable<UserModel>;
    // public timelineSelected$: Observable<number>;

    constructor(private el: ElementRef, private yp: YellowPepperService, private redPepperService: RedPepperService, private router: Router) {
        super();
        this.preventRedirect(true);

        this.scenes$ = this.yp.getScenes()
        // this.timelineSelected$ = this.yp.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected).map(v => v);
        //
        // this.userModel$ = this.yp.ngrxStore.select(store => store.appDb.userModel);
        // this.scenes$ = this.yp.ngrxStore.select(store => store.msDatabase.sdk.table_campaigns).map((list: List<CampaignsModelExt>) => {
        //     this.cars = list;//.toArray();
        //     return list.filter((campaignModel: CampaignsModelExt) => {
        //         if (campaignModel.getCampaignName().indexOf('bla_bla') > -1)
        //             return false
        //         return true;
        //     })
        // });
    }

    @Output()
    slideToSceneEditor: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    slideToCampaignName: EventEmitter<any> = new EventEmitter<any>();


    private save() {
        con('saving...');
        this.redPepperService.save((result) => {
            if (result.status == true) {
                bootbox.alert('saved');
            } else {
                alert(JSON.stringify(result));
            }
            // console.log(JSON.stringify(result));
        });
    }

    _onSceneSelected(i_uiState: IUiState) {
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: i_uiState}))
    }

    _createCampaign() {
        var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        this.slideToCampaignName.emit();
    }

    destroy() {
        // var uiState: IUiState = {uiSideProps: SideProps.none}
        // this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }
}
