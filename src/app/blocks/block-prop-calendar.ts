import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {Compbaser, NgmslibService} from "ng-mslib";
import * as _ from "lodash";
import {Lib} from "../../Lib";

@Component({
    selector: 'block-prop-calendar',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <form novalidate autocomplete="off" class="inner5" [formGroup]="m_contGroup">
            <div class="row">
                <div *ngIf="!jsonMode">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <span i18n>token</span>
                            <input (blur)="_getGoogleCalendars()" type="text" [formControl]="m_contGroup.controls['token']"/>
                        </li>
                        <li class="list-group-item">
                            <button i18n class="btn btn-default" (click)="_onCreateToken()">create instagram token</button>
                        </li>
                        <li class="list-group-item">
                            <span i18n>Load with calendar</span>
                            <div class="input-group">
                                <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                <select #sceneSelection (change)="_onCalSelected($event)"  style="height: 30px" formControlName="calSelection">
                                    <option [value]="cal.id" *ngFor="let cal of m_calList">{{cal.label}}</option>
                                </select>

                            </div>
                        </li>
                    </ul>
                </div>
                <div *ngIf="jsonMode">
                    <block-prop-json-player [setBlockData]="m_blockData"></block-prop-json-player>
                </div>
            </div>
        </form>
    `
})
export class BlockPropCalendar extends Compbaser implements AfterViewInit {
    m_formInputs = {};
    m_contGroup: FormGroup;
    m_blockData: IBlockData;
    m_calList = [];
    m_calSeleced: any = {};

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private bs: BlockService, private ngmslibService: NgmslibService) {
        super();
        this.m_contGroup = fb.group({
            'token': [''],
            'calSelection': ['']
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.m_formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })
    }

    @Input() jsonMode: boolean;

    @Input()
    set setBlockData(i_blockData) {
        if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
            this.m_blockData = i_blockData;
            this._render();
        } else {
            this.m_blockData = i_blockData;
        }
    }

    _onCalSelected(value) {
        console.log(value.target.value);
    }

    private _render() {
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom
        var $data = $(domPlayerData).find('Json').find('Data');
        this.m_formInputs['token'].setValue($data.attr('token'));
        this._getGoogleCalendars();
        this.cd.markForCheck();
    }

    _getGoogleCalendars() {
        var self = this;
        try {
            jQuery.ajax({
                url: `https://secure.digitalsignage.com/GoogleCalendarList/${self.m_contGroup.value.token}/100`,
                dataType: "json",
                type: "post",
                complete: function (response, status) {
                    self.m_calSeleced = {};
                    self.m_calList = [];
                    if (_.isUndefined(response.responseText) || response.responseText.length == 0)
                        return;
                    var jData = JSON.parse(response.responseText);
                    _.forEach(jData, function (k: any, idx) {
                        self.m_calList.push({
                            id: k.id,
                            label: k.summary
                        })
                    });
                    var id = self._getFileId();
                    if (id && id.length > 10)
                        self.m_calSeleced = self.m_calList.find(item => item.id == id);
                    self.m_formInputs['calSelection'].setValue(self.m_calSeleced.id);
                    // self.m_calSeleced = _.random(0,2);
                    self.cd.markForCheck()
                },
                error: function (jqXHR, exception) {
                    console.error(jqXHR, exception);
                }
            });
        } catch (e) {
            console.error('error on ajax' + e);
        }
    }

    private _getFileId(): string {
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        var item = $(domPlayerData).find('Json').find('Data');
        return $(item).attr('id');
    }

    _onSceneCalSelectionChanged() {

    }

    ngAfterViewInit() {
        this._render();
    }

    _onCreateToken() {
        var win = window.open('http://google.signage.me', '_blank');
        if (win) {
            win.focus();
        } else {
            bootbox.alert('Browser popups are blocked, please enable and try again');
        }
    }

    private saveToStore() {
        // Lib.Con(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        // var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        // var item = jQuery(domPlayerData).find('Json').find('Data');
        // jQuery(item).attr('token', this.m_contGroup.value.token);
        // this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    destroy() {
    }
}
