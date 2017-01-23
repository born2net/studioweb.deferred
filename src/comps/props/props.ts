import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";

@Component({
    selector: 'props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<small class="debug">{{me}}</small>
               <ul [ngSwitch]="m_uiUserFocusItem$ | async">
                  <div *ngSwitchCase="m_uiUserFocusItemEnum.campaignProps">
                    <h1>campaign props</h1>
                  </div>
                  <div *ngSwitchCase="m_uiUserFocusItemEnum.miniDashboard">
                    <h1>dashboard</h1>
                  </div>
                  <div *ngSwitchCase="m_uiUserFocusItemEnum.campaignBoard">
                    <h1>campaign board</h1>
                  </div>
                  <div *ngSwitchCase="m_uiUserFocusItemEnum.campaignEditor">
                    <h1>campaign editor</h1>
                  </div>
                </ul>
           `,
})
export class Props extends Compbaser {

    constructor(private store: Store<ApplicationState>) {
        super();
        this.m_uiUserFocusItem$ = this.store.select(store => store.appDb.uiState.uiSideProps);

    }

    m_uiUserFocusItemEnum = SideProps;
    m_uiUserFocusItem$: Observable<SideProps>;

    ngOnInit() {
    }

    destroy() {
    }
}