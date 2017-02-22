import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {simpleRegExp} from "../../Lib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-weather',
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
                            <label>Units</label>
                            <br/>
                            <input (change)="_onRadioChanged('unit',$event)" type="radio" value="F" name="units" formControlName="units">
                            Fahrenheit
                            <br/>
                            <input (change)="_onRadioChanged('unit',$event)" type="radio" value="C" name="units" formControlName="units">
                            Celsius
                        </li>
                        <li class="list-group-item">
                            <label>Styles</label>
                            <br/>
                            <input (change)="_onRadioChanged('color',$event)" type="radio" value="1" name="colors" formControlName="colors">
                            Black
                            <br/>
                            <input (change)="_onRadioChanged('color',$event)" type="radio" value="2" name="colors" formControlName="colors">
                            White
                            <br/>
                            <input (change)="_onRadioChanged('color',$event)" type="radio" value="3" name="colors" formControlName="colors">
                            Color
                        </li>
                        <li class="list-group-item">
                            address / zip code
                            <input type="text" [formControl]="m_contGroup.controls['address']"/>
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
export class BlockPropWeather extends Compbaser implements AfterViewInit {

    _onRadioChanged(source, event) {
        var value = event.target.value;
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        var item = jQuery(domPlayerData).find('Json').find('Data');
        source == 'unit' ? jQuery(item).attr('unit', value) : jQuery(item).attr('style', value);
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    m_formInputs = {};
    m_contGroup: FormGroup;
    m_blockData: IBlockData;
    m_unit = 'F'
    m_style = '0';
    radioItems = 'one two three'.split(' ');
    model = {options: 'three'};

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private bs: BlockService, private ngmslibService: NgmslibService) {
        super();
        this.m_contGroup = fb.group({
            'colors': "",
            'units': "",
            'address': ['', [Validators.pattern(simpleRegExp)]]
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

    private _render() {
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom
        var $data = $(domPlayerData).find('Json').find('Data');
        this.m_unit = $data.attr('unit');
        this.m_style = String($data.attr('style'));
        var address = $data.attr('address');
        this.m_formInputs['units'].setValue(this.m_unit);
        this.m_formInputs['colors'].setValue(this.m_style);
        this.m_formInputs['address'].setValue(address);
        this.cd.markForCheck();

    }

    ngAfterViewInit() {
        this._render();
    }

    private saveToStore() {
        console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        // var item = jQuery(domPlayerData).find('Json').find('Data');
        // try {
        //     jQuery(item).attr('style', this.m_contGroup.value.color.value);
        //     jQuery(item).attr('address', this.m_contGroup.value.address);
        //     this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
        // }  catch(e){}
        //
        // try {
        //     jQuery(item).attr('unit', this.m_contGroup.value.units.value);
        //     jQuery(item).attr('address', this.m_contGroup.value.address);
        //     this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
        // }  catch(e){}

    }

    destroy() {
    }
}


