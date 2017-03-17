import {Component, ViewContainerRef, VERSION} from "@angular/core";
import "rxjs/add/operator/catch";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {CommBroker} from "../services/CommBroker";
import {Title} from "@angular/platform-browser";
import {ToastsManager} from "ng2-toastr";
import {Consts} from "../Conts";
import {Observable} from "rxjs";
import * as packageJson from "../../package.json";
import {AuthService} from "../services/AuthService";
import {LocalStorage} from "../services/LocalStorage";
import {YellowPepperService} from "../services/yellowpepper.service";
import {RedPepperService} from "../services/redpepper.service";
import {IUiState} from "../store/store.data";
import {ACTION_UISTATE_UPDATE} from "../store/actions/appdb.actions";

enum MainAppShowModeEnum {
    MAIN,
    SAVE,
    PREVIEW
}

@Component({
    selector: 'app-root',
    templateUrl: './app-component.html'
})
export class AppComponent {
    version: string;
    ngVersion: string;
    offlineDevMode: string = window['offlineDevMode'];
    m_ShowModeEnum = MainAppShowModeEnum;
    m_showMode = MainAppShowModeEnum.MAIN;
    m_hidden = false;

    constructor(private router: Router,
                private localStorage: LocalStorage,
                private commBroker: CommBroker,
                private rp: RedPepperService,
                private authService: AuthService,
                private yp: YellowPepperService,
                private activatedRoute: ActivatedRoute,
                private vRef: ViewContainerRef,
                private titleService: Title,
                private toastr: ToastsManager) {

        this.version = packageJson.version;
        this.ngVersion = VERSION.full

        // this.localStorage.removeItem('remember_me')
        // this.localStorage.removeItem('business_id')

        this.checkPlatform();
        this.listenSave();
        this.listenPreview();
        this.toastr.setRootViewContainerRef(vRef);
        this.listenRouterUpdateTitle();
        Observable.fromEvent(window, 'resize').debounceTime(250)
            .subscribe(() => {
                this.appResized();
            }, (e) => {
                console.error(e)
            });
    }

    ngOnInit() {
        let s = this.router.events
            .subscribe((val) => {
                if (val instanceof NavigationEnd) {
                    this.authService.start();
                    s.unsubscribe();
                }
            }, (e) => console.error(e));
    }

    private listenPreview() {
        this.yp.listenPreview()
            .subscribe(i_previewing => {
                if (i_previewing) {
                    this.viewMode(MainAppShowModeEnum.PREVIEW);
                } else {
                    this.viewMode(MainAppShowModeEnum.MAIN);
                }
            }, (e) => console.error(e))
    }

    private listenSave() {
        this.yp.listenSave()
            .subscribe(i_saving => {
                if (i_saving) {
                    this.viewMode(MainAppShowModeEnum.SAVE);
                    this.rp.save((result) => {
                        if (result.status == true) {
                            this.rp.reduxCommit(null, true)
                            this.viewMode(MainAppShowModeEnum.MAIN);
                            let uiState: IUiState = {saving: false}
                            this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
                        } else {
                            alert('error ' + JSON.stringify(result));
                        }
                    })
                }
            }, (e) => console.error(e))
    }

    private viewMode(i_mode: MainAppShowModeEnum) {
        this.m_showMode = i_mode;
        switch (i_mode) {
            case MainAppShowModeEnum.MAIN: {
                this.m_hidden = false;
                break;
            }
            case MainAppShowModeEnum.PREVIEW: {
                this.m_hidden = true;
                break;
            }
            case MainAppShowModeEnum.SAVE: {
                this.m_hidden = true;
                break;
            }
        }
    }

    private checkPlatform() {
        switch (platform.name.toLowerCase()) {
            case 'microsoft edge': {
                // alert(`${platform.name} browser not supported at this time, please use Google Chrome`);
                break;
            }
            case 'chrome': {
                break;
            }
            default: {
                // alert('for best performance please use Google Chrome');
                break;
            }
        }
    }

    public appResized(): void {
        var appHeight = document.body.clientHeight;
        var appWidth = document.body.clientWidth;
        this.commBroker.setValue(Consts.Values().APP_SIZE, {
            height: appHeight,
            width: appWidth
        });
        this.commBroker.fire({
            fromInstance: self,
            event: Consts.Events().WIN_SIZED,
            context: '',
            message: {
                height: appHeight,
                width: appWidth
            }
        })
    }

    private listenRouterUpdateTitle() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) {
                    route = route.firstChild
                }
                return route;
            }).filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {
                this.titleService.setTitle(event['title'])
            }, (e) => console.error(e));
    }
}