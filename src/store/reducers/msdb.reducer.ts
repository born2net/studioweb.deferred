import {Action} from "@ngrx/store";
import {ACTION_REDUXIFY_MSDB} from "../actions/appdb.actions";
import {IMsDatabase} from "../store.data";
import {redpepperSet} from "../../services/redpepper.service";
import {Map, List} from 'immutable';
import * as _ from 'lodash';

export function msDatabase(state: IMsDatabase, action: Action): IMsDatabase {
    switch (action.type) {
        case ACTION_REDUXIFY_MSDB:
            if (!state.sdk){
                var redpepperSet:redpepperSet = action.payload;
                state.sdk = redpepperSet.tables;
                return state;
            }
            var redpepperSet: redpepperSet = action.payload;
            _.forEach(redpepperSet.tables, (storeModelList:List<Storage>, tableName) => {
                state.sdk[tableName] = storeModelList;
            })

            return state;

        default:
            return state;
    }
}

