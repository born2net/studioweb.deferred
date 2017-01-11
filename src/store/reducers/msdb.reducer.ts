import {Action} from "@ngrx/store";
import {ACTION_REDUXIFY_MSDB} from "../actions/appdb.actions";
import {IMsDatabase} from "../store.data";
import {redpepperTables} from "../../services/redpepper.service";
import {Map, List} from 'immutable';
import * as _ from 'lodash';

export function msDatabase(state: IMsDatabase, action: Action): IMsDatabase {
    switch (action.type) {
        case ACTION_REDUXIFY_MSDB:
            if (!state.sdk) {
                var redpepperList: Array<redpepperTables> = action.payload;
                state.sdk = redpepperList[0].tables;
                return state;
            }
            var redpepperList: Array<redpepperTables> = action.payload;
            var redpepperCombined = {};
            redpepperList.map((redpepperSet:redpepperTables) => {
                redpepperSet.tableNames.map((tableName:string) => {
                    redpepperCombined[tableName] = redpepperSet.tables[tableName];
                })
            })
            _.forEach(redpepperCombined, (storeModelList: List<Storage>, tableName) => {
                state.sdk[tableName] = storeModelList;
            })
            return state;

        default:
            return state;
    }
}

