import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {urlRegExp} from "../../Lib";
import * as _ from "lodash";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Once} from "../../decorators/once-decorator";

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
                            <!--<select #sceneSelection [(ngModel)]="m_sceneSeleced.id" (change)="_onSceneSelectionChanged($event.target.value)" style="height: 30px" formControlName="sceneSelection">-->
                                <!--<option *ngFor="let scene of m_sceneSelection">{{scene.label}}</option>-->
                            <!--</select>-->

                            <select #sceneSelection [(ngModel)]="m_sceneSeleced.id" style="height: 30px" (change)="_onSceneSelectionChanged($event.target.value)"formControlName="sceneSelection">
                                <option [selected]="scene.selected" [value]="scene.sceneId" *ngFor="let scene of m_sceneSelection">{{scene.label}}</option>
                            </select>

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
                            <input (change)="onFormChange(w2.checked)"
                                   id="w2" #w2
                                   name="w2" type="checkbox"/>
                            <label for="w2" class="label-primary"></label>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>slideshow mode</span>
                        <div class="material-switch pull-right">
                            <input (change)="onFormChange(w2.checked)"
                                   id="w2" #w2
                                   name="w2" type="checkbox"/>
                            <label for="w2" class="label-primary"></label>
                        </div>
                    </li>
                    <li class="list-group-item">
                        <label data-localize="onEventTakeAction">On event take the following
                            action
                        </label>

                        <h4 class="panel-title" style="padding-bottom: 15px">
                            <button id="addJsonEvents" type="button" title="add event" class="btn btn-default btn-sm">
                                <span class="fa fa-plus"></span>
                            </button>
                            <button id="removeJsonEvents" type="button" title="remove event" class="btn btn-default btn-sm">
                                <span class="fa fa-minus"></span>
                            </button>
                        </h4>

                        <table id="jsonEventsTable" class="table table-no-bordered" data-sortable="false" data-search="false" data-mode="inline" data-show-columns="false" data-pagination="false" data-reorderable-rows="true" data-height="200">
                            <thead>
                            <tr>
                                <th data-field="state" data-radio="true" data-width="40px"></th>
                                <th data-field="event" data-editable="true" data-localize="event">event
                                </th>
                                <th data-field="action" data-type="number" data-formatter="BB.lib.jsonEventAction" data-halign="center" data-align="center" data-width="60px" data-localize="action">action
                                </th>
                                <th data-field="selectedPage" data-formatter="BB.lib.jsonEventActionGoToItem" class="collectionSelectedItem" data-type="number" data-halign="center" data-align="center" data-width="60px"
                                    data-localize="jsonURL">json url
                                </th>
                            </tr>
                            </thead>
                        </table>
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
    private m_sceneSeleced:any = {};

    constructor(private fb: FormBuilder, private yp: YellowPepperService, private rp: RedPepperService, private bs: BlockService, private cd: ChangeDetectorRef) {
        super();
        this.contGroup = fb.group({
            'sceneSelection': [],
            'playVideoInFull': [],
            'url': ['', [Validators.pattern(urlRegExp)]]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })
    }

    @Input()
    set setBlockData(i_blockData) {
        if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
            this.m_blockData = i_blockData;
            this._render();
        } else {
            this.m_blockData = i_blockData;
        }
    }

    ngAfterViewInit() {
        this._render();
    }

    _onPlayVideoInFull(i_value) {
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = $(domPlayerData).find('Json');
        $(xSnippet).attr('playVideoInFull', i_value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    _onSceneSelectionChanged(scene) {
        // var show = scene.getAttribute("data-id");
        console.log(this.contGroup.controls['sceneSelection'].value);
        /*
         if (!self.m_selected)
         return;
         //var listType = $(e.target).attr('name');
         //if (_.isUndefined(listType))
         //    return;
         var $selected = $(e.target).find(':selected');
         //var sceneName = $(e.target).text();
         var sceneID = $selected.attr('data-scene_id');
         var domPlayerData = self._getBlockPlayerData();
         var xSnippet = $(domPlayerData).find('Json');
         var xSnippetPlayer = $(xSnippet).find('Player');
         $(xSnippetPlayer).attr('hDataSrc', sceneID);
         BB.lib.log('assigning to scene ' + sceneID);
         self._setBlockPlayerData(domPlayerData, BB.CONSTS.NO_NOTIFICATION);
         */
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
                var xSnippet = $(domPlayerData).find('Json');
                var xSnippetPlayer = $(xSnippet).find('Player');
                var selectedSceneID = $(xSnippetPlayer).attr('hDataSrc');
                for (var scene in scenes) {
                    var mimeType = scenes[scene].mimeType;
                    var label = scenes[scene].label;
                    var sceneId = scenes[scene].id;
                    if (sceneId == selectedSceneID){
                        this.m_sceneSeleced = scenes[scene];
                        // this.contGroup.controls['sceneSelection'].updateValueAndValidity(sceneId);
                    }

                    if (this.m_blockData.playerMimeName == mimeType) {
                        this.m_sceneSelection.push({
                            sceneId, label, mimeType, selected: sceneId == selectedSceneID ? true : false
                        })
                    }
                }
                this.cd.detectChanges();
            }, (e) => console.error(e)) //cancelOnDestroy please


    }

    _render() {
        this.contGroup.reset();
        this._initSceneDropdown();
        var domPlayerData = this.m_blockData.playerDataDom
        var xSnippet = jQuery(domPlayerData).find('Json');
        var a = jQuery(xSnippet).attr('playVideoInFull');
        var playVideoInFull = StringJS(jQuery(xSnippet).attr('playVideoInFull')).booleanToNumber();
        this.formInputs['playVideoInFull'].setValue(playVideoInFull);

    }


    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        var domPlayerData = this.m_blockData.playerDataDom;
        var xSnippet = $(domPlayerData).find('HTML');
        xSnippet.attr('src', this.contGroup.value.url);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    destroy() {
        console.log('destroy html component');
    }
}
