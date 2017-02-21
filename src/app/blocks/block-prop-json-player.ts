import {AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild} from "@angular/core";
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
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    template: `
        <small class="debug">{{me}}</small>
        <form class="inner15" novalidate autocomplete="off" [formGroup]="contGroup">
            <div class="row">
                <ul class="list-group">
                    <!-- will need to support it later when usigng JSON Block -->
                    <li *ngIf="m_showJsonUrl" class="list-group-item">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <input pattern="[0-9]|[a-z]|[A-Z]+"
                                   type="text" class="form-control" minlength="3" maxlength="15"
                                   placeholder="JSON URL">
                        </div>
                    </li>
                    <li class="list-group-item">
                        Load with scene
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <!--<select #sceneSelection [(ngModel)]="m_sceneSeleced.id" style="height: 30px" (change)="_onSceneSelectionChanged($event.target.value)" formControlName="sceneSelection">-->
                                <!--<option [selected]="scene.selected" [value]="scene.sceneId" *ngFor="let scene of m_sceneSelection">{{scene.label}}</option>-->
                            <!--</select>-->
                            <p-dropdown [style]="{'width':'150px'}" (onChange)="_onSceneSelectionChanged($event)" [(ngModel)]="m_sceneSeleced" [options]="m_sceneSelection" [filter]="true" formControlName="sceneSelection"></p-dropdown>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>Play video to completion</span>
                        <div class="material-switch pull-right">
                            <input (change)="_onPlayVideoInFull(w1.checked)"
                                   [formControl]="contGroup.controls['playVideoInFull']"
                                   id="w1" #w1
                                   name="w1" type="checkbox"/>
                            <label for="w1" class="label-primary"></label>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>random playback</span>
                        <div class="material-switch pull-right">
                            <input (change)="_onRandomPlay(w2.checked)"
                                   [formControl]="contGroup.controls['randomOrder']"
                                   id="w2" #w2
                                   name="w2" type="checkbox"/>
                            <label for="w2" class="label-primary"></label>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>slideshow</span>
                        <div class="material-switch pull-right">
                            <input (change)="_onSlideShow(w3.checked)"
                                   [formControl]="contGroup.controls['slideShow']"
                                   id="w3" #w3
                                   name="w3" type="checkbox"/>
                            <label for="w3" class="label-primary"></label>
                        </div>
                    </li>
                    <li *ngIf="!m_slideShowMode" class="list-group-item">
                        <label i18n>On event take the following action</label>
                        <h4 class="panel-title" style="padding-bottom: 15px">
                            <button (click)="_onAddNewEvent()" type="button" title="add event" class="btn btn-default btn-sm">
                                <span class="fa fa-plus"></span>
                            </button>
                            <button (click)="_onRemoveEvent()"  type="button" title="remove event" class="btn btn-default btn-sm">
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
    private contGroup: FormGroup;
    private m_blockData: IBlockData;
    private m_showJsonUrl = false;
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

        this.contGroup = fb.group({
            'sceneSelection': [],
            'randomOrder': [],
            'slideShow': [],
            'playVideoInFull': [],
            'url': ['', [Validators.pattern(urlRegExp)]]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })


    }

    @ViewChild('simpleGrid')
    simpleGrid:SimpleGridTable;


    @Input()
    set setBlockData(i_blockData) {
        // if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
        //     this.m_blockData = i_blockData;
        //     this._render();
        // } else {
        //     this.m_blockData = i_blockData;
        // }
        this.m_blockData = i_blockData;
        this._render();
    }

    ngAfterViewInit() {
        this._render();
    }

    _onPlayVideoInFull(i_value) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        jQuery(xSnippet).attr('playVideoInFull', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onRandomPlay(i_value) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        jQuery(xSnippet).attr('randomOrder', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onSlideShow(i_value) {
        this.m_slideShowMode = i_value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('Json');
        jQuery(xSnippet).attr('slideShow', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onRemoveEvent(){
        var record:SimpleGridRecord = this.simpleGrid.getSelected();
        var domPlayerData = this.m_blockData.playerDataDom;
        $(domPlayerData).find('EventCommands').children().eq(record.index).remove();
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onAddNewEvent() {
        var domPlayerData = this.m_blockData.playerDataDom;
        var buff = '<EventCommand from="event" condition="" command="firstPage" />';
        $(domPlayerData).find('EventCommands').append($(buff));
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
        $(target).attr('command', event.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    _selectedAction() {
        return (a: StoreModel, b: StoreModel) => {
            return a.getKey('name') == b.getKey('action') ? 'selected' : '';
        }
    }

    private _onLabelEdited(event: ISimpleGridEdit, index) {
        console.log(event.value);
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = jQuery(domPlayerData).find('EventCommands').children().get(index);
        $(target).attr('from', event.value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    private _onUrlEdited(event: ISimpleGridEdit, index) {
        var url = event.value;
        var domPlayerData = this.m_blockData.playerDataDom;
        var target = $(domPlayerData).find('EventCommands').children().get(parseInt(index));
        $(target).find('Params').remove();
        $(target).append('<Params> <Url name="' + url + '" /></Params>');
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
                        // this.contGroup.controls['sceneSelection'].updateValueAndValidity(sceneId);
                    }

                    if (this.m_blockData.playerMimeName == mimeType) {
                        this.m_sceneSelection.push({
                            sceneId, label, mimeType, value: scenes[scene]
                        })
                    }
                }
                this.cd.detectChanges();
            }, (e) => console.error(e)) //cancelOnDestroy please
    }

    _render() {
        this.contGroup.reset();
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
    }

    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = jQuery(domPlayerData).find('HTML');
        xSnippet.attr('src', this.contGroup.value.url);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    private tableQty(field) {
        return field.product_count;
    }

    private getField(name) {
        return (storeModel: StoreModel) => {
            var value = storeModel.getKey(name);
            if (_.isEmpty(value))
                return "none"
            return value;
        }

    }

    private tablePrice(field) {
        return parseFloat(field.price);
    }

    destroy() {
        console.log('destroy html component');
    }
}
