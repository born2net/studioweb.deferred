import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {Compbaser, NgmslibService} from "ng-mslib";
import * as _ from "lodash";
import {List} from "immutable";
import {ISimpleGridEdit} from "../../comps/simple-grid-module/SimpleGrid";
import {StoreModel} from "../../store/model/StoreModel";
import {SimpleGridRecord} from "../../comps/simple-grid-module/SimpleGridRecord";
import {SimpleGridTable} from "../../comps/simple-grid-module/SimpleGridTable";
import {ISimpleGridDraggedData} from "../../comps/simple-grid-module/SimpleGridDraggable";
import {JsonEventResourceModel} from "./json-event-grid";
import {Lib} from "../../Lib";
import {ModalComponent} from "ng2-bs3-modal/ng2-bs3-modal";
import {IAddContents} from "../../interfaces/IAddContent";
import {BlockLabels, PLACEMENT_LISTS, PLACEMENT_SCENE} from "../../interfaces/Consts";
import {RedPepperService} from "../../services/redpepper.service";

@Component({
    selector: 'block-prop-location',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    styles: [`
        /* walk up the ancestor tree and if darkTheme is found, apply style */
        /*:host-context(.darkTheme) * {*/
        /*background-color: #1e1e1e;*/
        /*}*/
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>

        <form novalidate autocomplete="off" class="inner5" [formGroup]="m_contGroup">
            <div class="row">
                <li class="list-group-item">
                    <button (click)="_onAddNewCollectionItem()" type="button" title="add event" class="btn btn-default btn-sm">
                        <span class="fa fa-plus"></span>
                    </button>
                    <button (click)="_onRemoveCollectionItem()" type="button" title="remove event" class="btn btn-default btn-sm">
                        <span class="fa fa-minus"></span>
                    </button>
                </li>
                <li class="list-group-item">
                    <label i18n>Default sequential playlist</label>
                    <div style="overflow-x: auto">
                        <div style="width: 250px">
                            <simpleGridTable #simpleGrid>
                                <thead>
                                <tr>
                                    <th>name</th>
                                    <th>seconds</th>
                                    <th>order</th>
                                </tr>
                                </thead>
                                <tbody simpleGridDraggable (dragCompleted)="_onDragComplete($event)">
                                <tr class="simpleGridRecord" simpleGridRecord *ngFor="let item of m_collectionList; let index=index" [item]="item" [index]="index">
                                    <td style="width: 45%" [editable]="true" (labelEdited)="_onPageNameEdited($event,index)" field="name" simpleGridData [item]="item"></td>
                                    <td style="width: 45%" [editable]="true" (labelEdited)="_onDurationEdited($event,index)" field="duration" simpleGridData [item]="item"></td>
                                    <td style="width: 10%" simpleGridDataImage [item]="item" [color]="'blue'" [field]="'fa-arrows-v'"></td>
                                </tr>
                                </tbody>
                            </simpleGridTable>
                        </div>
                    </div>
                </li>
            </div>
            <hr/>
            <h4 id="locationControls" class="panel-title">
                <button type="button" name="addLocation" title="add a new item" class="addResourceToLocation btn btn-default btn-sm">
                    <span class="glyphicon glyphicon-plus"></span>
                </button>
                <button type="button" name="removeLocation" title="remove item"  class="btn btn-default btn-sm">
                    <span class="glyphicon glyphicon-minus"></span>
                </button>
                <button type="button" name="previous" title="remove item"  class="btn btn-default btn-sm">
                    <span class="glyphicon glyphicon-chevron-left"></span>
                </button>
                <button type="button" name="next" title="remove item" class="btn btn-default btn-sm">
                    <span class="glyphicon glyphicon-chevron-right"></span>
                </button>
                <button type="button" name="openLocation" title="openLocation item"  class="btn btn-default btn-sm">
                    <span class="glyphicon glyphicon glyphicon-map-marker"></span>
                </button>
            </h4>
            <br/>
            <label>
                <span data-localize="totalLocationBased">Total location based: </span>
                <span id="totalMapLocations">0</span>
            </label>
            
        </form><h5>block id {{m_blockData.blockID}}</h5>
        <modal #modal>
            <modal-header [show-close]="true">
                <h4 i18n class="modal-title">add content to collection</h4>
            </modal-header>
            <modal-body>
                <add-content [placement]="m_PLACEMENT_LISTS" #addContent (onAddContentSelected)="_onAddedContent($event)"></add-content>
            </modal-body>
            <modal-footer [show-default-buttons]="true"></modal-footer>
        </modal>
    `
})
export class BlockPropLocation extends Compbaser implements AfterViewInit {

    private formInputs = {};
    private m_contGroup: FormGroup;
    private m_blockData: IBlockData;

    m_PLACEMENT_LISTS = PLACEMENT_LISTS;
    m_collectionList: List<StoreModel>;

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private bs: BlockService, @Inject('BLOCK_PLACEMENT') private blockPlacement: string, private rp: RedPepperService) {
        super();
        this.m_contGroup = fb.group({
            'mode': [0]
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })
    }

    @ViewChild('simpleGrid')
    simpleGrid: SimpleGridTable;

    @ViewChild(ModalComponent)
    modal: ModalComponent;

    @Input()
    set setBlockData(i_blockData) {
        this.m_blockData = i_blockData;
        this._render();
    }

    ngAfterViewInit() {
        this._render();
    }

    _onAddNewBlock() {
        this.modal.open()
    }

    // _onAddedNewBlock(i_addContents:IAddContents) {
    //     console.log('added ' + i_addContents.name);
    //     this.modal.close()
    // }

    _onDragComplete(dragData: ISimpleGridDraggedData) {
        // dragData.items.forEach((item: StoreModel, i) => con(i + ' ' + item.getKey('name')) );
        var currentIndex = dragData.currentIndex;
        var newIndex = dragData.newIndex;
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jXML(domPlayerData).find('Fixed').children().get(newIndex);
        var source = jXML(domPlayerData).find('Fixed').children().get(currentIndex);
        newIndex > currentIndex ? jXML(target).after(source) : jXML(target).before(source);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _onRemoveCollectionItem() {
        var record: SimpleGridRecord = this.simpleGrid.getSelected();
        if (_.isUndefined(record)) return;
        var rowIndex = this.simpleGrid.getSelected().index;
        var domPlayerData = this.m_blockData.playerDataDom;
        jXML(domPlayerData).find('Fixed').children().eq(rowIndex).remove();
        // self._populateTableCollection(domPlayerData);
        // this._populateTableEvents();
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onAddNewCollectionItem() {
        this._onAddNewBlock()
    }

    _onDurationEdited(event: ISimpleGridEdit, index) {
        var value = event.value;
        if (!Lib.IsNumber(value)) return;
        var domPlayerData = this.m_blockData.playerDataDom;
        var item = jXML(domPlayerData).find('Fixed').children().get(index);
        jXML(item).attr('duration', value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onPageNameEdited(event: ISimpleGridEdit, index) {
        var value = event.value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var item = jXML(domPlayerData).find('Fixed').children().get(index);
        jXML(item).attr('page', value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }


    _populateTableCollection() {
        this.m_collectionList = List([]);
        var domPlayerData = this.m_blockData.playerDataDom as any
        var rowIndex = 0;

        jXML(domPlayerData).find('Fixed').children().each((k, page) => {
            var resource_hResource, scene_hDataSrc;
            var type = jXML(page).attr('type');
            if (type == 'resource') {
                resource_hResource = jXML(page).find('Resource').attr('hResource');
            } else {
                scene_hDataSrc = jXML(page).find('Player').attr('hDataSrc');
            }
            //con('populating ' + resource_hResource);

            var storeModel = new StoreModel({
                rowIndex: rowIndex,
                checkbox: true,
                name: jXML(page).attr('page'),
                duration: jXML(page).attr('duration'),
                type: type,
                resource_hResource: resource_hResource,
                scene_hDataSrc: scene_hDataSrc
            });
            this.m_collectionList = this.m_collectionList.push(storeModel);
            rowIndex++;
        });
        this.m_collectionList = this._sortCollection(this.m_collectionList);
    }

    // /**
    //  Load event list to block props UI
    //  @method _populateTableEvents
    //  **/
    // _populateTableEvents() {
    //     var data: Array<JsonEventResourceModel> = [], rowIndex = 0;
    //     var domPlayerData = this.m_blockData.playerDataDom;
    //     // self.m_collectionEventTable.bootstrapTable('removeAll');
    //     jXML(domPlayerData).find('EventCommands').children().each(function (k, eventCommand) {
    //         var pageName = '';
    //         if (jXML(eventCommand).attr('command') == 'selectPage')
    //             pageName = jXML(eventCommand).find('Page').attr('name');
    //         var storeModel = new JsonEventResourceModel({
    //                 rowIndex: rowIndex,
    //                 checkbox: true,
    //                 event: jXML(eventCommand).attr('from'),
    //                 pageName: pageName,
    //                 action: jXML(eventCommand).attr('command')
    //             }
    //         )
    //         data.push(storeModel)
    //         rowIndex++;
    //     });
    //     this.m_jsonEventResources = data;
    // }

    _sortCollection(i_collection: List<StoreModel>): List<StoreModel> {
        var sorted = i_collection.sort((a, b) => {
            if (a.getKey('rowIndex') > b.getKey('rowIndex'))
                return 1;
            if (a.getKey('rowIndex') < b.getKey('rowIndex'))
                return -1;
            return 0;
        })
        return sorted as List<StoreModel>;
    }

    _render() {
        this.m_contGroup.reset();
        var domPlayerData = this.m_blockData.playerDataDom
        this._populateTableCollection();
        this.cd.markForCheck();
    }

    /**
     Add a new collection item which can include a Scene or a resource (not a component)
     @method _onAddedContent
     @param {Event} e
     **/
    _onAddedContent(i_addContents: IAddContents) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippetCollection = jXML(domPlayerData).find('Fixed');
        var buff = '';
        if (Number(i_addContents.blockCode) == BlockLabels.BLOCKCODE_SCENE) {
            // add scene to collection, if block resides in scene don't allow cyclic reference to collection scene inside current scene
            if (this.blockPlacement == PLACEMENT_SCENE && this.m_blockData.scene.handle == i_addContents.sceneData.scene_id) {
                return bootbox.alert('You cannot display a scene in a collection that refers to itself, that is just weird');
            }
            var sceneName = i_addContents.sceneData.domPlayerDataJson.Player._label;
            var nativeId = i_addContents.sceneData.scene_native_id;
            buff = `<Page page="${sceneName}" type="scene" duration="5"> 
                        <Player src="${nativeId}" hDataSrc="${i_addContents.sceneData.scene_id}"/>
                    </page>`;
        } else {
            // Add resources to collection
            var resourceName = this.rp.getResourceRecord(i_addContents.resourceId).resource_name;
            buff = `<Page page="${resourceName}" type="resource" duration="5">
                            <Player player="${i_addContents.blockCode}">
                                <Data>
                                    <Resource hResource="${i_addContents.resourceId}"/>
                                </Data>
                            </Player>
                        </page>`
        }
        jXML(xSnippetCollection).append(jXML(buff));
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    private saveToStore() {
        // console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        // var domPlayerData = this.m_blockData.playerDataDom;
        // var xSnippet = jXML(domPlayerData).find('HTML');
        // xSnippet.attr('src', this.m_contGroup.value.url);
        // this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    destroy() {
    }
}

