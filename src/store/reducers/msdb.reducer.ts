import {StoreData} from "../store.data";
import {Action} from "@ngrx/store";
import {MSDB_INIT} from "../actions/appdb.actions";
import {ACTION_UPDATE_TABLE} from "../actions/msdb.actions";

export function storeData(state: StoreData, action: Action): StoreData {
    switch (action.type) {
        case MSDB_INIT:
            state.msdb = action.payload;
            return state;

        // case 'UPD_TABLE_RESOURCES':
        //     var r = new ResourcesModal({a: 1})
        //     state.msdb.table_resources = state.msdb.table_resources.push(r);
        //     return state;

        case ACTION_UPDATE_TABLE:
            state.msdb[action.payload.tableName] = action.payload.table;
            return state;


        // case 'MSDB2': {
        //     state.msdb = action.payload;
        //     var msdb = action.payload;
        //     var a = msdb.table_campaigns().getAllPrimaryKeys();
        //     var b = msdb.table_campaigns().m_name;
        //
        //
        //     var campaigns = msdb.table_campaigns();
        //     var campaign = campaigns.createRecord();
        //     campaign.campaign_name = 'foo';
        //     campaigns.addRecord(campaign);
        //
        //     // var m = Map(action.payload)
        //     // var g = m.get('m_businessData')
        //     // state.msdb = m;
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










