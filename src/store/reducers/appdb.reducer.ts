import {IAppDb} from "../store.data";
import {UserModel} from "../../models/UserModel";
import * as StoreActions from "../actions/appdb.actions";
import * as EffectActions from "../effects/appdb.effects";
import * as ActionsConst from "../actions/appdb.actions";
import * as _ from 'lodash';
import {Map, List} from 'immutable';
import {StationModel} from "../../models/StationModel";
import {Lib} from "../../Lib";
import {FasterqLineModel} from "../../models/FasterqLineModel";

const baseUrl = 'https://galaxy.signage.me/WebService/ResellerService.ashx';
export const appBaseUrlCloud = 'https://secure.digitalsignage.com';


export function appDb(state: IAppDb, action: any): IAppDb {

    switch (action.type) {
        case StoreActions.APP_INIT:
            state.appStartTime = Date.now();
            state.appBaseUrl = `${baseUrl}`;
            return state;

        case ActionsConst.ACTION_UISTATE_UPDATE: {
            _.merge(state.uiState,action.payload);
            return state;
        }

        case EffectActions.EFFECT_UPDATE_USER_MODEL:
            var userModel: UserModel = action.payload;
            state.userModel = userModel.setTime();
            state.appBaseUrlUser = `${baseUrl}?resellerUserName=${userModel.getKey('user')}&resellerPassword=${userModel.getKey('pass')}`;
            state.appBaseUrlCloud = `${appBaseUrlCloud}/END_POINT/${userModel.getKey('user')}/${userModel.getKey('pass')}`;
            state.appBaseUrlServices = `https://secure.digitalsignage.com${Lib.DevMode() ? ':443' : ''}`;
            return state;

        case EffectActions.EFFECT_LOADED_STATIONS:
            var stations: List<StationModel> = action.payload;
            state.stations = stations;
            return state;

        case EffectActions.EFFECT_LOADED_FASTERQ_LINES:
            var lines: List<FasterqLineModel> = action.payload;
            state.fasterq.lines = lines;
            return state;

        case EffectActions.EFFECT_TWO_FACTOR_UPDATED:
            var userModel = state.userModel;
            userModel = userModel.setTwoFactorRequired(action.payload);
            state.userModel = userModel.setTime();
            return state;

        case StoreActions.ACTION_TWO_FACTOR_REMOVED:
            var userModel = state.userModel;
            userModel = userModel.setTwoFactorRequired(false);
            state.userModel = userModel.setTime();
            return state;

        case EffectActions.EFFECT_AUTH_STATUS:
            state.appAuthStatus = Map({authStatus: action.payload});
            return state;

        default:
            return state;
    }
}



