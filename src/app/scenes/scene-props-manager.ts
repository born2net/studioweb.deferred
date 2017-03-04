import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
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
            <div *ngSwitchCase="m_uiUserFocusItemEnum.sceneBlock">
                <h5>block props</h5>
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