import {Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'resource-props-manager',
    styles: [`
        ul {
            padding: 0
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <br/>
        <br/>


        <ul matchBodyHeight="50" style="overflow-y: auto; overflow-x: hidden" [ngSwitch]="m_sideProps$ | async">
            <div *ngSwitchCase="m_sidePropsEnum.resourceProps">
                <h4>resource props</h4>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.miniDashboard">
                <h4>resource dashboard</h4>
            </div>
        </ul>
        
        
        <!--<div [ngSwitch]="m_resourceType">-->
            <!--<div *ngSwitchCase="'image'">-->
            <!--</div>-->
        <!--</div>-->
        <!--<div [ngSwitch]="m_resourceType">-->
            <!--<div *ngSwitchCase="'video'">-->
            <!--</div>-->
        <!--</div>-->
        <!--<div [ngSwitch]="m_resourceType">-->
            <!--<div *ngSwitchCase="'svg'">-->
            <!--</div>-->
        <!--</div>-->
        <!--<input class="form-control" inlength="1" placeholder="resource name" type="text"/>-->
        <!--<div style="width: 100% height: 200px">-->
            <!--<media-player></media-player>-->
        <!--</div>-->
    `,
})
export class ResourcePropsManager extends Compbaser {

    constructor(private yp: YellowPepperService) {
        super();
        this.m_uiUserFocusItem$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
    }

    m_resourceType;
    m_sideProps$: Observable<SideProps>;
    m_sidePropsEnum = SideProps;
    m_uiUserFocusItem$: Observable<SideProps>;

    ngOnInit() {
    }

    destroy() {
    }
}