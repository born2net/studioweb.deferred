import {Component, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter, Input, Inject} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";
import {BlockLabels, BlockService, PLACEMENT_CHANNEL, PLACEMENT_LISTS, PLACEMENT_SCENE} from "../blocks/block-service";
import {Lib} from "../../Lib";
import * as _ from 'lodash';
import {UserModel} from "../../models/UserModel";
import {Once} from "../../decorators/once-decorator";
import {PlayerDataModel, ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {Map, List} from 'immutable';
import {RedPepperService} from "../../services/redpepper.service";


@Component({
    selector: 'add-content',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <button (click)="_goBack()" id="prev" type="button" class="openPropsButton btn btn-default btn-sm">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </button>
    `
})
export class AddContent extends Compbaser implements AfterViewInit {

    m_placement;
    m_sceneMime;
    m_userModel: UserModel;
    m_resourceModels: List<ResourcesModel>;
    m_playerDataModels: Array<XMLDocument>;

    constructor(private yp: YellowPepperService, private rp:RedPepperService, private bs: BlockService, @Inject('HYBRID_PRIVATE') private hybrid_private: boolean) {
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
                .subscribe((i_playerDataModels) => {
                    this.m_playerDataModels = i_playerDataModels;
                }, (e) => console.error(e))
        )
    }

    @Output()
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    ngAfterViewInit() {
        this._render();
    }

    _goBack() {
        var uiState: IUiState = {
            uiSideProps: SideProps.miniDashboard,
            campaign: {
                campaignTimelineChannelSelected: -1,
                campaignTimelineBoardViewerSelected: -1
            }
        }
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        this.onGoBack.emit();
    }

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

        var componentList = [];
        var sceneList = [];
        var scenesList = [];

        /////////////////////////////////////////////////////////
        // component selection list
        /////////////////////////////////////////////////////////
        var components = this.bs.getBlocks();
        var primeUpgradeText = 'Upgrade to an enterprise account and get all the benefits of the SignageStudio Pro account plus a lot more…';
        var bufferFreeComp = '';
        var bufferPrimeComp = '';
        var specialJsonItemName = '';
        var specialJsonItemColor = '';
        //var sceneHasMimeType = '';

        for (var i_componentID in components) {
            var componentID: any = i_componentID;
            var primeSnippet = '';
            var faOpacity = 1;
            var bufferSwitch = 0;

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
                    componentList.push({
                        allow: status == 1 ? true : false,
                        componentID: componentID,
                        name: components[componentID].name,
                        fa: components[componentID].fontAwesome,
                        specialJsonItemName: specialJsonItemName,
                        specialJsonItemColor: specialJsonItemColor,
                        description: components[componentID].description

                    })
                    break;
                }
            }

            // var snippet = ' <li style="background-color: ' + specialJsonItemColor + '" class="list-group-item ' + BB.lib.unclass(Elements.CLASS_ADD_BLOCK_LIST_ITEMS, this.el) + '" data-component_id="' + componentID + '" data-component_name="' + (specialJsonItemName != '' ? specialJsonItemName : components[componentID].name) + '">';
            // snippet += '        <i style="opacity: ' + faOpacity + '" class="fa ' + components[componentID].fontAwesome + '"></i>';
            // snippet += '        <span style="opacity: ' + faOpacity + '"> ' + (specialJsonItemName != '' ? specialJsonItemName : components[componentID].name) + '</span>';
            // snippet += '        <h6 style="opacity: ' + faOpacity + '"> ' + components[componentID].description + '</h6>' + primeSnippet;
            // snippet += '    </li>';
            //
            // bufferSwitch == 1 ? bufferFreeComp += snippet : bufferPrimeComp += snippet;
        }


        // $(Elements.ADD_COMPONENT_BLOCK_LIST, this.el).append(bufferFreeComp);
        // $(Elements.ADD_COMPONENT_BLOCK_LIST, this.el).append(bufferPrimeComp);

        /////////////////////////////////////////////////////////
        // show resource selection list
        /////////////////////////////////////////////////////////

        // var recResources = pepper.getResources();
        this.m_resourceModels.forEach((i_resourcesModel: ResourcesModel) => {

            var size = (i_resourcesModel.getResourceBytesTotal() / 1000).toFixed(2);
            var resourceDescription = 'size: ' + size + 'K dimension: ' + i_resourcesModel.getResourcePixelWidth() + 'x' + i_resourcesModel.getResourcePixelHeight();

            // var snippet = '<li class="list-group-item ' + BB.lib.unclass(Elements.CLASS_ADD_BLOCK_LIST_ITEMS, this.el) + '" data-resource_id="' + recResources[i]['resource_id'] + '" data-resource_name="' + recResources[i]['resource_name'] + '">' +
            //     '<i class="fa ' + BB.PepperHelper.getFontAwesome(recResources[i]['resource_type']) + '"></i>' +
            //     '<span>' + recResources[i]['resource_name'] + '</span>' +
            //     '<br/><small>' + resourceDescription + '</small>' +
            //     '</li>';
            // $(Elements.ADD_RESOURCE_BLOCK_LIST, this.el).append(snippet);
        })


        /////////////////////////////////////////////////////////
        // show scene selection list in Scene or block list modes
        /////////////////////////////////////////////////////////

        if (this.m_placement == PLACEMENT_CHANNEL || this.m_placement == PLACEMENT_LISTS) {
            this.m_playerDataModels.forEach((scene, i)=>{
                // var scene:XMLDocument = i_playerDataModel.getPlayerDataValue();
                var label = $(scene).find('Player').eq(0).attr('label');
                var sceneID = $(scene).find('Player').eq(0).attr('id');
                var mimeType = $(scene).find('Player').eq(0).attr('mimeType');

                // don't allow adding mimetype scenes to channels directly as needs to be added via Player block
                if (this.m_placement == PLACEMENT_CHANNEL) {
                    if (!_.isUndefined(mimeType))
                        return;
                }

                // sceneID = this.rp.sterilizePseudoId(sceneID);
                // sceneID = this.rp.sterilizePseudoIdFromScene(scene);
                // var snippet = '<li class="list-group-item ' + BB.lib.unclass(Elements.CLASS_ADD_BLOCK_LIST_ITEMS, this.el) + '" data-scene_id="' + sceneID + '">' +
                //     '<i class="fa ' + BB.PepperHelper.getFontAwesome('scene') + '"></i>' +
                //     '<span>' + label + '</span>' +
                //     '<br/><small></small>' +
                //     '</li>';
                // $(Elements.ADD_SCENE_BLOCK_LIST, this.el).append(snippet);
            })


        }

        // if (this.m_placement == BB.CONSTS.PLACEMENT_CHANNEL || this.m_placement == BB.CONSTS.PLACEMENT_LISTS) {
        //     var scenes = pepper.getScenes();
        //     _.each(scenes, function (scene, i) {
        //         var label = $(scene).find('Player').eq(0).attr('label');
        //         var sceneID = $(scene).find('Player').eq(0).attr('id');
        //
        //         // don't allow adding mimetype scenes to channels directly as needs to be added via Player block
        //         if (this.m_placement == BB.CONSTS.PLACEMENT_CHANNEL) {
        //             var mimeType = BB.Pepper.getSceneMime(sceneID);
        //             if (!_.isUndefined(mimeType))
        //                 return;
        //         }
        //
        //         sceneID = pepper.sterilizePseudoId(sceneID);
        //         var snippet = '<li class="list-group-item ' + BB.lib.unclass(Elements.CLASS_ADD_BLOCK_LIST_ITEMS, this.el) + '" data-scene_id="' + sceneID + '">' +
        //             '<i class="fa ' + BB.PepperHelper.getFontAwesome('scene') + '"></i>' +
        //             '<span>' + label + '</span>' +
        //             '<br/><small></small>' +
        //             '</li>';
        //         $(Elements.ADD_SCENE_BLOCK_LIST, this.el).append(snippet);
        //     });
        // }


        if (this.m_placement == PLACEMENT_SCENE) {
            // $(Elements.ADD_COMPONENTS_BLOCK_LIST_CONTAINER, this.el).show();
            // $(Elements.ADD_SCENE_BLOCK_LIST_CONTAINER, this.el).hide();
        }


        if (this.m_placement == PLACEMENT_LISTS) {
            // $(Elements.ADD_COMPONENTS_BLOCK_LIST_CONTAINER, this.el).hide();
            // $(Elements.ADD_SCENE_BLOCK_LIST_CONTAINER, this.el).show();
        }


        if (this.m_placement == PLACEMENT_CHANNEL) {
            // $(Elements.ADD_COMPONENTS_BLOCK_LIST_CONTAINER, this.el).show();
            // $(Elements.ADD_SCENE_BLOCK_LIST_CONTAINER, this.el).show();
        }

        // this._listenSelection();


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