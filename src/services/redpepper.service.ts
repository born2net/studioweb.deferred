import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IDataBaseManager, ILoadManager, IPepperConnection, IPepperAuthReply} from "../store/imsdb.interfaces";
import {TableNames} from "../store/imsdb.interfaces_auto";
import * as MsdbModels from "../store/imsdb.interfaces_auto";
import {StoreModel} from "../store/model/StoreModel";
import {List} from 'immutable';

@Injectable()
export class RedPepperService {

    private m_loaderManager: ILoadManager;
    private databaseManager: IDataBaseManager;

    public dbConnect(i_user, i_pass): Observable<any> {
        return Observable.create(observer => {
            this.m_loaderManager = new LoaderManager() as ILoadManager;
            this.databaseManager = this.m_loaderManager.m_dataBaseManager;

            this.m_loaderManager.create(i_user, i_pass, (pepperAuthReply: IPepperAuthReply) => {
                var pepperConnection: IPepperConnection = {
                    pepperAuthReply: pepperAuthReply,
                    dDataBaseManager: this.databaseManager,
                    loadManager: this.m_loaderManager,
                }
                observer.next(pepperConnection);
            });
        })
    }

    private capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public addCampaign(i_campaignName): { [tableName: string]: List<StoreModel> } {
        var campaigns = this.databaseManager.table_campaigns();
        var campaign = campaigns.createRecord();
        campaign.campaign_name = i_campaignName;
        campaigns.addRecord(campaign,undefined);
        var db:any = this.reduxifyMsTable('campaigns')
        return db.table_campaigns;

    }

    public reduxifyMsTable(tableNameTarget?: string): { [tableName: string]: List<StoreModel> } {
        var db: { [tableName: string]: List<StoreModel> } = {};
        var tablesNames = tableNameTarget ? [tableNameTarget] : TableNames;
        tablesNames.forEach((table, v) => {
            var tableName = 'table_' + table;
            var storeName = this.capitalizeFirstLetter(StringJS(table).camelize().s) + 'Modal';
            var storeModelList: List<StoreModel> = List<StoreModel>();
            $(this.databaseManager[tableName]().getAllPrimaryKeys()).each((k, primary_id) => {
                var record = this.databaseManager[tableName]().getRec(primary_id);
                var newClass: StoreModel = new MsdbModels[storeName](record);
                storeModelList = storeModelList.push(newClass);
            });
            db[tableName] = storeModelList;
            // console.log(`serialized ${tableName} total modals: ${list.size}`);
        });
        return db;
    }
}