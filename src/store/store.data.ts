import {Map, List} from 'immutable';
import {UserModel} from "../models/UserModel";
import {AuthenticateFlags, SideProps} from "./actions/appdb.actions";
import {ISDK, CampaignBoardsModel} from "../store/imsdb.interfaces_auto";
import {appDb} from "../store/reducers/appdb.reducer";
import {msDatabase} from "../store/reducers/msdb.reducer";
import {storeFreeze} from "ngrx-store-freeze";
import {ActionReducer, combineReducers} from "@ngrx/store";
import {ApplicationState} from "./application.state";
import {compose} from "@ngrx/core";
import {MainAppShowStateEnum} from "../app/app-component";

const reducers = {msDatabase, appDb};
export const developmentReducer: ActionReducer<ApplicationState> = compose(storeFreeze, combineReducers)(reducers);
export const productionReducer: ActionReducer<ApplicationState> = combineReducers(reducers);



export interface IMsDatabase {
    threads: { [key: number]: any };
    thread: {
        id: number;
    },
    sdk: ISDK
}

export interface IUiStateCampaign  {
    campaignTimelineChannelSelected?: number;
    campaignTimelineBoardViewerSelected?: number;
    campaignCreateOrientation?:number,
    campaignCreateResolution?:string,
    campaignCreateName?:string,
    campaignSelected?: number;
    timelineSelected?: number;
    blockChannelSelected?:number;
}

export interface IUiStateScene  {
    sceneSelected?: number;
    blockSelected?: number;
    fabric?: {
        scale?:number;
    }
}

export interface IUiState {
    mainAppState?: MainAppShowStateEnum;
    previewMode?:number;
    uiSideProps?:number;
    campaign?: IUiStateCampaign;
    scene?: IUiStateScene;
}

export interface IAppDb {
    uiState: IUiState;
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
    thread: {id: -1},
    sdk: null
}

export const INITIAL_APP_DB: IAppDb = {
    uiState: {
        mainAppState: MainAppShowStateEnum.INIT,
        previewMode: -1,
        uiSideProps: SideProps.none,
        campaign: {
            campaignTimelineBoardViewerSelected: -1,
            campaignTimelineChannelSelected: -1,
            campaignSelected: -1,
            timelineSelected: -1,
            campaignCreateOrientation: -1,
            blockChannelSelected: -1,
            campaignCreateResolution: '',
            campaignCreateName: ''
        },
        scene: {
            sceneSelected: -1,
            blockSelected: -1,
            fabric: {
                scale: -1
            }
        }
    },
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