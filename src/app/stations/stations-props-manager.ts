import {ChangeDetectorRef, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {StationModel} from "../../models/StationModel";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormGroup} from "@angular/forms";
import {timeout} from "../../decorators/timeout-decorator";
import {BranchStationsModelExt, CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {List} from "immutable";

@Component({
    selector: 'stations-props-manager',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
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

    contGroup: FormGroup;
    m_sideProps$: Observable<SideProps>;
    m_sidePropsEnum = SideProps;
    m_uiUserFocusItem$: Observable<SideProps>;
    m_selectedStation: StationModel;
    m_selectedBranchStation: BranchStationsModelExt;
    m_selectedCampaignId = -1;
    m_loading = false;
    m_snapPath = '';
    shouldToggle = true;
    m_disabled = true;
    m_port = '';
    m_campaigns: List<CampaignsModelExt>;
    m_ip = '';
    m_eventValue = '';
    // m_imageGrabber = new Subject();

    constructor(private fb: FormBuilder, private yp: YellowPepperService, private rp: RedPepperService, private cd:ChangeDetectorRef) {
        super();
        this.m_uiUserFocusItem$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);

        this.contGroup = fb.group({
            'm_campaignsControl': [''],
            'm_eventValue': [''],
            'm_enableLan': [],
            'm_ip': [],
            'm_port': []
        });

        this.cancelOnDestroy(
            //
            this.yp.getCampaigns()
                .subscribe((i_campaigns: List<CampaignsModelExt>) => {
                    this.m_campaigns = i_campaigns;
                }, (e) => console.error(e))
        )

        //
        this.yp.listenStationSelected()
            .map((i_station: StationModel) => {
                this.m_snapPath = '';
                this.m_selectedStation = i_station;
                this.m_disabled = this.m_selectedStation.connection == "0";
                return this.m_selectedStation.id;
            })
            .mergeMap(i_station_id => {
                return this.yp.getStationCampaignID(i_station_id, true)
                    .map((i_campaign_id) => {
                        return {i_station_id, i_campaign_id};
                    })

            })
            .mergeMap(({i_station_id, i_campaign_id}) => {
                this.m_selectedCampaignId = i_campaign_id;
                return this.yp.listenStationRecord(i_station_id)
            })
            .subscribe((i_branchStationsModel) => {
                this.m_selectedBranchStation = i_branchStationsModel;
                this._render();
            }, (e) => console.error(e))
    }

    _render() {
        this.contGroup.controls.m_campaignsControl.setValue(this.m_selectedCampaignId);
        this.contGroup.controls.m_enableLan.setValue(this.m_selectedBranchStation.getLanEnabled);
        this.contGroup.controls.m_ip.setValue(this.m_selectedBranchStation.getLanServerIp());
        this.contGroup.controls.m_port.setValue(this.m_selectedBranchStation.getLanServerPort());
    }

    _fetchImage(url) {
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

    _onImageError(event) {
        this.m_snapPath = '';
        this.m_loading = false;
        console.log('could not load snap image');
    }

    _onCommand(i_command) {
        switch (i_command) {
            case 'play': {
                this.rp.sendCommand('start', this.m_selectedStation.id, () => {
                });
                break;
            }
            case 'stop': {
                this.rp.sendCommand('stop', this.m_selectedStation.id, () => {
                });
                break;
            }
            case 'snap': {
                this._takeSnapshot();
                break;
            }
            case 'off': {
                this.rp.sendCommand('rebootPlayer', this.m_selectedStation.id, () => {
                });
                break;
            }
        }
    }

    _takeSnapshot() {
        var d = new Date().getTime();
        this.m_snapPath = '';
        this.m_loading = true;
        var path = this.rp.sendSnapshot(d, 0.2, this.m_selectedStation.id, () => {
            this.m_snapPath = path;
        });
        setTimeout(() => {
            this.m_loading = false;
            this.m_snapPath = path;
        }, 100);

    }

    _onSendEvent() {
        this.shouldToggle != this.shouldToggle;
        this.rp.sendEvent(this.contGroup.controls.m_eventValue.value, this.m_selectedStation.id, function () {
        });
    }

    @timeout()
    private  saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        this.rp.setStationCampaignID(this.m_selectedStation.id, this.contGroup.value.m_campaignsControl);
        this.rp.setStationRecordValue(this.m_selectedStation.id, 'lan_server_enabled', this.contGroup.value.m_enableLan == true ? 'True' : 'False');
        this.rp.reduxCommit();
        this.cd.markForCheck();
    }

    destroy() {
    }
}
