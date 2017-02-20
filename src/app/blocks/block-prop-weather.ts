import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {IFontSelector} from "../../comps/font-selector/font-selector";
import {Lib, urlRegExp} from "../../Lib";
import * as _ from "lodash";


@Component({
    selector: 'block-prop-weather',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <form novalidate autocomplete="off">
            <div class="row">
                <div class="inner userGeneral">
                    <div class="panel panel-default tallPanel">
                        <div class="panel-heading">
                            <small class="release">web properties
                                <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
                            </small>
                            <small class="debug">{{me}}</small>
                        </div>
                        <div *ngIf="!jsonMode">
                            <ul style="padding-top: 20px; padding-bottom: 20px" class="list-group">
                                <li class="list-group-item">
                                    <ul style="padding-top: 20px; padding-bottom: 20px" class="list-group">
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
                                </li>
                            </ul>
                        </div>
                        <div *ngIf="jsonMode">
                            <ul style="padding-top: 20px; padding-bottom: 20px" class="list-group">
                                <li class="list-group-item">
                                    <h3>json</h3>
                                    <block-prop-json-player [setBlockData]="m_blockData"></block-prop-json-player>
                                </li>
                            </ul>
                        </div>
                    </div>
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

    private _render(){
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
