import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Subject} from "rxjs";

@Component({
    selector: 'font-selector',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="release">
            <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
        </small>
        <small class="debug">{{me}}</small>
        <div id="fontSelectorTemplate">
            <div class="form-group">
                <select name="fontSelection" class="fontSelection propControlWidth form-control">
                </select>
                <div>
                    <button type="button" name="bold" class="fontFormatter btn btn-default btn-sm">
                        <i class="gencons fa fa-bold"></i>
                    </button>
                    <button type="button" name="underline" class="fontFormatter btn btn-default btn-sm">
                        <i class="gencons fa fa-underline"></i>
                    </button>
                    <button type="button" name="italic" class="fontFormatter btn btn-default btn-sm">
                        <i class="gencons fa fa-italic"></i>
                    </button>
                </div>
                <div style="clear: both; padding: 3px"></div>

                <button #borderColor (colorPickerChange)="m_borderColorChanged.next($event)"
                        [cpOKButton]="true" [cpOKButtonClass]="'btn btn-primary btn-xs'"
                        [(colorPicker)]="m_color" [cpPosition]="'bottom'"
                        [cpAlphaChannel]="'disabled'" class="colorPicker"
                        [style.background]="m_color" [value]="m_color"></button>

                <div>
                    <div style="float: left">
                        <input name="fontSizeInput" type="number" value="123" style="width: 60px">

                        <!--<div class="spinner-buttons	btn-group btn-group-vertical">-->
                        <!--<button type="button" name="fontSizeUp" class="squareButton btn spinner-up">-->
                        <!--<i class="fa fa-chevron-up"></i>-->
                        <!--</button>-->
                        <!--<button type="button" name="fontSizeDown" class="squareButton btn spinner-down">-->
                        <!--<i class="fa fa-chevron-down"></i>-->
                        <!--</button>-->
                        <!--</div>-->
                    </div>
                    <button type="button" name="alignLeft" class="fontAlignment active btn btn-default btn-sm">
                        <i class="gencons fa fa-align-left"></i>
                    </button>
                    <button type="button" name="alignCenter" class="fontAlignment btn btn-default btn-sm">
                        <i class="gencons fa fa-align-center"></i>
                    </button>
                    <button type="button" name="alignRight" class="fontAlignment btn btn-default btn-sm">
                        <i class="gencons fa fa-align-right"></i>
                    </button>
                </div>
            </div>
        </div>

    `,
    styles: [`
        input {
            height: 30px;
        }
        button {
            margin: 5px;
            height: 30px;
        }

        .colorPicker {
            width: 20px;
            float: left;
            display: inline-block;
            margin: 0 10px 0 0;
            padding: 15px 45px;
            border-radius: 0;
            border: 1px solid gray;
            background: #ffffff;
            padding: 10px 20px 10px 20px;
            text-decoration: none;
            text-decoration: none;
        }
    `]

})
export class FontSelector extends Compbaser implements AfterViewInit {

    private m_borderColorChanged = new Subject();
    m_color;

    constructor(private yp: YellowPepperService) {
        super();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}