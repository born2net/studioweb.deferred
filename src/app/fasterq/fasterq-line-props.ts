import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {FasterqLineModel} from "../../models/fasterq-line-model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {SideProps} from "../../store/actions/appdb.actions";
import {Observable} from "rxjs/Observable";
import {EFFECT_UPDATE_FASTERQ_LINE} from "../../store/effects/appdb.effects";
import * as _ from 'lodash';

@Component({
    selector: 'fasterq-line-props',
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
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
                                <!--{{m_selectedLine?.lineName}}-->
                                <!--</li>-->
                                <li class="list-group-item">
                                    <span i18n>selected line</span>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                                        <input formControlName="line_name" required
                                               type="text" class="form-control" maxlength="50"
                                               placeholder="line name">
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <span i18n>reminder ahead of people</span>
                                    <div class="input-group">
                                        <span class="input-group-addon"><i class="fa fa-lightbulb-o"></i></span>
                                        <input max="100" min="1" formControlName="reminder" required
                                               type="number" class="form-control"
                                               placeholder="send reminder">
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <button class="btn btn-primary inliner" i18n>open terminal</button>
                                </li>
                                <li class="list-group-item">
                                    <button class="btn btn-primary inliner" i18n>reset line</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.miniDashboard">
                <h4>line dashboard</h4>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.fasterqQueueProps">
                <h4>queue props</h4>
            </div>
        </div>
    `,
})
export class FasterqLineProps extends Compbaser implements AfterViewInit {

    m_selectedLine: FasterqLineModel;
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
                    this.m_selectedLine = i_lineSelected;
                    this._render();
                }, (e) => console.error(e))
        )
    }

    _render() {
        this.m_contGroup.controls.line_name.setValue(this.m_selectedLine.lineName)
        this.m_contGroup.controls.reminder.setValue(this.m_selectedLine.reminder)
    }

    /**
     Populate the selected queue's properties UI
     @method _populatePropsQueue
     @params {Number} i_value
     **/
    _populatePropsQueue(i_model) {
        // $(Elements.FQ_SELECTED_QUEUE).text(i_model.get('service_id'));
        // $(Elements.FQ_VERIFICATION).text(i_model.get('verification') == -1 ? 'print out' : i_model.get('verification'));
        // $(Elements.FQ_CALLED_BY).text(_.isNull(i_model.get('called_by')) ? 'none' : i_model.get('called_by'));
    }

    saveToStore() {
        this.yp.ngrxStore.dispatch({
            type: EFFECT_UPDATE_FASTERQ_LINE,
            payload: {
                id: this.m_selectedLine.lineId,
                name: this.m_contGroup.controls.line_name.value,
                reminder: _.isNumber(this.m_contGroup.controls.reminder.value) ? this.m_contGroup.controls.reminder.value : 1
            }
        })
    }

    ngAfterViewInit() {
    }

    ngOnInit() {
    }

    destroy() {
    }
}
