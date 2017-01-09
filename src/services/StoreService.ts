import {Injectable, Inject, forwardRef} from "@angular/core";
import {CommBroker} from "./CommBroker";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {AppdbAction} from "../store/actions/app-db-actions";
import {RedPepperService} from "./redpepper.service";
import {EFFECT_REDUXIFY_MSDB} from "../store/effects/app-db-effects";

@Injectable()
export class StoreService {
    constructor(@Inject(forwardRef(() => Store)) private store: Store<ApplicationState>,
                @Inject(forwardRef(() => AppdbAction)) private appdbAction: AppdbAction,
                @Inject(forwardRef(() => RedPepperService)) private redPepperService: RedPepperService,
                @Inject('OFFLINE_ENV') private offlineEnv) {

        this.store.dispatch(this.appdbAction.initAppDb());
        console.log(this.redPepperService);
    }

    private singleton: boolean = false;

    public loadServices() {
        if (this.singleton) return;
        this.singleton = true;
        this.store.dispatch({type: EFFECT_REDUXIFY_MSDB})
        console.log('loaded network services...');
    }
}
