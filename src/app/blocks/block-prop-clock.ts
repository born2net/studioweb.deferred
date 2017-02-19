import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'block-prop-clock',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div>
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
                            <ul style="padding-top: 20px; padding-bottom: 20px" class="list-group">
                                <li class="list-group-item">
                                    <div id="blockClockCommonProperties">
                                        <span data-localize="chooseFormat">Choose format</span>
                                        <div class="radio" *ngFor="let item of m_clockFormats">
                                            <label>
                                                <input type="radio" name="options" (click)="m_model.options = item; _onFormatChanged($event)" [checked]="item === m_model.options"
                                                       value="longDateAndTime">
                                                {{item}}
                                            </label>
                                        </div>
                                        <div id="clockFontSettings"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <font-selector></font-selector>
        <h5>block id {{m_blockData.blockID}}</h5>
    `
})
export class BlockPropClock extends Compbaser implements AfterViewInit {

    private m_blockData: IBlockData;
    m_model = {options: '3/21/18'};
    m_clockFormats = ['Friday, Mar 21 2018 at 8:59AM', 'Friday, Mar 21 2018', 'Friday 9:10 AM', '3/21/18', '9:00:39 AM']

    constructor(private fb: FormBuilder, private rp: RedPepperService, private bs: BlockService) {
        super();
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

    _onFormatChanged(e) {
        console.log(this.m_model.options);
    }

    ngAfterViewInit() {
        this._render();
    }

    _render() {
        // this.contGroup.reset();
        // var domPlayerData = this.m_blockData.playerDataDom
        // var xSnippet = jQuery(domPlayerData).find('HTML');
        // this.formInputs['url'].setValue(xSnippet.attr('src'));
    }


    // private saveToStore() {
    //     // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
    //     if (this.contGroup.status != 'VALID')
    //         return;
    //     var domPlayerData = this.m_blockData.playerDataDom;
    //     var xSnippet = $(domPlayerData).find('HTML');
    //     xSnippet.attr('src', this.contGroup.value.url);
    //     this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    // }

    destroy() {
        console.log('destroy html component');
    }
}
