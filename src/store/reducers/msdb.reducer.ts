import {Action} from "@ngrx/store";
import {MSDB_INIT} from "../actions/appdb.actions";
import {ACTION_UPDATE_TABLE} from "../actions/msdb.actions";
import {IMsDatabase} from "../store.data";
import {redpepperSet} from "../../services/redpepper.service";
import {ISDK} from "../imsdb.interfaces_auto";

export function msDatabase(state: IMsDatabase, action: Action): IMsDatabase {
    switch (action.type) {
        case MSDB_INIT:
            var redpepperSet:redpepperSet = action.payload;
            state.sdk = redpepperSet.tables;
            return state;

        // case 'UPD_TABLE_RESOURCES':
        //     var r = new ResourcesModal({a: 1})
        //     state.sdk.table_resources = state.sdk.table_resources.push(r);
        //     return state;

        case ACTION_UPDATE_TABLE:
            var redpepperSet:redpepperSet = action.payload;
            var tableName = action.payload.tableName;
            state.sdk[tableName] = redpepperSet.tables[tableName];
            return state;

        // case 'MSDB2': {
        //     state.sdk = action.payload;
        //     var sdk = action.payload;
        //     var a = sdk.table_campaigns().getAllPrimaryKeys();
        //     var b = sdk.table_campaigns().m_name;
        //
        //
        //     var campaigns = sdk.table_campaigns();
        //     var campaign = campaigns.createRecord();
        //     campaign.campaign_name = 'foo';
        //     campaigns.addRecord(campaign);
        //
        //     // var m = Map(action.payload)
        //     // var g = m.get('m_businessData')
        //     // state.sdk = m;
        //     return state;
        //
        //     // var c = this.m_msdb.table_campaigns().m_fields[2].field
        //     // var d = this.m_msdb.table_campaigns().m_fields[0].isNullAble;
        //     // var e = this.m_msdb.table_campaigns().m_fields[1].field;
        // }

        default:
            return state;
    }
}










