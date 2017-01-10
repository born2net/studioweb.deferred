import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/debounceTime";
import * as xml2js from "xml2js";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../application.state";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {MSDB_INIT} from "../actions/appdb.actions";
import {ACTION_UPDATE_TABLE} from "../actions/msdb.actions";
import {RedPepperService, redpepperSet} from "../../services/redpepper.service";

export const EFFECT_INIT_REDUXIFY_MSDB = 'EFFECT_INIT_REDUXIFY_MSDB';
export const EFFECT_CREATE_TABLE = 'EFFECT_CREATE_TABLE';

@Injectable()
export class MsdbEffects {

    constructor(private actions$: Actions,
                @Inject('OFFLINE_ENV') private offlineEnv,
                private store: Store<ApplicationState>,
                private redPepperService: RedPepperService,
                private http: Http) {
    }

    @Effect()
    reduxifyMsdb$: Observable<Action> = this.actions$.ofType(EFFECT_INIT_REDUXIFY_MSDB)
        .map(() => {
            var redpepperSet:redpepperSet = this.redPepperService.reduxifyMsdbTable();
            return {type: MSDB_INIT, payload: redpepperSet}
        })

    @Effect()
    createTable: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE)
        .map(() => {
            var redpepperSet:redpepperSet = this.redPepperService.createCampaign(Math.random());
            return {
                type: ACTION_UPDATE_TABLE,
                payload: {
                    tables: redpepperSet.tables,
                    tableName: 'table_campaigns'
                }
            }
        })


}


