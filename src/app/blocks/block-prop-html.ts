import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser, NgmslibService} from "ng-mslib";
import * as _ from "lodash";
import {simpleRegExp, urlRegExp} from "../../Lib";

@Component({
    selector: 'block-prop-html',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div>
            <form novalidate autocomplete="off" [formGroup]="contGroup">
                <div class="row">
                    <div class="inner userGeneral">
                        <div class="panel panel-default tallPanel">
                            <div class="panel-heading">
                                <small class="release">web properties
                                    <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
                                </small>
                                <small class="debug">{{me}}</small>
                            </div>
                            <ul style="padding-top: 20px; padding-bottom: 20px" class="list-group">
                                <li class="list-group-item">
                                    url address
                                    <input type="text" [formControl]="contGroup.controls['url']"/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <h5>block id {{m_blockData.blockID}}</h5>
    `
})
export class BlockPropHtml extends Compbaser implements AfterViewInit {

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
