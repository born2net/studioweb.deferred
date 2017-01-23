import {Action} from "@ngrx/store";
import {ACTION_INJECT_SDK} from "../actions/appdb.actions";
import {IMsDatabase} from "../store.data";
import {redpepperTables} from "../../services/redpepper.service";
import {List, Map} from "immutable";
import * as _ from "lodash";

export function msDatabase(state: IMsDatabase, action: Action): IMsDatabase {
    switch (action.type) {

        case 'ALL': {
            state.uiState.campaign.campaignSelected = Map({id: 1});
            state.uiState.campaign.timelineSelected = Map({id: 1});
            return state;
        }

        case 'CAMP': {
            state.uiState.campaign.campaignSelected = Map({id: 2});
            return state;
        }

        case 'TIME': {
            state.uiState.campaign.timelineSelected = Map({id: _.random(1,100)});
            return state;
        }

        /**
         * this special reducer can receive a single or array of redpepperTables and reduce it into the new store state
         * if multiple redpepperTables are given, we reduce it in such a way that if duplicate tables of the same type
         * are given, the last one (i.e.: has the freshest data) wins and gets injected into the state.sdk
         *
         */
        case ACTION_INJECT_SDK:
            if (!state.sdk) {
                var redpepperList: Array<redpepperTables> = action.payload;
                state.sdk = redpepperList[0].tables;
                return state;
            }
            var redpepperList: Array<redpepperTables> = action.payload;
            var redpepperReducer = {};
            redpepperList.map((redpepperSet: redpepperTables) => {
                redpepperSet.tableNames.map((tableName: string) => {
                    redpepperReducer[tableName] = redpepperSet.tables[tableName];
                })
            })
            _.forEach(redpepperReducer, (storeModelList: List<Storage>, tableName) => {
                state.sdk[tableName] = storeModelList;
            })
            return state;

        default:
            return state;
    }
}

