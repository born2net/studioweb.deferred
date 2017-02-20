import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {urlRegExp} from "../../Lib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-weather',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <form novalidate autocomplete="off" class="inner5">
            <div class="row">
                <div *ngIf="!jsonMode">
                    <ul class="list-group">
                        <li class="list-group-item">
                            units
                            <input type="text" [formControl]="contGroup.controls['url']"/>
                        </li>
                        <li class="list-group-item">
                            style
                            <input type="text" [formControl]="contGroup.controls['url']"/>
                        </li>
                        <li class="list-group-item">
                            address / zip code
                            <input type="text" [formControl]="contGroup.controls['url']"/>
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
        // this.contGroup.reset();
        // var domPlayerData = this.m_blockData.playerDataDom
        // var xSnippet = jQuery(domPlayerData).find('HTML');
        // this.formInputs['url'].setValue(xSnippet.attr('src'));
    }

    ngAfterViewInit() {
        this._render();
    }


    destroy() {
    }
}
