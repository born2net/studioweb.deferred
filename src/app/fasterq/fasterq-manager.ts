import {Component, EventEmitter, Output} from "@angular/core";
import {Observable} from "rxjs";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ToastsManager} from "ng2-toastr";
import {EFFECT_LOAD_FASTERQ_LINES} from "../../store/effects/appdb.effects";
import {Once} from "../../decorators/once-decorator";
import {FasterqLineModel} from "../../models/FasterqLineModel";
import {Map, List} from 'immutable';

@Component({
    selector: 'fasterq-manager',
    template: `
        <small class="debug" style="padding-left: 30px">{{me}}</small>
        <div style="padding-bottom: 10px">
            <span i18n style="font-size: 1.8em;" i18n>scene selection</span>
        </div>
        <div>
            <div class="btn-group">
                <button (click)="_createNew()" type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-rocket"></i>
                    <span i18n>new line</span>
                </button>
                <button (click)="_removeScene()" [disabled]="(sceneSelected$ | async) == -1" type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-trash-o"></i>
                    <span i18n>remove line</span>
                </button>
            </div>
        </div>
        <!-- move scroller to proper offset -->
        <div class="responsive-pad-right">
            <div matchBodyHeight="350" style="overflow: scroll">
                <ul (click)="$event.preventDefault()" class="appList list-group">
                    <a *ngFor="let line of lines$ | async; let i = index" (click)="_onLineSelected($event, line, i)"
                       [ngClass]="{'selectedItem': selectedIdx == i}" href="#" class="list-group-item">
                        <h4 style="padding-left: 50px; float: left">{{line.lineName}} (id: {{line.lineId}}) </h4>
                        <div style="position: relative; left: -235px" class="peopleInGroup">
                            <i class="peopleInLine fa fa-male"></i>
                            <i class="peopleInLine fa fa-male"></i>
                            <i class="peopleInLine fa fa-male"></i>
                            <i class="peopleInLine fa fa-male"></i>
                        </div>
                        <p class="list-group-item-text">Reminder ahead of people: {{line.reminder}} </p>
                        <div class="openProps">
                            <button type="button" class="props btn btn-default btn-sm"><i style="font-size: 1.5em" class="props fa fa-gear"></i></button>
                        </div>
                    </a>
                </ul>
                <!--<scene-list [scenes]="scenes$ | async" (slideToSceneEditor)="slideToSceneEditor.emit($event)" (onSceneSelected)="_onSceneSelected($event)">-->
                <!--</scene-list>-->
            </div>
        </div>
    `
})
export class FasterqManager extends Compbaser {

    selectedIdx = -1;
    m_selectedLine: FasterqLineModel;
    sceneSelected$;
    public lines$: Observable<List<FasterqLineModel>>

    constructor(private yp: YellowPepperService, private rp: RedPepperService, private toastr: ToastsManager) {
        super();
        this.preventRedirect(true);
        this._loadData();
        this.lines$ = this.yp.listenFasterqLines()
        // this.sceneSelected$ = this.yp.ngrxStore.select(store => store.appDb.uiState.scene.sceneSelected)
        // this._notifyResetSceneSelection();
    }

    // @ViewChild(SceneList)
    // sceneList:SceneList;

    // @Output()
    // sceneCreate: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    slideToFasterqEditor: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onLineSelected: EventEmitter<any> = new EventEmitter<any>();

    @Once()
    _loadData() {
        return this.yp.ngrxStore.select(store => store.appDb.appBaseUrlServices)
            .subscribe((appBaseUrlServices) => {
                this.yp.ngrxStore.dispatch({type: EFFECT_LOAD_FASTERQ_LINES, payload: {appBaseUrlServices}})
            })

    }

    _notifyResetSceneSelection() {
        var uiState: IUiState = {scene: {sceneSelected: -1}}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _removeScene() {
        // this.cancelOnDestroy(
        //     this.yp.ngrxStore.select(store => store.appDb.uiState.scene.sceneSelected)
        //         .take(1)
        //         .subscribe(scene_id => {
        //             bootbox.confirm('Are you sure you want to remove the selected scene', (result) => {
        //                 if (result == true) {
        //                     this._notifyResetSceneSelection();
        //                     this.rp.removeBlocksWithSceneID(scene_id);
        //                     this.rp.removeSceneFromBlockCollectionInScenes(scene_id);
        //                     this.rp.removeSceneFromBlockCollectionsInChannels(scene_id);
        //                     this.rp.removeSceneFromBlockLocationInScenes(scene_id);
        //                     this.rp.removeSceneFromBlockLocationInChannels(scene_id);
        //                     this.rp.removeScene(scene_id);
        //                     this.rp.reduxCommit();
        //                     this.sceneList.resetSelection();
        //                     this.toastr.info('scene removed from scene list');
        //                 }
        //             });
        //         })
        // )
    }

    /**
     Create a new scene based on player_data and strip injected IDs if arged
     @method createScene
     @param {String} i_scenePlayerData
     @optional {Boolean} i_stripIDs
     @optional {Boolean} i_loadScene
     @optional {String} i_mimeType
     @optional {String} i_name
     **/
    private createScene(i_scenePlayerData, i_stripIDs, i_mimeType, i_name?) {
        if (i_stripIDs)
            i_scenePlayerData = this.rp.stripPlayersID(i_scenePlayerData);
        var sceneId = this.rp.createScene(i_scenePlayerData, i_mimeType, i_name);
        this.rp.reduxCommit();
    }

    private save() {
        con('saving...');
        this.rp.save((result) => {
            if (result.status == true) {
                bootbox.alert('saved');
            } else {
                alert(JSON.stringify(result));
            }
        });
    }

    _onLineSelected(event: MouseEvent, i_fasterqLineModel: FasterqLineModel, index) {
        // event.stopPropagation();
        // event.preventDefault();
        this.selectedIdx = index;
        let uiState: IUiState;
        if (jQuery(event.target).hasClass('props')) {
            uiState = {
                uiSideProps: SideProps.fasterqLineProps,
                fasterq: {
                    fasterqLineSelected: i_fasterqLineModel.lineId
                }
            }
            this.onLineSelected.emit(uiState)
        } else {
            uiState = {
                uiSideProps: SideProps.fasterqLineEditor,
                fasterq: {
                    fasterqLineSelected: i_fasterqLineModel.lineId
                }
            }
            this.slideToFasterqEditor.emit();
            // this.onCampaignSelected.emit(uiState)
        }
        this.m_selectedLine = i_fasterqLineModel;
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    _createNew() {
        // this.sceneCreate.emit();
        // var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        // this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        // this.slideToCampaignName.emit();
    }

    destroy() {
        var uiState: IUiState = {
            uiSideProps: SideProps.miniDashboard,
            fasterq: {
                fasterqLineSelected: -1
            }
        }
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }
}
