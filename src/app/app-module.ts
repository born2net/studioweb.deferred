import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {Ng2Bs3ModalModule} from "ng2-bs3-modal/ng2-bs3-modal";
import {AppComponent} from "./app-component";
import {LocalStorage} from "../services/LocalStorage";
import {RedPepperService} from "../services/redpepper.service";
import {YellowPepperService} from "../services/yellowpepper.service";
import {MsLibModule} from "ng-mslib/dist/mslib.module";
import {ToastModule} from "ng2-toastr";
import {DropdownModule, AccordionModule, AlertModule, ModalModule} from "ng2-bootstrap";
import {TreeModule, InputTextModule, SelectButtonModule, DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {NgStringPipesModule} from "angular-pipes";
import {routing} from "../app-routes";
import {LoginPanel} from "../comps/entry/LoginPanel";
import {Logout} from "../comps/logout/Logout";
import {Logo} from "../comps/logo/Logo";
import {BlurForwarder} from "../comps/blurforwarder/BlurForwarder";
import {ImgLoader} from "../comps/imgloader/ImgLoader";
import {ChartModule} from "angular2-highcharts";
import {CommBroker} from "../services/CommBroker";
import {AUTH_PROVIDERS} from "../services/AuthService";
import {StoreService} from "../services/StoreService";
import {NgMenu} from "../comps/ng-menu/ng-menu";
import {NgMenuItem} from "../comps/ng-menu/ng-menu-item";
import {AutoLogin} from "../comps/entry/AutoLogin";
import {StoreModule} from "@ngrx/store";
import {INITIAL_APPLICATION_STATE} from "../store/application.state";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {AppdbAction} from "../store/actions/appdb.actions";
import {AppDbEffects} from "../store/effects/appdb.effects";
import {Tab} from "../comps/tabs/tab";
import {Tabs} from "../comps/tabs/tabs";
import {MsdbEffects} from "../store/effects/msdb.effects";
import {environment} from "../environments/environment";
import {productionReducer} from "../store/store.data";
import {NgmslibService} from "ng-mslib";
import {SharedModule} from "../modules/shared.module";
import {Dashboard} from "./dashboard/dashboard-navigation";
import {Appwrap} from "./appwrap";
import "hammerjs";
import "fabric";
// import {ScreenTemplate} from "../comps/screen-template/screen-template";

export var providing = [CommBroker, AUTH_PROVIDERS, RedPepperService, YellowPepperService, LocalStorage, StoreService, AppdbAction,
    {
        provide: "OFFLINE_ENV",
        useValue: window['offlineDevMode']
    }
];

var decelerations = [AppComponent, AutoLogin, LoginPanel, Logo, Appwrap, Dashboard, Tabs, Tab, Logout, NgMenu, NgMenuItem, ImgLoader, BlurForwarder];

export function appReducer(state: any = INITIAL_APPLICATION_STATE, action: any) {
    if (environment.production) {
        return productionReducer(state, action);
    } else {
        return productionReducer(state, action);
        // return developmentReducer(state, action);
    }
}

@NgModule({
    declarations: [decelerations],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Bs3ModalModule,
        HttpModule,
        ChartModule,
        StoreModule.provideStore(appReducer),
        EffectsModule.run(AppDbEffects),
        EffectsModule.run(MsdbEffects),
        StoreDevtoolsModule.instrumentStore({maxAge: 2}),
        // StoreDevtoolsModule.instrumentOnlyWithExtension(),
        SharedModule.forRoot(),
        ToastModule.forRoot({
            animate: 'flyRight',
            positionClass: 'toast-bottom-right',
            toastLife: 5000,
            showCloseButton: true,
            maxShown: 5,
            newestOnTop: true,
            enableHTML: true,
            dismiss: 'auto',
            messageClass: "",
            titleClass: ""
        }),
        AlertModule.forRoot(),
        MsLibModule.forRoot({a: 1}),
        ModalModule.forRoot(),
        DropdownModule.forRoot(),
        AccordionModule.forRoot(),
        JsonpModule,
        TreeModule,
        NgStringPipesModule,
        InputTextModule,
        SelectButtonModule,
        InputTextModule,
        DropdownModulePrime,
        routing,
    ],
    providers: [providing],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(private ngmslibService: NgmslibService) {
        console.log(`running in dev mode: ${ngmslibService.inDevMode()}`);
        this.ngmslibService.globalizeStringJS();
        console.log(StringJS('app-loaded-and-ready').humanize().s);
    }
}

