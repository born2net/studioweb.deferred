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
import {ACTION_UPDATE_ALL_TABLES, ACTION_UPDATE_TABLE} from "../actions/appdb.actions";
import {RedPepperService, redpepperSet} from "../../services/redpepper.service";

export const EFFECT_INIT_REDUXIFY_MSDB = 'EFFECT_INIT_REDUXIFY_MSDB';
export const EFFECT_CREATE_TABLE_CAMPAIGN = 'EFFECT_CREATE_TABLE_CAMPAIGN';
export const EFFECT_CREATE_TABLE_BOARD = 'EFFECT_CREATE_TABLE_BOARD';

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
            var redpepperSet: redpepperSet = this.redPepperService.reduxifyMsdbTable();
            return {type: ACTION_UPDATE_ALL_TABLES, payload: redpepperSet}
        })

    @Effect()
    createCampaign: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE_CAMPAIGN)
        .map(() => {
            var redpepperSet: redpepperSet = this.redPepperService.createCampaign(Math.random());
            return {
                type: ACTION_UPDATE_TABLE,
                payload: {
                    tables: redpepperSet.tables,
                    tableName: 'table_campaigns'
                }
            }
        })

    @Effect()
    createBoard: Observable<Action> = this.actions$.ofType(EFFECT_CREATE_TABLE_BOARD)
        .map(() => {
            var redpepperSet1: redpepperSet = this.redPepperService.reduxifyMsdbTable();
            this.store.dispatch({type: ACTION_UPDATE_ALL_TABLES, payload: redpepperSet1});

            var redpepperSet2: redpepperSet = this.redPepperService.createBoard('my board', 500, 500);
            var board_id = redpepperSet2.data.board_id;

            return {
                type: ACTION_UPDATE_TABLE,
                payload: redpepperSet2
            }
            // return {
            //     type: ACTION_UPDATE_TABLE,
            //     payload: {
            //         tables: redpepperSet2.tables,
            //         tableName: 'table_boards'
            //     }
            // }
        })

}


