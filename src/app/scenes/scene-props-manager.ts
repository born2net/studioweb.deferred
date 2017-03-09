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
        <ul [ngSwitch]="m_sideProps$ | async">
            <div *ngSwitchCase="m_sidePropsEnum.sceneEditor">
                <h5>scene editor</h5>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.sceneProps">
                <h5>scene props</h5>                
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.sceneBlock">
                <block-prop-container></block-prop-container>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.miniDashboard">
                <h5>scene dashboard</h5>
            </div>
        </ul>
    `,
})
export class ScenePropsManager extends Compbaser {

    constructor(private yp: YellowPepperService) {
        super();
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
    }

    m_sidePropsEnum = SideProps;
    m_sideProps$: Observable<SideProps>;

    ngOnInit() {
    }

    destroy() {
    }
}