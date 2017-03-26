import {ChangeDetectionStrategy, Component} from "@angular/core";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {ISceneData} from "../blocks/block-service";
import {List} from "immutable";
import {Observable} from "rxjs";
import {Compbaser} from "ng-mslib";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'resources',
    template: `
        <small class="debug">{{me}}</small>
        <div id="resourcesPanel">
            <label class="myFile">
                <button type="button" class="btn btn-danger">
                    <i style="font-size: 1em" class="fa fa-plus"></i>
                    <span i18n>upload files</span>
                </button>
                <input type="file" accept=".flv,.mp4,.jpg,.png,.swf,.svg"/>
            </label>
            <div class="btn-group">
                <button type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-minus"></i>
                    <span i18n>remove</span>
                </button>
                <button type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-list"></i>
                    <span i18n>list</span>
                </button>
                <button type="button" class="btn btn-default">
                    <i style="font-size: 1em" class="fa fa-table"></i>
                    <span i18n>grid</span>
                </button>
                <input style="width: 200px" id="resourcesFilterList" class="form-control" placeholder="search for" required="">
            </div>
            <h5 i18n>supported files: flv, mp4, jpg, png, swf and svg</h5>
            <div id="resourceLibListWrap">
                <ul id="resourceLibList" class="list-group row"></ul>
            </div>
        </div>
        <!-- move scroller to proper offset -->
        <div class="responsive-pad-right">
            <div matchBodyHeight="150" style="overflow: scroll">
                <resources-list [resources]="m_resourceModels$ | async" (_onResourceSelected)="_onSceneSelected($event)">
                </resources-list>
            </div>
        </div>
    `,
    styles: [`
        * {
            border-radius: 0 !important;
        }

        #resourcesPanel {
            padding: 10px;
        }

        .myFile {
            position: relative;
            overflow: hidden;
            float: left;
            clear: left;
        }

        .myFile input[type="file"] {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            opacity: 0;
            font-size: 100px;
            filter: alpha(opacity=0);
            cursor: pointer;
        }
    `]
})

export class Resources extends Compbaser {

    m_resourceModels: List<ResourcesModel>;
    m_resourceModels$: Observable<List<ResourcesModel>>;

    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.m_resourceModels$ = this.yp.getResources();
        // this.cancelOnDestroy(
        //     //
        //     this.yp.getResources()
        //         .subscribe((i_resources: List<ResourcesModel>) => {
        //             this.m_resourceModels = i_resources;
        //         }, (e) => console.error(e))
        // )
    }

    _onResourceSelected(event: MouseEvent, scene: ISceneData, index) {
        // this.selectedIdx = index;
        // let uiState: IUiState;
        // if (jQuery(event.target).hasClass('props')) {
        //     uiState = {
        //         uiSideProps: SideProps.sceneProps,
        //         scene: {sceneSelected: scene.scene_id}
        //     }
        //     this.onSceneSelected.emit(uiState)
        // } else {
        //     uiState = {
        //         uiSideProps: SideProps.miniDashboard,
        //         scene: {sceneSelected: scene.scene_id}
        //     }
        //     this.slideToSceneEditor.emit();
        //     this.onSceneSelected.emit(uiState)
        // }
        // this.m_selectedScene = scene;
    }

}

