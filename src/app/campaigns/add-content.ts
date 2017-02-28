import {Component, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE, SideProps} from "../../store/actions/appdb.actions";

@Component({
    selector: 'add-content',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <button (click)="_goBack()" id="prev" type="button" class="openPropsButton btn btn-default btn-sm">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </button>
    `
})
export class AddContent extends Compbaser implements AfterViewInit {

    constructor(private yp: YellowPepperService) {
        super();
    }

    @Output()
    onGoBack: EventEmitter<any> = new EventEmitter<any>();

    _goBack() {
        var uiState: IUiState = {
            uiSideProps: SideProps.miniDashboard,
            campaign: {
                campaignTimelineChannelSelected: -1,
                campaignTimelineBoardViewerSelected: -1
            }
        }
        this.yp.ngrxStore.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        this.onGoBack.emit();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}