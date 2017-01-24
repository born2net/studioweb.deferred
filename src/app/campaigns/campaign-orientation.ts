import {Component, ChangeDetectionStrategy, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {timeout} from "../../decorators/timeout-decorator";

export enum OrientationEnum {
    HORIZONTAL,
    VERTICAL
}

@Component({
    selector: 'campaign-orientation',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .defaultOpacity {
            opacity: 0.6;
            cursor: pointer;
        }
        .selectedOrientation {
            opacity: 1 !important;
        }
    `],
    template: `<small class="debug">{{me}}</small>
                <h4>screen orientation</h4>
                <div id="orientationView">
                    <table width="100%" border="0" cellspacing="0" cellpadding="50">
                        <tr>
                            <td align="center">
                                <img (click)="_onOrientation(OrientationEnum.HORIZONTAL)" [ngClass]="{'selectedOrientation': m_orientation==OrientationEnum.HORIZONTAL}" class="defaultOpacity img-responsive" src="assets/orientationH.png"/>
                            </td>
                            <td align="center">
                                <img (click)="_onOrientation(OrientationEnum.VERTICAL)" [ngClass]="{'selectedOrientation': m_orientation==OrientationEnum.VERTICAL}" class="defaultOpacity img-responsive"  src="assets/orientationV.png"/>
                            </td>
                        </tr>
                    </table>
                </div>
           `
})

export class CampaignOrientation extends Compbaser {

    constructor() {
        super();
    }

    @Output()
    onOrientationSelected: EventEmitter<OrientationEnum> = new EventEmitter<OrientationEnum>();

    m_orientation: OrientationEnum;
    OrientationEnum = OrientationEnum;

    _onOrientation(i_orientation:OrientationEnum) {
        this.m_orientation = i_orientation;
        this._next();
    }

    @timeout(800)
    private _next() {
        this.onOrientationSelected.emit(this.m_orientation)
    }

    public onOrientationChanged(): OrientationEnum {
        return this.m_orientation;
    }

    ngOnInit() {
    }

    destroy() {
    }
}