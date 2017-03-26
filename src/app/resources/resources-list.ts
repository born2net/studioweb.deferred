import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {List} from "immutable";
import {BlockService} from "../blocks/block-service";

@Component({
    selector: 'resources-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <ul style="padding: 10px" (click)="$event.preventDefault()" class="appList list-group">

            <a *ngFor="let resource of m_resources; let i = index" (click)="_onSelected($event, scene, i)"
               [ngClass]="{'selectedItem': selectedIdx == i}" href="#" class="list-group-item">
                <h4>{{resource.getResourceName()}}</h4>
                <i class="pull-left fa {{bs.getFontAwesome(resource.getResourceType())}}"></i>
                <p class="pull-left list-group-item-text">file type: {{resource.getResourceType()}} </p>
                <span class="clearfix"></span>
                <!--<div class="openProps">-->
                    <!--<button type="button" class="props btn btn-default btn-sm"><i style="font-size: 1.5em" class="props fa fa-gear"></i></button>-->
                <!--</div>-->
            </a>
        </ul>
    `,
})
export class ResourcesList extends Compbaser {
    selectedIdx = -1;
    m_resources: List<ResourcesModel>;
    m_selected;

    constructor(private bs:BlockService) {
        super();
    }

    @Input()
    set resources(i_resources: List<ResourcesModel>) {
        this.m_resources = i_resources;
    }

    // @Output()
    // slideToSceneEditor: EventEmitter<any> = new EventEmitter<any>();
    //
    // @Output()
    // slideToSceneName: EventEmitter<any> = new EventEmitter<any>();
    //
    // @Output()
    // onSceneSelected: EventEmitter<any> = new EventEmitter<any>();

    _onSelected(event: MouseEvent, scene, index) {
        this.selectedIdx = index;
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

    resetSelection() {
        this.selectedIdx = -1;
    }

    ngOnInit() {
    }

    destroy() {
    }
}