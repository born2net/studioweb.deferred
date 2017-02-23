import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser} from "ng-mslib";
import {urlRegExp} from "../../Lib";
import * as _ from "lodash";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Once} from "../../decorators/once-decorator";
import {StoreModel} from "../../store/model/StoreModel";
import {Map, List} from 'immutable';
import {ISimpleGridEdit} from "../../comps/simple-grid-module/SimpleGrid";
import {SimpleGridTable} from "../../comps/simple-grid-module/SimpleGridTable";
import {SimpleGridRecord} from "../../comps/simple-grid-module/SimpleGridRecord";

@Component({
    selector: 'block-prop-json-player',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'(input-blur)': 'saveToStore($event)'},
    template: `
        <small class="debug">{{me}}</small>
        <form class="inner15" novalidate autocomplete="off" [formGroup]="m_contGroup">
            <div class="row">
                <ul class="list-group">                    
                    <li *ngIf="standAlone" class="list-group-item">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <input type="text" class="form-control" minlength="3" placeholder="json url" [formControl]="m_contGroup.controls['itemsUrl']">
                        </div>
                    </li>
                    <li *ngIf="standAlone" class="list-group-item">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <input type="text" class="form-control" minlength="3" placeholder="object path" [formControl]="m_contGroup.controls['itemsPath']">
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>load with scene</span>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <p-dropdown [style]="{'width':'220px'}" (onChange)="_onSceneSelectionChanged($event)" [(ngModel)]="m_sceneSeleced" [options]="m_sceneSelection" [filter]="true" formControlName="sceneSelection"></p-dropdown>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <label i18n>interval</label><br/>
                        <input style="width: 268px" type="number" min="1" [formControl]="m_contGroup.controls['itemInterval']"/>
                    </li>
                    <li class="list-group-item">
                        <span i18n>play video to completion</span>
                        <div class="material-switch pull-right">
                            <input (change)="_onPlayVideoInFull(playVideoInFull.checked)"
                                   [formControl]="m_contGroup.controls['playVideoInFull']"
                                   id="playVideoInFull" #playVideoInFull
                                   name="playVideoInFull" type="checkbox"/>
                            <label for="playVideoInFull" class="label-primary"></label>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>random playback</span>
                        <div class="material-switch pull-right">
                            <input (change)="_onRandomPlay(randomOrder.checked)"
                                   [formControl]="m_contGroup.controls['randomOrder']"
                                   id="randomOrder" #randomOrder
                                   name="randomOrder" type="checkbox"/>
                            <label for="randomOrder" class="label-primary"></label>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>slideshow</span>
                        <div class="material-switch pull-right">
                            <input (change)="_onSlideShow(slideShow.checked)"
                                   [formControl]="m_contGroup.controls['slideShow']"
                                   id="slideShow" #slideShow
                                   name="slideShow" type="checkbox"/>
                            <label for="slideShow" class="label-primary"></label>
                        </div>
                    </li>
                    <li *ngIf="!m_slideShowMode" class="list-group-item">
                        <label i18n>On event take the following action</label>
                        <h4 class="panel-title" style="padding-bottom: 15px">
                            <button (click)="_onAddNewEvent()" type="button" title="add event" class="btn btn-default btn-sm">
                                <span class="fa fa-plus"></span>
                            </button>
                            <button (click)="_onRemoveEvent()" type="button" title="remove event" class="btn btn-default btn-sm">
                                <span class="fa fa-minus"></span>
                            </button>
                        </h4>
                        <div style="overflow: scroll;  height: 300px">
                            <div style="width: 600px">
                                <simpleGridTable #simpleGrid>
                                    <thead>
                                    <tr>
                                        <th>event</th>
                                        <th>action</th>
                                        <th>url</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr class="simpleGridRecord" simpleGridRecord *ngFor="let item of m_events; let index=index" [item]="item" [index]="index">
                                        <td style="width: 30%" [editable]="true" (labelEdited)="_onLabelEdited($event,index)" field="event" simpleGridData [item]="item"></td>
                                        <td style="width: 35%" simpleGridDataDropdown [testSelection]="_selectedAction()" (changed)="_setAction($event,index)" field="name" [item]="item" [dropdown]="m_actions"></td>
                                        <td style="width: 35%" [editable]="true" (labelEdited)="_onUrlEdited($event,index)" field="url" simpleGridData [item]="item"></td>
                                    </tr>
                                    </tbody>
                                </simpleGridTable>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </form>

    `
})
export class BlockPropJsonPlayer extends Compbaser implements AfterViewInit {

    private formInputs = {};
    private m_contGroup: FormGroup;
    private m_blockData: IBlockData;
    private m_sceneSelection = [];
    private m_sceneSeleced: any = {};
    private m_events: List<StoreModel>;
    private m_slideShowMode = 0;
    private m_actions: List<StoreModel>;


    constructor(private fb: FormBuilder, private yp: YellowPepperService, private rp: RedPepperService, private bs: BlockService, private cd: ChangeDetectorRef) {
        super();
        this.m_actions = List([
            new StoreModel({name: 'firstPage'}),
            new StoreModel({name: 'nextPage'}),
            new StoreModel({name: 'prevPage'}),
            new StoreModel({name: 'lastPage'}),
            new StoreModel({name: 'loadUrl'})
        ]);

        this.m_contGroup = fb.group({
            'sceneSelection': [],
            'randomOrder': [],
            'slideShow': [],
            'playVideoInFull': [],
            'itemInterval': [],
            'itemsPath': [],
            'itemsUrl': ['', [Validators.pattern(urlRegExp)]],
            'url': ['', [Validators.pattern(urlRegExp)]]
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })
    }

    @ViewChild('simpleGrid')
    simpleGrid: SimpleGridTable;

    @Input() standAlone: boolean = false;


    @Input()
    set setBlockData(i_blockData) {
        /**
         Disabled as in this component we wish to always update UI on block changes
         since we are addinf and removing elements to event grid and need to be updated
         if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
              this.m_blockData = i_blockData;
             this._render();
          } else {
              this.m_blockData = i_blockData;
         }
         **/
        this.m_blockData = i_blockData;
        this._render();
    }

    ngAfterViewInit() {
        this._render();
    }

    _onPlayVideoInFull(i_value) {
        i_value = StringJS(i_value).booleanToNumber()
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        jQuery(xSnippet).attr('playVideoInFull', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onRandomPlay(i_value) {
        i_value = StringJS(i_value).booleanToNumber()
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        jQuery(xSnippet).attr('randomOrder', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onSlideShow(i_value) {
        i_value = StringJS(i_value).booleanToNumber()
        this.m_slideShowMode = i_value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        jQuery(xSnippet).attr('slideShow', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onRemoveEvent() {
        var record: SimpleGridRecord = this.simpleGrid.getSelected();
        if (_.isUndefined(record)) return;
        var domPlayerData = this.m_blockData.playerDataDom;
        jQuery(domPlayerData).find('EventCommands').children().eq(record.index).remove();
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onAddNewEvent() {
        var domPlayerData = this.m_blockData.playerDataDom;
        var buff = '<EventCommand from="event" condition="" command="firstPage" />';
        jQuery(domPlayerData).find('EventCommands').append(jQuery(buff));
        domPlayerData = this.rp.xmlToStringIEfix(domPlayerData)
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData, true);
    }

    _onSceneSelectionChanged(i_scene_id) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        var xSnippetPlayer = jQuery(xSnippet).find('Player');
        jQuery(xSnippetPlayer).attr('hDataSrc', i_scene_id.value.id);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    /**
     Load event list to block props UI
     @method _initEventTable
     **/
    _initEventTable() {
        var rowIndex = 0;
        var domPlayerData = this.m_blockData.playerDataDom;
        var events = [];
        jQuery(domPlayerData).find('EventCommands').children().each((k, eventCommand) => {
            var url = '';
            if (jQuery(eventCommand).attr('command') == 'loadUrl')
                url = jQuery(eventCommand).find('Url').attr('name');
            if (_.isUndefined(url) || _.isEmpty(url))
                url = '---';
            var storeModel = new StoreModel({
                event: jQuery(eventCommand).attr('from'),
                url: url,
                action: jQuery(eventCommand).attr('command')
            });
            events.push(storeModel)
            rowIndex++;
        });
        this.m_events = List(events)
    }

    _setAction(event: ISimpleGridEdit, index: number) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(index);
        jQuery(target).attr('command', event.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _selectedAction() {
        return (a: StoreModel, b: StoreModel) => {
            return a.getKey('name') == b.getKey('action') ? 'selected' : '';
        }
    }

    private _onLabelEdited(event: ISimpleGridEdit, index) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(index);
        jQuery(target).attr('from', event.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    private _onUrlEdited(event: ISimpleGridEdit, index) {
        var url = event.value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(parseInt(index));
        jQuery(target).find('Params').remove();
        jQuery(target).append('<Params> <Url name="' + url + '" /></Params>');
        domPlayerData = this.rp.xmlToStringIEfix(domPlayerData);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData, true);
    }

    /**
     Populate the LI with all available scenes from msdb
     if the mimetype is empty (used for this class) we show all scenes in dropdown, but if mimetype exists
     (used by subclasses of this class) we filter dropdown list by matching mimetypes
     @method _populateSceneDropdown
     **/
    @Once()
    private _initSceneDropdown() {
        var self = this;
        return this.yp.getSceneNames()
            .subscribe((scenes) => {
                this.m_sceneSelection = [];
                var domPlayerData = this.m_blockData.playerDataDom;
                var xSnippet = jQuery(domPlayerData).find('Json');
                var xSnippetPlayer = jQuery(xSnippet).find('Player');
                var selectedSceneID = jQuery(xSnippetPlayer).attr('hDataSrc');
                for (var scene in scenes) {
                    var mimeType = scenes[scene].mimeType;
                    var label = scenes[scene].label;
                    var sceneId = scenes[scene].id;
                    if (sceneId == selectedSceneID) {
                        this.m_sceneSeleced = scenes[scene];
                    }
                    // if this component is used as a standalone Json Player, include in drop down all possible scenes
                    if (self.m_blockData.playerMimeScene == mimeType || this.standAlone) {
                        this.m_sceneSelection.push({
                            sceneId, label, mimeType, value: scenes[scene]
                        })
                    }
                }
            }, (e) => console.error(e))
    }

    _render() {
        this._initSceneDropdown();
        this._initEventTable();
        var domPlayerData = this.m_blockData.playerDataDom
        var xSnippet = jQuery(domPlayerData).find('Json');
        var playVideoInFull = StringJS(jQuery(xSnippet).attr('playVideoInFull')).booleanToNumber();
        this.formInputs['playVideoInFull'].setValue(playVideoInFull);
        var randomOrder = StringJS(jQuery(xSnippet).attr('randomOrder')).booleanToNumber();
        this.formInputs['randomOrder'].setValue(randomOrder);
        this.m_slideShowMode = StringJS(jQuery(xSnippet).attr('slideShow')).booleanToNumber(true) as number;
        this.formInputs['slideShow'].setValue(this.m_slideShowMode);
        this.formInputs['itemsPath'].setValue(jQuery(xSnippet).attr('itemsPath'));
        this.formInputs['itemInterval'].setValue(jQuery(xSnippet).attr('itemInterval'));
        this.formInputs['itemsUrl'].setValue(jQuery(xSnippet).attr('url'));
    }

    private saveToStore() {
        if (this.m_contGroup.status != 'VALID')
            return;
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        xSnippet.attr('itemsPath', this.m_contGroup.value.itemsPath);
        xSnippet.attr('url', this.m_contGroup.value.itemsUrl);
        xSnippet.attr('itemInterval', this.m_contGroup.value.itemInterval);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }
    
    destroy() {
    }
}
