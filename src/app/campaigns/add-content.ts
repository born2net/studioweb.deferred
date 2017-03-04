import {AfterViewInit, Component, EventEmitter, Inject, Input, Output} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISceneData, YellowPepperService} from "../../services/yellowpepper.service";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {BlockService} from "../blocks/block-service";
import {Lib} from "../../Lib";
import * as _ from "lodash";
import {UserModel} from "../../models/UserModel";
import {CampaignTimelineBoardViewerChanelsModel, ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {List} from "immutable";
import {RedPepperService} from "../../services/redpepper.service";
import {IAddContents} from "../../interfaces/IAddContent";
import {BlockTypeEnum} from "../../interfaces/BlockTypeEnum";
import {BlockLabels, PLACEMENT_CHANNEL, PLACEMENT_LISTS, PLACEMENT_SCENE} from "../../interfaces/Consts";

@Component({
    selector: 'add-content',
    styles: [`
        .nowAllowed {
            opacity: 0.4;
        }

        .btn-primary {
            position: relative;
            top: -45px
        }

        li:hover {
            background-color: #dadada;
            cursor: pointer;
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <button (click)="_goBack()" id="prev" type="button" class="openPropsButton btn btn-default btn-sm">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </button>
        <div *ngIf="m_placement == m_PLACEMENT_SCENE || m_placement == m_PLACEMENT_CHANNEL" style="padding-top: 20px; padding-right: 30px" class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
            <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="headingOne">
                    <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                            Components
                        </a>
                    </h4>
                </div>
                <div id="collapseOne" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                    <div class="panel-body">
                        <ul class="list-group" id="addComponentBlockList" style="padding:20px">
                            <li (click)="_onComponentSelected(component)" *ngFor="let component of m_componentList" class="list-group-item ">
                                <i [ngClass]="{nowAllowed: !component.allow}" style="display: inline" class="fa fa-2x {{component.fa}}"></i>
                                <h3 [ngClass]="{nowAllowed: !component.allow}" style=" display: inline"> {{component.name}} </h3>
                                <h6 [ngClass]="{nowAllowed: !component.allow}"> {{component.description}}</h6>
                                <button (click)="_onUpgEnterprise($event)" class="btn btn-primary pull-right" *ngIf="!component.allow">
                                    upgrade to enterprise
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="headingTwo">
                    <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Resources
                        </a>
                    </h4>
                </div>
                <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                    <div class="panel-body">
                        <ul class="list-group" id="addComponentBlockList" style="padding:20px">
                            <li (click)="_onResourceSelected(resource)" *ngFor="let resource of m_resourceList" class="list-group-item ">
                                <i style="display: inline" class="fa fa-2x {{resource.fa}}"></i>
                                <h3 style=" display: inline"> {{resource.name}} </h3>
                                <h6> {{resource.description}}</h6>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div *ngIf="m_placement == m_PLACEMENT_LISTS || m_placement == m_PLACEMENT_CHANNEL" class="panel panel-default">
                <div class="panel-heading" role="tab" id="headingThree">
                    <h4 class="panel-title">
                        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Scenes
                        </a>
                    </h4>
                </div>
                <div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                    <div class="panel-body">
                        <ul class="list-group" id="addComponentBlockList" style="padding:20px">
                            <li (click)="_onSceneSelected(scene)" *ngFor="let scene of m_sceneList" class="list-group-item ">
                                <i style="display: inline" class="fa fa-2x {{scene.fa}}"></i>
                                <h3 style=" display: inline"> {{scene.name}} </h3>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    `
})
export class AddContent extends Compbaser implements AfterViewInit {

    m_placement;
    m_sceneMime;
    m_userModel: UserModel;
    m_resourceModels: List<ResourcesModel>;
    m_sceneDatas: Array<ISceneData>;

    m_componentList: Array<IAddContents> = [];
    m_resourceList: Array<IAddContents> = [];
    m_sceneList: Array<IAddContents> = [];

    m_PLACEMENT_SCENE = PLACEMENT_SCENE;
    m_PLACEMENT_LISTS = PLACEMENT_LISTS;
    m_PLACEMENT_CHANNEL = PLACEMENT_CHANNEL;

    m_selected_campaign_timeline_chanel_id = -1;

    constructor(private yp: YellowPepperService, private rp: RedPepperService, private bs: BlockService, @Inject('HYBRID_PRIVATE') private hybrid_private: boolean) {
        super();

        this.cancelOnDestroy(
            this.yp.getUserModel()
                .subscribe((i_userModel: UserModel) => {
                    this.m_userModel = i_userModel;
                }, (e) => console.error(e))
        )

        this.cancelOnDestroy(
            this.yp.getResources()
                .subscribe((i_resources: List<ResourcesModel>) => {
                    this.m_resourceModels = i_resources;
                }, (e) => console.error(e))
        )

        this.cancelOnDestroy(
            this.yp.getScenes()
                .subscribe((i_playerDatas: Array<ISceneData>) => {
                    this.m_sceneDatas = i_playerDatas;
                }, (e) => console.error(e))
        )

        this.cancelOnDestroy(
            this.yp.listenCampaignTimelineBoardViewerSelected(true)
                .subscribe((i_campaignTimelineBoardViewerChanelsModel:CampaignTimelineBoardViewerChanelsModel) => {
                    this.m_selected_campaign_timeline_chanel_id = i_campaignTimelineBoardViewerChanelsModel.getCampaignTimelineChanelId();
            }, (e) => console.error(e)) //cancelOnDestroy please
        )

        var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    @Output()
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    /**
     Allow us to control the current placement of the module so the behaviour can be according
     to where the instance resides (i.e.: current launch is from Block collection list of from Channel list
     for example)
     @method setPlacement
     @param {Number} i_playerData
     **/
    @Input()
    set setPlacement(value) {
        this.m_placement = value;
    }

    /**
     Allow us to control the view depending upon the current mimetype of the scene that launched this
     instance. Keep in mind that m_sceneMime is only set for one duration of _render.
     Once rendered the list, we reset the m_sceneMime back to undefined so
     @method setSceneMime
     @param {String} i_mimeType
     **/
    @Input()
    setSceneMime(m_sceneMime) {
        this.m_sceneMime = m_sceneMime;
    }

    _addBlock(i_addContents: IAddContents) {
        this.yp.getTotalDurationChannel(this.m_selected_campaign_timeline_chanel_id)
            .subscribe((i_totalChannelLength) => {
                var boilerPlate = this.bs.getBlockBoilerplate(i_addContents.blockCode);
                this._createNewChannelBlock(i_addContents, boilerPlate, i_totalChannelLength);
            }, (e) => console.error(e))
    }

    /**
     Create a new block (player) on the current channel and refresh UI bindings such as properties open events.
     **/
    _createNewChannelBlock(i_addContents: IAddContents, i_boilerPlate, i_totalChannelLength) {
        this.rp.createNewChannelPlayer(this.m_selected_campaign_timeline_chanel_id, i_addContents, i_boilerPlate, i_totalChannelLength);
        this.rp.reduxCommit();
    }


    ngAfterViewInit() {
        this._render();
    }

    _onUpgEnterprise(event: MouseEvent) {
        event.stopImmediatePropagation();
        event.preventDefault();
        con('upg ent');
    }

    _onComponentSelected(i_component) {
        if (!i_component.allow)
            return bootbox.alert('Please upgrade to the Enterprise edition')
        this._addBlock(i_component);
        this._goBack();
    }

    _onResourceSelected(i_resource) {
        this._addBlock(i_resource);
        this._goBack();
    }

    _onSceneSelected(i_scnene) {
        this._addBlock(i_scnene);
        this._goBack();
    }

    _goBack() {
        var uiState: IUiState = {uiSideProps: SideProps.miniDashboard}
        // var uiState: IUiState = {
        //     uiSideProps: SideProps.miniDashboard,
        //     campaign: {
        //         campaignTimelineChannelSelected: -1,
        //         campaignTimelineBoardViewerSelected: -1
        //     }
        // }
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        this.onGoBack.emit();
    }

    /**
     Build lists of components, resources and scenes (respectively showing what's needed per placement mode)
     Once an LI is selected proper event fired to announce block is added.
     @method _render
     @return none
     **/
    _render() {

        // BB.comBroker.getService(BB.SERVICES.PROPERTIES_VIEW).resetPropertiesView();
        //
        // $(Elements.ADD_COMPONENT_BLOCK_LIST, this.el).empty();
        // $(Elements.ADD_RESOURCE_BLOCK_LIST, this.el).empty();
        // $(Elements.ADD_SCENE_BLOCK_LIST, this.el).empty();

        this.m_componentList = [];
        this.m_sceneList = []


        /////////////////////////////////////////////////////////
        // component selection list
        /////////////////////////////////////////////////////////
        var components = this.bs.getBlocks();
        var specialJsonItemName = '';
        var specialJsonItemColor = '';
        //var sceneHasMimeType = '';

        for (var i_componentID in components) {
            var componentID: any = i_componentID;

            if (componentID == BlockLabels.BLOCKCODE_IMAGE ||
                componentID == BlockLabels.BLOCKCODE_SVG ||
                componentID == BlockLabels.BLOCKCODE_TWITTER ||
                componentID == BlockLabels.BLOCKCODE_TWITTER_ITEM ||
                componentID == BlockLabels.BLOCKCODE_VIDEO ||
                componentID == BlockLabels.BLOCKCODE_SCENE ||
                (this.m_placement == PLACEMENT_CHANNEL && componentID == BlockLabels.BLOCKCODE_JSON_ITEM) ||
                (this.m_placement == PLACEMENT_CHANNEL && componentID == BlockLabels.BLOCKCODE_TWITTER_ITEM) ||
                (this.m_placement == PLACEMENT_SCENE && componentID == BlockLabels.BLOCKCODE_JSON) ||
                (this.m_placement == PLACEMENT_SCENE && componentID == BlockLabels.BLOCKCODE_WORLD_WEATHER) ||
                (this.m_placement == PLACEMENT_SCENE && componentID == BlockLabels.BLOCKCODE_GOOGLE_SHEETS) ||
                (this.m_placement == PLACEMENT_SCENE && componentID == BlockLabels.BLOCKCODE_TWITTER)) {
                continue;
            }

            // if PLACEMENT_SCENE and mimetype is set to specific, don't show any JSON based players
            if (this.m_sceneMime && this.m_placement == PLACEMENT_SCENE) {
                var jsonBasedPlayerXML = this.bs.getBlockBoilerplate(componentID).getDefaultPlayerData(PLACEMENT_SCENE);
                jsonBasedPlayerXML = $.parseXML(jsonBasedPlayerXML);
                if ($(jsonBasedPlayerXML).find('Json').length > 0)
                    continue;
            }

            // if PLACEMENT_SCENE and mimetype is set on scene, give special attention to JSON_ITEM component since it will often be the one user needs
            if (this.m_sceneMime && this.m_placement == PLACEMENT_SCENE && componentID == BlockLabels.BLOCKCODE_JSON_ITEM) {
                specialJsonItemName = Lib.CapitaliseFirst(this.m_sceneMime.split('.')[1]);
                // specialJsonItemColor = BB.CONSTS['THEME'] === 'light' ? '#A9CFFA' : '#262627';
            } else {
                specialJsonItemName = '';
                specialJsonItemColor = '';
            }

            // check if and how to render components depending on user account type
            var status = this._checkAllowedComponent(componentID)
            switch (status) {
                case 0: {
                    continue;
                }
                case 1:
                case 2: {
                    this.m_componentList.push({
                        blockId: componentID,
                        type: BlockTypeEnum.COMPONENT,
                        allow: status == 1 ? true : false,
                        blockCode: componentID,
                        name: components[componentID].name,
                        fa: components[componentID].fontAwesome,
                        specialJsonItemName: specialJsonItemName,
                        specialJsonItemColor: specialJsonItemColor,
                        description: components[componentID].description

                    })
                    break;
                }
            }
        }


        /////////////////////////////////////////////////////////
        // show resource selection list
        /////////////////////////////////////////////////////////

        // var recResources = pepper.getResources();
        this.m_resourceModels.forEach((i_resourcesModel: ResourcesModel) => {
            var size = (i_resourcesModel.getResourceBytesTotal() / 1000).toFixed(2);
            var resourceDescription = 'size: ' + size;
            this.m_resourceList.push({
                resourceId: i_resourcesModel.getResourceId(),
                type: BlockTypeEnum.RESOURCE,
                name: i_resourcesModel.getResourceName(),
                blockCode: this.bs.getBlockCodeFromFileExt(i_resourcesModel.getResourceType()) as number,
                data: i_resourcesModel,
                size: size,
                allow: true,
                fa: this.bs.getFontAwesome(i_resourcesModel.getResourceType()),
                description: resourceDescription
            })
        })

        /////////////////////////////////////////////////////////
        // show scene selection list in Scene or block list modes
        /////////////////////////////////////////////////////////

        if (this.m_placement == PLACEMENT_CHANNEL || this.m_placement == PLACEMENT_LISTS) {
            this.m_sceneDatas.forEach((i_sceneData: ISceneData) => {
                var label = $(i_sceneData.domPlayerData).find('Player').eq(0).attr('label');
                var mimeType = $(i_sceneData.domPlayerData).find('Player').eq(0).attr('mimeType');

                // don't allow adding mimetype scenes to channels directly as needs to be added via Player block
                if (this.m_placement == PLACEMENT_CHANNEL) {
                    if (!_.isUndefined(mimeType))
                        return;
                }
                this.m_sceneList.push({
                    sceneId: i_sceneData.scene_id,
                    type: BlockTypeEnum.SCENE,
                    blockCode: 3510,
                    name: label,
                    data: i_sceneData.domPlayerData,
                    fa: this.bs.getFontAwesome('scene'),
                    allow: true,
                    description: 'scene'
                })
            })
        }

        //reset mimetype
        this.m_sceneMime = undefined;
    }


    /**
     Check if component is allowed under enterprise / prime membership
     Note that if running under Hybrid or Private server default is to always allow
     all components
     @method _checkAllowedComponent
     @param {Number} i_componentID
     @return {Number} 0 = hide, 1 = show, 2 = upgradable
     **/
    _checkAllowedComponent(i_componentID) {
        // include all
        if (this.hybrid_private)
            return 1;

        // FasterQ, open to all
        if (i_componentID == 6100) {
            return 1;
        }

        var appID = this.bs.getBlockBoilerplate(i_componentID).app_id;
        if (_.isUndefined(appID))
            return 1;

        // component is prime, account is free type, upgradable
        if (this.m_userModel.getKey('resellerId') == 1)
            return 2;

        // account is under a reseller and component not available, hide it
        if (this.m_userModel.getKey('resellerId') != 1 && _.isUndefined(this.m_userModel.getKey('components')[appID]))
            return 0;

        // account is under a reseller and component is available, show it
        return 1;
    }

    destroy() {
    }
}

// var sceneID = $(i_sceneData.domPlayerData).find('Player').eq(0).attr('id');
// this.yp.getSceneIdFromPseudoId(sceneID).subscribe(a=>{
//     console.log(a);
// })
// sceneID = this.rp.sterilizePseudoId(sceneID);