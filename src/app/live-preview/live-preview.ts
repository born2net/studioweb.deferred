import {Component, ChangeDetectionStrategy, AfterViewInit, Inject} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ACTION_UISTATE_UPDATE} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";

@Component({
    selector: 'live-preview',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <button (click)="_onExit()">exit</button>
    `,
})
export class LivePreview extends Compbaser implements AfterViewInit {

    constructor(private yp: YellowPepperService) {
        super();
    }

    ngAfterViewInit() {
        this.checkFlash()
    }

    _onExit(){
        let uiState: IUiState = {previewing: false}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    checkFlash() {
        if (!FlashDetect.installed || !FlashDetect.versionAtLeast(13)) {
            bootbox.alert({
                message: 'Flash is not enabled, in Chrome go to the URL: chrome://settings/content to enable'
            });
            return false;
        } else {
            return true;
        }
    }

    ngOnInit() {
    }

    destroy() {
    }
}
