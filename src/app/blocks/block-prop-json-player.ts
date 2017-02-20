import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {urlRegExp} from "../../Lib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-json-player',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <form class="inner15" novalidate autocomplete="off" [formGroup]="contGroup">
            <div class="row">
                <ul class="list-group">
                    <li class="list-group-item">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <input [formControl]="contGroup.controls['url']" required
                                   pattern="[0-9]|[a-z]|[A-Z]+"
                                   type="text" class="form-control" minlength="3" maxlength="15"
                                   placeholder="JSON URL">
                        </div>
                    </li>


                    <li class="list-group-item">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <input [formControl]="contGroup.controls['url']" required
                                   pattern="[0-9]|[a-z]|[A-Z]+"
                                   type="text" class="form-control" minlength="3" maxlength="15"
                                   placeholder="Object path">
                        </div>
                    </li>

                    <li class="list-group-item">
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-key"></i></span>
                            <input type="number" [formControl]="contGroup.controls['url']" min="0"
                                   class="form-control"
                                   placeholder="interval">
                        </div>
                    </li>


                    <li class="list-group-item">
                        Load with scene
                        <div class="input-group">
                            <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                            <select style="font-size: 1.5em" [formControl]="contGroup.controls['url']">
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                            </select>

                        </div>
                    </li>
                    <li class="list-group-item">
                        <span i18n>Play video to completion</span>
                        <div class="material-switch pull-right">
                            <input (change)="onFormChange(w1.checked)"
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

    constructor(private fb: FormBuilder, private rp: RedPepperService, private bs: BlockService, private ngmslibService: NgmslibService) {
        super();
        this.contGroup = fb.group({
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

    _render() {
        this.contGroup.reset();
        var domPlayerData = this.m_blockData.playerDataDom
        var xSnippet = jQuery(domPlayerData).find('HTML');
        this.formInputs['url'].setValue(xSnippet.attr('src'));
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
