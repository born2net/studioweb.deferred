import {Component, ChangeDetectionStrategy, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {timeout} from "../../decorators/timeout-decorator";
import {Observable, Observer} from "rxjs";

export enum OrientationEnum {
    HORIZONTAL,
    VERTICAL
}

// export type OrientationConst = "HORIZONTAL" | "VERTICAL";


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
                <h4 i18n>screen orientation</h4>
                <div id="orientationView">
                    <table width="100%" border="0" cellspacing="0" cellpadding="50">
                        <tr>
                            <td align="center">
                                <img (click)="_nextClick.next(OrientationEnum.HORIZONTAL)" [ngClass]="{'selectedOrientation': m_orientation==OrientationEnum.HORIZONTAL}" class="defaultOpacity img-responsive" src="assets/orientationH.png"/>
                            </td>
                            <td align="center">
                                <img (click)="_nextClick.next(OrientationEnum.VERTICAL)" [ngClass]="{'selectedOrientation': m_orientation==OrientationEnum.VERTICAL}" class="defaultOpacity img-responsive"  src="assets/orientationV.png"/>
                            </td>
                        </tr>
                    </table>
                </div>
           `
})

export class CampaignOrientation extends Compbaser {

    m_orientation: OrientationEnum;
    OrientationEnum = OrientationEnum;
    _nextClick: Observer<any>;

    constructor() {
        super();
        this.cancelOnDestroy(
            Observable.create(observer => {
                this._nextClick = observer
            }).map((i_orientation) => {
                this.m_orientation = i_orientation;
                return i_orientation;
            })
                .debounceTime(800)
                .do(() => {
                    this.onSelection.emit(this.m_orientation)
                }).subscribe()
        )
    }

    @Output()
    onSelection: EventEmitter<OrientationEnum> = new EventEmitter<OrientationEnum>();

    public get getOrientationChanged(): OrientationEnum {
        return this.m_orientation;
    }

    ngOnInit() {
    }

    destroy() {
    }
}