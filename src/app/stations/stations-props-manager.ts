import {Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable} from "rxjs";
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
            state('true' , style({  })),
            state('false', style({ maxHeight: 0, padding: 0, display: 'none' })),
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
            top:  -106px;
            left: calc((100%  / 2) - 30px);
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
    shouldToggle = true;
    m_disabled = true;
    
    constructor(private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.m_uiUserFocusItem$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);

        this.cancelOnDestroy(
            //
            this.yp.listenStationSelected()
                .subscribe((i_station: StationModel) => {
                    this.m_selected = i_station;
                    this.m_disabled = this.m_selected.connection == "0";
                    console.log(this.m_disabled );
                }, (e) => console.error(e))
        )

    }

    _onSendEvent(){
        this.shouldToggle != this.shouldToggle;
    }

    ngOnInit() {
    }

    destroy() {
    }
}