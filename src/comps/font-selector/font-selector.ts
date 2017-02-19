import {Component, ChangeDetectionStrategy, AfterViewInit, Input, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Subject} from "rxjs";
import {FontLoaderService} from "../../services/font-loader-service";

export interface IFontSelector {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    alignment: 'left' | 'center' | 'right',
    font: string;
    color: string;
    size: number;
}


@Component({
    selector: 'font-selector',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <div id="fontSelectorTemplate">
            <div class="form-group">
                <select (change)="_onFontChanged($event)" name="fontSelection" class="fontSelection propControlWidth form-control">
                    <option [selected]="font==m_config.font" *ngFor="let font of m_fonts">
                        {{font}}
                    </option>
                </select>
                <div>
                    <div class="btn-group" role="group" aria-label="...">
                        <button (click)="_onFontStyleToggle('bold')" type="button" name="bold" class="fontFormatter btn btn-default btn-sm" [ngClass]="{active: m_config.bold}">
                            <i class="gencons fa fa-bold"></i>
                        </button>
                        <button (click)="_onFontStyleToggle('underline')" type="button" name="underline" class="fontFormatter btn btn-default btn-sm" [ngClass]="{active: m_config.underline}">
                            <i class="gencons fa fa-underline"></i>
                        </button>
                        <button (click)="_onFontStyleToggle('italic')" type="button" name="italic" class="fontFormatter btn btn-default btn-sm" [ngClass]="{active: m_config.italic}">
                            <i class="gencons fa fa-italic"></i>
                        </button>
                        <button #borderColor (colorPickerChange)="m_borderColorChanged.next($event)"
                                [cpOKButton]="true" [cpOKButtonClass]="'btn btn-primary btn-xs'"
                                [(colorPicker)]="m_config.color" [cpPosition]="'bottom'" style="width: 59px"
                                [cpAlphaChannel]="'disabled'" class="colorPicker offSet"
                                [style.background]="m_config.color" [value]="m_config.color">
                        </button>
                    </div>
                    <div class="btn-group" role="group" aria-label="...">
                        <button (click)="_onAlignmentChange('left')" type="button" name="alignLeft" class="fontAlignment btn btn-default btn-sm" [ngClass]="{active: m_config.alignment == 'left'}">
                            <i class="gencons fa fa-align-left"></i>
                        </button>
                        <button (click)="_onAlignmentChange('center')" type="button" name="alignCenter" class="fontAlignment btn btn-default btn-sm" [ngClass]="{active: m_config.alignment == 'center'}">
                            <i class="gencons fa fa-align-center"></i>
                        </button>
                        <button (click)="_onAlignmentChange('right')" type="button" name="alignRight" class="fontAlignment btn btn-default btn-sm" [ngClass]="{active: m_config.alignment == 'right'}">
                            <i class="gencons fa fa-align-right"></i>
                        </button>
                        <input (change)="_onFontSizeChanged(fontSize.value)" #fontSize class="offSet" name="fontSizeInput" type="number" [(ngModel)]="m_config.size" style="width: 60px">

                    </div>
                </div>
                <div style="clear: both; padding: 3px"></div>
                <div>
                </div>
            </div>
        </div>

    `,
    styles: [`
        .fontSelection {
            width: 200px;
        }

        .offSet {
            position: relative;
            top: 5px;
        }

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

    private bold: boolean;
    private italic: boolean;
    private underline: boolean;
    private alignment: 'left' | 'center' | 'right';
    m_fonts: Array<string>;

    private m_borderColorChanged = new Subject();

    m_config: IFontSelector = {
        size: 12,
        alignment: 'right',
        bold: true,
        italic: true,
        font: 'Lora',
        underline: true,
        color: '#ff0000',
    }

    constructor(private fontService: FontLoaderService) {
        super();
        this.m_fonts = this.fontService.getFonts();
        this._listenColorChanged();

        // setTimeout(()=>{
        //     this.m_config = {
        //         size: 22,
        //         alignment: 'center',
        //         bold: false,
        //         italic: true,
        //         font: 'Lobster',
        //         underline: true,
        //         color: '#e9ec0a',
        //     }
        // },3000)
    }

    @Input()
    set setConfig(i_config: IFontSelector) {
        this.m_config = i_config
    }

    @Output()
    onChange: EventEmitter<IFontSelector> = new EventEmitter<IFontSelector>();

    _listenColorChanged() {
        this.cancelOnDestroy(
            //
            this.m_borderColorChanged
                .debounceTime(500)
                .distinct()
                .skip(1)
                .subscribe((i_color) => {
                    this.m_config.color = String(i_color);
                    this.onChange.emit(this.m_config);
                }, (e) => console.error(e))
        )
    }

    _onFontChanged(e){
        this.m_config.font = e.target.value;
        this.onChange.emit(this.m_config);
    }

    _onFontSizeChanged(i_value) {
        this.m_config.size = i_value;
        this.onChange.emit(this.m_config);
    }

    _onFontStyleToggle(i_style) {
        this.m_config[i_style] = !this.m_config[i_style];
        this.onChange.emit(this.m_config);
    }

    _onAlignmentChange(direction: 'left' | 'center' | 'right') {
        this.m_config.alignment = direction;
        this.onChange.emit(this.m_config);
    }



    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}