import {Action} from "@ngrx/store";
import {ACTION_UPDATE_ALL_TABLES, ACTION_UPDATE_TABLE} from "../actions/appdb.actions";
import {IMsDatabase} from "../store.data";
import {redpepperSet} from "../../services/redpepper.service";

export function msDatabase(state: IMsDatabase, action: Action): IMsDatabase {
    switch (action.type) {
        case ACTION_UPDATE_ALL_TABLES:
            var redpepperSet:redpepperSet = action.payload;
            state.sdk = redpepperSet.tables;
            return state;

        case ACTION_UPDATE_TABLE:
            var redpepperSet:redpepperSet = action.payload;
            var tableName = action.payload.tableName;
            state.sdk[tableName] = redpepperSet.tables[tableName];
            return state;

        default:
            return state;
    }
}










