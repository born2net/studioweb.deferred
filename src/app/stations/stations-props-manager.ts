import {Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable, Subject} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {Lib} from "../../Lib";
import {RedPepperService} from "../../services/redpepper.service";
import {StationModel} from "../../models/StationModel";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'stations-props-manager',
    animations: [
        trigger('toggleState', [
            state('true', style({})),
            state('false', style({maxHeight: 0, padding: 0, display: 'none'})),
            // transition
            transition('* => *', animate('300ms')),
        ])
    ],
    styles: [`
        ul {
            padding: 0px;
        }

        #stationcontrol {
            width: 100%;
        }

        #stationcontrol button {
            width: 25%;
        }

        .loading {
            float: left;
            position: relative;
            top: -106px;
            left: calc((100% / 2) - 30px);
        }
        img {
            float: left;
            position: relative;
            width: 210px;
            top: -140px;
            left: calc((100% / 2) - 109px);
        }
        
        #propWrap {
            position: fixed;
            padding-left: 20px;
        }
    `],
    templateUrl: './stations-props-manager.html'
})
export class StationsPropsManager extends Compbaser {

    m_sideProps$: Observable<SideProps>;
    m_sidePropsEnum = SideProps;
    m_uiUserFocusItem$: Observable<SideProps>;
    m_selected: StationModel;
    m_loading = false;
    m_snapPath = '';
    shouldToggle = true;
    m_disabled = true;
    m_eventValue = '';
    // m_imageGrabber = new Subject();

    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.m_uiUserFocusItem$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);

        this.cancelOnDestroy(
            //
            this.yp.listenStationSelected()
                .subscribe((i_station: StationModel) => {
                    this.m_snapPath = '';
                    this.m_selected = i_station;
                    this.m_disabled = this.m_selected.connection == "0";
                }, (e) => console.error(e))
        )
    }

    _fetchImage(url){
        // var interval = 1000;
        // function fetchItems() {
        //     return 'items';
        // }
        //
        // var data$ = Observable.interval(interval)
        //     .map(() => {
        //     return http.get();
        // })
        //     .filter(function(x) {return x.lastModified > Date.now() - interval}
        //         .skip(1)
        //         .startWith(fetchItems());
    }

    _onImageError(event){
        this.m_snapPath = '';
        this.m_loading = false;
        console.log('could not load snap image');
    }

    _onCommand(i_command) {
        switch (i_command) {
            case 'play': {
                this.rp.sendCommand('start', this.m_selected.id, () => {
                });
                break;
            }
            case 'stop': {
                this.rp.sendCommand('stop', this.m_selected.id, () => {
                });
                break;
            }
            case 'snap': {
                this._takeSnapshot();
                break;
            }
            case 'off': {
                this.rp.sendCommand('rebootPlayer', this.m_selected.id, () => {
                });
                break;
            }
        }
    }

    _takeSnapshot() {
        var d = new Date().getTime();
        this.m_snapPath = '';
        this.m_loading = true;
        var path = this.rp.sendSnapshot(d, 0.2, this.m_selected.id, () => {
        this.m_snapPath = path;
        });
        setTimeout(() => {
            this.m_loading = false;
            this.m_snapPath = path;
        }, 100);

    }

    _onSendEvent() {
        this.shouldToggle != this.shouldToggle;
        this.rp.sendEvent(this.m_eventValue, this.m_selected.id, function () {
        });
    }

    ngOnInit() {
    }

    destroy() {
    }
}