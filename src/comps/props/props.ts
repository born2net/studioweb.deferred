import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {reduce} from "rxjs/operator/reduce";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

export enum UiUserFocusItemEnum {
    none,
    campaign,
    campaignChannel,
    campaignBoard,
    timelineBlock,
    sceneBlock
}

@Component({
    selector: 'props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<small class="debug">{{me}}</small>
               <ul [ngSwitch]="m_uiUserFocusItem$ | async">
                  <div *ngSwitchCase="m_uiUserFocusItemEnum.campaign">
                    <h1>campaign props</h1>
                  </div>
                  <div *ngSwitchCase="m_uiUserFocusItemEnum.campaignBoard">
                    <h1>campaign board</h1>
                  </div>
                </ul>
           `,
})
export class Props extends Compbaser {

    constructor(private store: Store<ApplicationState>) {
        super();
        this.m_uiUserFocusItem$ = this.store.select(store => store.appDb.uiState.uiUserFocusItem).map(v => {
            console.log(v);
            return v
        });

    }

    m_uiUserFocusItemEnum = UiUserFocusItemEnum;
    m_uiUserFocusItem$: Observable<UiUserFocusItemEnum>;

    ngOnInit() {
    }

    destroy() {
    }
}