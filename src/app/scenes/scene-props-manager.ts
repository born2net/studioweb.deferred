import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'scene-props-manager',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        ul {
            padding: 0
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <ul [ngSwitch]="m_uiUserFocusItem$ | async">
            <div *ngSwitchCase="m_uiUserFocusItemEnum.sceneEditor">
                <h5>scene editor</h5>
                <!--<block-prop-container></block-prop-container>-->
            </div>
            <div *ngSwitchCase="m_uiUserFocusItemEnum.sceneProps">
                <h5>scene props</h5>
                <!--<block-prop-container></block-prop-container>-->
            </div>
            <div *ngSwitchCase="m_uiUserFocusItemEnum.sceneBlock">
                <h5>block block</h5>
                <!--<block-prop-container></block-prop-container>-->
            </div>
            <div *ngSwitchCase="m_uiUserFocusItemEnum.miniDashboard">
                <h5>scene dashboard</h5>
            </div>
        </ul>
    `,
})
export class ScenePropsManager extends Compbaser {

    constructor(private yp: YellowPepperService) {
        super();
        this.m_uiUserFocusItem$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
    }

    m_uiUserFocusItemEnum = SideProps;
    m_uiUserFocusItem$: Observable<SideProps>;

    ngOnInit() {
    }

    destroy() {
    }
}