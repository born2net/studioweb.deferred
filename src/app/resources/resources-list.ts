import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {List} from "immutable";
import {BlockService} from "../blocks/block-service";
import {IUiState} from "../../store/store.data";
import {SideProps} from "../../store/actions/appdb.actions";

@Component({
    selector: 'resources-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <ul style="padding: 10px" (click)="$event.preventDefault()" class="appList list-group">

            <a *ngFor="let resource of m_resources; let i = index" (click)="_onSelected($event, resource, i)"
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
    @Output()
    onSceneSelected: EventEmitter<IUiState> = new EventEmitter<IUiState>();

    _onSelected(event: MouseEvent, i_resource:ResourcesModel, index) {
        this.selectedIdx = index;
        let uiState: IUiState = {
            uiSideProps: SideProps.resourceProps,
            resources: {resourceSelected: i_resource.getResourceId()}
        }
        this.onSceneSelected.emit(uiState)
        this.m_selected = i_resource;
    }

    resetSelection() {
        this.selectedIdx = -1;
    }

    ngOnInit() {
    }

    destroy() {
    }
}