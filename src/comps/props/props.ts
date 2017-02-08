import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        ul {
            padding: 0
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <ul [ngSwitch]="m_uiUserFocusItem$ | async">
            <div *ngSwitchCase="m_uiUserFocusItemEnum.campaignProps">
                <campaign-props></campaign-props>
            </div>
            <div *ngSwitchCase="m_uiUserFocusItemEnum.miniDashboard">
                <dashboard-props></dashboard-props>
            </div>
            <!--<div *ngSwitchCase="m_uiUserFocusItemEnum.campaignBoard">-->
                <!--<h1>NOT USED</h1>-->
            <!--</div>-->
            <div *ngSwitchCase="m_uiUserFocusItemEnum.campaignEditor">
                <campaign-editor-props></campaign-editor-props>
            </div>

            <div *ngSwitchCase="m_uiUserFocusItemEnum.timeline">
                <timeline-props></timeline-props>
            </div>

            <div *ngSwitchCase="m_uiUserFocusItemEnum.channel">
                <channel-props></channel-props>
            </div>
        </ul>
    `,
})
export class Props extends Compbaser {

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