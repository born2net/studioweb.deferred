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
        <input class="form-control" inlength="1" placeholder="resource name" type="text"/>
        <div style="width: 100% height: 200px">
            <media-player></media-player>
        </div>
    `,
})
export class ResourcePropsManager extends Compbaser {

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