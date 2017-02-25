import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-collection',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `

        <small class="debug">{{me}}</small>
        <form novalidate autocomplete="off" class="inner5" [formGroup]="m_contGroup">
            <div class="row">
                <li class="list-group-item">
                    <span i18n>Kiosk mode</span><br/>
                    <button type="button" title="add a new item" data-localize="empty" class="btn btn-default btn-sm">
                        <span class="fa fa-plus"></span>
                    </button>
                    <button type="button" title="remove item" data-localize="empty" class="btn btn-default btn-sm">
                        <span class="fa fa-minus"></span>
                    </button>
                    <div class="material-switch pull-right">
                        <input #imageRatio (change)="_toggleKioskMode(imageRatio.checked)"
                               [formControl]="m_contGroup.controls['mode']"
                               id="imageRatio"
                               name="imageRatio" type="checkbox"/>
                        <label for="imageRatio" class="label-primary"></label>
                    </div>
                </li>
                <li class="list-group-item">
                    <label i18n>Play this list in a sequential order</label>
                </li>
                <li *ngIf="m_contGroup.controls['mode'].value == 1" class="list-group-item">
                    <button (click)="_onAddNewEvent()" type="button" title="add a new item" class="btn btn-default btn-sm">
                        <span class="fa fa-plus"></span>
                    </button>
                    <button (click)="_onRemoveEvent()" type="button" title="remove item" class="btn btn-default btn-sm">
                        <span class="fa fa-minus"></span>
                    </button>
                    <br/>
                    <label i18n>On event take the following action</label>
                    <!--<div style="overflow-x: scroll">-->
                        <!--<div style="width: 600px">-->
                            <!--<simpleGridTable #simpleGrid>-->
                                <!--<thead>-->
                                <!--<tr>-->
                                    <!--<th>event</th>-->
                                    <!--<th>action</th>-->
                                    <!--<th>url</th>-->
                                <!--</tr>-->
                                <!--</thead>-->
                                <!--<tbody>-->
                                <!--<tr class="simpleGridRecord" simpleGridRecord *ngFor="let item of m_events; let index=index" [item]="item" [index]="index">-->
                                    <!--<td style="width: 30%" [editable]="true" (labelEdited)="_onLabelEdited($event,index)" field="event" simpleGridData [item]="item"></td>-->
                                    <!--<td style="width: 35%" simpleGridDataDropdown [testSelection]="_selectedAction()" (changed)="_setAction($event,index)" field="name" [item]="item" [dropdown]="m_actions"></td>-->
                                    <!--<td style="width: 35%" [editable]="true" (labelEdited)="_onUrlEdited($event,index)" field="url" simpleGridData [item]="item"></td>-->
                                <!--</tr>-->
                                <!--</tbody>-->
                            <!--</simpleGridTable>-->
                        <!--</div>-->
                    <!--</div>-->
                </li>
            </div>
        </form>
        <h5>block id {{m_blockData.blockID}}</h5>
    `
})
export class BlockPropCollection extends Compbaser implements AfterViewInit {

    private formInputs = {};
    private m_contGroup: FormGroup;
    private m_blockData: IBlockData;

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private bs: BlockService, private ngmslibService: NgmslibService) {
        super();
        this.m_contGroup = fb.group({
            'mode': [0]
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
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
        this.m_contGroup.reset();
        var domPlayerData = this.m_blockData.playerDataDom
        var xSnippetCollection = $(domPlayerData).find('Collection');
        var mode = $(xSnippetCollection).attr('mode') == 'kiosk' ? 1 : 0;
        this.formInputs['mode'].setValue(mode);
        this.cd.markForCheck();
    }

    _toggleKioskMode(i_value) {
        i_value = StringJS(i_value).booleanToNumber()
        var domPlayerData = this.m_blockData.playerDataDom;
        $(domPlayerData).find('Collection').attr('mode', i_value ? 'kiosk' : 'slideshow');
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData)
    }

    private saveToStore() {
        // console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        // var domPlayerData = this.m_blockData.playerDataDom;
        // var xSnippet = $(domPlayerData).find('HTML');
        // xSnippet.attr('src', this.m_contGroup.value.url);
        // this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    destroy() {
    }
}

