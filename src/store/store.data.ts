import {Map, List} from 'immutable';
import {UserModel} from "../models/UserModel";
import {AuthenticateFlags} from "./actions/appdb.actions";
import {ISDK} from "../store/imsdb.interfaces_auto";

export interface IMsDatabase {
    participants: { [key: number]: any };
    threads: { [key: number]: any };
    sdk: ISDK
}

export interface IAppDb {
    totalStations: string;
    appStartTime: number;
    appBaseUrl: string;
    userModel: UserModel,
    cloudServers: string;
    serversStatus: string;
    appAuthStatus: Map<string,AuthenticateFlags>;
    appBaseUrlUser: string;
    appBaseUrlCloud: string;
}

export const INITIAL_STORE_DATA: IMsDatabase = {
    threads: {},
    participants: {},
    sdk: null
};


export const INITIAL_APP_DB: IAppDb = {
    totalStations: '',
    appStartTime: -1,
    appBaseUrl: '',
    userModel: new UserModel({
        user: '',
        pass: '',
        authenticated: false,
        businessId: -1,
        rememberMe: false,
        twoFactorRequired: false,
        accountType: -1
    }),
    appAuthStatus: Map({authStatus: AuthenticateFlags.NONE}),
    cloudServers: '',
    serversStatus: '',
    appBaseUrlUser: '',
    appBaseUrlCloud: ''
};