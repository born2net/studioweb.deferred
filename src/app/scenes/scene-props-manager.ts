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
            <block-prop></block-prop>
            <h3>test show shared block prop</h3>
            <div *ngSwitchCase="m_uiUserFocusItemEnum.sceneBlock">
                <block-prop></block-prop>
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