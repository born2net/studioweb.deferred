import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {FasterqLineModel} from "../../models/FasterqLineModel";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SideProps} from "../../store/actions/appdb.actions";
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'fasterq-line-props',
    styles: [`
        input.ng-invalid {
            border-right: 10px solid red;
        }

        .material-switch {
            position: relative;
            padding-top: 10px;
        }

        .input-group {
            padding-top: 10px;
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <div [ngSwitch]="m_sideProps$ | async">
            <div *ngSwitchCase="m_sidePropsEnum.fasterqLineProps">
                <form novalidate autocomplete="off" [formGroup]="m_contGroup">
                    <div class="row">
                        <div class="inner userGeneral">
                            <ul class="list-group">
                                <!--<li class="list-group-item">-->
                                <!--<span i18n>line name: </span>-->
                                <!--{{lineSelected?.lineName}}-->
                                <!--</li>-->
                                <li class="list-group-item">
                                    <span i18n>selected line</span>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                        <input formControlName="line_name" required
                                               type="text" class="form-control" maxlength="50"
                                               placeholder="campaign name">
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <span i18n>reminder ahead of people</span>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-lightbulb-o"></i></span>
                                        <input formControlName="reminder" required
                                               type="number" class="form-control"
                                               placeholder="campaign name">
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.miniDashboard">
                <h4>line dashboard</h4>
            </div>
        </div>
    `,
})
export class FasterqLineProps extends Compbaser implements AfterViewInit {

    lineSelected: FasterqLineModel;
    m_contGroup: FormGroup;
    m_sideProps$: Observable<SideProps>;
    m_sidePropsEnum = SideProps;

    constructor(private fb: FormBuilder, private yp: YellowPepperService) {
        super();
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
        this.m_contGroup = fb.group({
            'line_name': [''],
            'reminder': [0]
        });

        this.cancelOnDestroy(
            this.yp.listenFasterqLineSelected()
                .subscribe((i_lineSelected: FasterqLineModel) => {
                    this.lineSelected = i_lineSelected;
                    this._render();
                }, (e) => console.error(e))
        )


    }

    _render() {
        this.m_contGroup.controls.line_name.setValue(this.lineSelected.lineName)
        this.m_contGroup.controls.reminder.setValue(this.lineSelected.reminder)
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}
