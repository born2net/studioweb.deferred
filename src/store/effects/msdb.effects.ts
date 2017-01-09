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
import {RedPepperService} from "../../services/redpepper.service";

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

    @Effect() reduxifyMsdb$: Observable<Action> = this.actions$.ofType(EFFECT_INIT_REDUXIFY_MSDB)
        .map(() => {
            var db = this.redPepperService.reduxifyMsTable();
            return {type: MSDB_INIT, payload: db}
        })

    @Effect() createTable: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE)
        .map(() => {
            var table = this.redPepperService.createCampaign('foo_bar2');
            return {
                type: ACTION_UPDATE_TABLE,
                payload: {
                    table: table,
                    tableName: 'table_campaigns'
                }
            }
        })


}


