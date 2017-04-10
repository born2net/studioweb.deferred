import {Component} from "@angular/core";
import {LocalStorage} from "../../services/LocalStorage";
import {RedPepperService} from "../../services/redpepper.service";
import {MainAppShowStateEnum} from "../../app/app-component";
import {ACTION_UISTATE_UPDATE} from "../../store/actions/appdb.actions";
import {IUiState} from "../../store/store.data";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'Logout',
    providers: [LocalStorage],
    template: ``
})

export class Logout {
    constructor(private localStorage: LocalStorage, private rp: RedPepperService, private yp:YellowPepperService) {
        this.localStorage.removeItem('remember_me_studioweb');
        let uiState: IUiState = {mainAppState: MainAppShowStateEnum.GOODBYE}
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        if (this.rp.getUserData().resellerID == 1)
            jQuery('body').fadeOut(1000, function () {
                window.location.replace('http://www.digitalsignage.com');
            });
    }
}
