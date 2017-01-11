
import {IDataManager_proto} from "./imsdb.interfaces_auto";

export interface IDataBaseManager extends IDataManager_proto {
    m_businessData: {
        string: DataBaseModueBase;
    },
    m_selectedDataBase: DataBaseModueBase;
}


export interface IPepperConnection {
    pepperAuthReply: IPepperAuthReply;
    dDataBaseManager: IDataBaseManager;
    loadManager: ILoadManager;
}

export interface IPepperAuthReply {
    error: string;
    status: boolean;
    warning: string;
}

export interface DataBaseModueBase {
    m_tableList: Array<any>;
    m_table: {}
}

export interface ILoadManager {
    create: (user: string, pass: string, func: (result: any) => void) => void;
    m_resellerInfo: XMLDocument;
    m_businessId: number;
    m_domain: string;
    m_eri: string;
    filesToUpload: Array<any>;
    m_dataBaseManager: IDataBaseManager;
    m_shortcutMap: {};
    m_userpass64: any;
}
