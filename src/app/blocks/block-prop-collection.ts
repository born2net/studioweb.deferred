import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild} from "@angular/core";
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
import {PLACEMENT_LISTS} from "../../interfaces/Consts";

@Component({
    selector: 'block-prop-collection',
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
                    <span i18n>Kiosk mode</span><br/>
                    <button (click)="_onAddNewCollectionItem()" type="button" title="add event" class="btn btn-default btn-sm">
                        <span class="fa fa-plus"></span>
                    </button>
                    <button (click)="_onRemoveCollectionItem()" type="button" title="remove event" class="btn btn-default btn-sm">
                        <span class="fa fa-minus"></span>
                    </button>
                    <div class="material-switch pull-right">
                        <input #imageRatio (change)="_toggleKioskMode(imageRatio.checked)" [formControl]="m_contGroup.controls['mode']" id="imageRatio" name="imageRatio" type="checkbox"/>
                        <label for="imageRatio" class="label-primary"></label>
                    </div>
                </li>
                <li class="list-group-item">
                    <label i18n>Play collection in sequence</label>
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
                <li *ngIf="m_contGroup.controls['mode'].value == 1" class="list-group-item">
                    <json-event-grid [collectionList]="m_collectionList" [resources]="this.m_jsonEventResources" [showOption]="'page'" [setBlockData]="m_blockData"></json-event-grid>
                </li>
            </div>
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
export class BlockPropCollection extends Compbaser implements AfterViewInit {

    private formInputs = {};
    private m_contGroup: FormGroup;
    private m_blockData: IBlockData;

    m_PLACEMENT_LISTS = PLACEMENT_LISTS;
    m_collectionList: List<StoreModel>;
    m_jsonEventResources: Array<JsonEventResourceModel>;

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private bs: BlockService, private ngmslibService: NgmslibService) {
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
        var target = jXML(domPlayerData).find('Collection').children().get(newIndex);
        var source = jXML(domPlayerData).find('Collection').children().get(currentIndex);
        newIndex > currentIndex ? jXML(target).after(source) : jXML(target).before(source);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _onRemoveCollectionItem() {
        var record: SimpleGridRecord = this.simpleGrid.getSelected();
        if (_.isUndefined(record)) return;
        var rowIndex = this.simpleGrid.getSelected().index;
        var domPlayerData = this.m_blockData.playerDataDom;
        jXML(domPlayerData).find('Collection').children().eq(rowIndex).remove();
        // self._populateTableCollection(domPlayerData);
        this._populateTableEvents();
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    //todo: to be added collection insertion
    _onAddNewCollectionItem() {
        this._onAddNewBlock()
        // var domPlayerData = this.m_blockData.playerDataDom;
        // var buff = '<EventCommand from="event" condition="" command="firstPage" />';
        // jXML(domPlayerData).find('EventCommands').append(jXML(buff));
        // // domPlayerData = this.rp.xmlToStringIEfix(domPlayerData)
        // this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _onDurationEdited(event: ISimpleGridEdit, index) {
        var value = event.value;
        if (!Lib.IsNumber(value)) return;
        var domPlayerData = this.m_blockData.playerDataDom;
        var item = jXML(domPlayerData).find('Collection').children().get(index);
        jXML(item).attr('duration', value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onPageNameEdited(event: ISimpleGridEdit, index) {
        var value = event.value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var item = jXML(domPlayerData).find('Collection').children().get(index);
        jXML(item).attr('page', value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }


    _populateTableCollection() {
        this.m_collectionList = List([]);
        var domPlayerData = this.m_blockData.playerDataDom as any
        var rowIndex = 0;

        jXML(domPlayerData).find('Collection').children().each((k, page) => {
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

    /**
     Load event list to block props UI
     @method _populateTableEvents
     **/
    _populateTableEvents() {
        var data: Array<JsonEventResourceModel> = [], rowIndex = 0;
        var domPlayerData = this.m_blockData.playerDataDom;
        // self.m_collectionEventTable.bootstrapTable('removeAll');
        jXML(domPlayerData).find('EventCommands').children().each(function (k, eventCommand) {
            var pageName = '';
            if (jXML(eventCommand).attr('command') == 'selectPage')
                pageName = jXML(eventCommand).find('Page').attr('name');
            var storeModel = new JsonEventResourceModel({
                    rowIndex: rowIndex,
                    checkbox: true,
                    event: jXML(eventCommand).attr('from'),
                    pageName: pageName,
                    action: jXML(eventCommand).attr('command')
                }
            )
            data.push(storeModel)
            rowIndex++;
        });
        this.m_jsonEventResources = data;
    }

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
        var xSnippetCollection = jXML(domPlayerData).find('Collection');
        var mode = jXML(xSnippetCollection).attr('mode') == 'kiosk' ? 1 : 0;
        this.formInputs['mode'].setValue(mode);
        this._populateTableCollection();
        this._populateTableEvents();
        this.cd.markForCheck();
    }

    _toggleKioskMode(i_value) {
        i_value = StringJS(i_value).booleanToNumber()
        var domPlayerData = this.m_blockData.playerDataDom;
        jXML(domPlayerData).find('Collection').attr('mode', i_value ? 'kiosk' : 'slideshow');
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    /**
     Add a new collection item which can include a Scene or a resource (not a component)
     @method _onAddedContent
     @param {Event} e
     **/
    _onAddedContent(i_addContents:IAddContents) {
        // console.log(i_addContents);
        // var domPlayerData = self._getBlockPlayerData();
        // var xSnippetCollection = $(domPlayerData).find('Collection');
        // var buff = '';
        // // log(e.edata.blockCode, e.edata.resourceID, e.edata.sceneID);
        // if (e.edata.blockCode == BB.CONSTS.BLOCKCODE_SCENE) {
        //     // add scene to collection
        //     // if block resides in scene don't allow cyclic reference to collection scene inside current scene
        //     if (self.m_placement == BB.CONSTS.PLACEMENT_SCENE) {
        //         var sceneEditView = BB.comBroker.getService(BB.SERVICES['SCENE_EDIT_VIEW']);
        //         if (!_.isUndefined(sceneEditView)) {
        //             var selectedSceneID = sceneEditView.getSelectedSceneID();
        //             selectedSceneID = pepper.getSceneIdFromPseudoId(selectedSceneID);
        //             if (selectedSceneID == e.edata.sceneID) {
        //                 bootbox.alert($(Elements.MSG_BOOTBOX_SCENE_REFER_ITSELF).text());
        //                 return;
        //             }
        //         }
        //     }
        //     var sceneRecord = pepper.getScenePlayerRecord(e.edata.sceneID);
        //     var sceneName = $(sceneRecord.player_data_value).attr('label');
        //     var nativeID = sceneRecord['native_id'];
        //     buff = '<Page page="' + sceneName + '" type="scene" duration="5">' +
        //         '<Player src="' + nativeID + '" hDataSrc="' + e.edata.sceneID + '" />' +
        //         '</page>';
        // } else {
        //     // Add resources to collection
        //     var resourceName = pepper.getResourceRecord(e.edata.resourceID).resource_name;
        //     log('updating hResource ' + e.edata.resourceID);
        //     buff = '<Page page="' + resourceName + '" type="resource" duration="5">' +
        //         '<Player player="' + e.edata.blockCode + '">' +
        //         '<Data>' +
        //         '<Resource hResource="' + e.edata.resourceID + '" />' +
        //         '</Data>' +
        //         '</Player>' +
        //         '</page>';
        // }
        // $(xSnippetCollection).append($(buff));
        // self._setBlockPlayerData(pepper.xmlToStringIEfix(domPlayerData), BB.CONSTS.NO_NOTIFICATION, true);
        // self._populateTableEvents();
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

