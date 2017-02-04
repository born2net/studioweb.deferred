import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/debounceTime";
import * as xml2js from "xml2js";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../application.state";
import {Actions, Effect} from "@ngrx/effects";
import {Observable} from "rxjs";
import {UserModel} from "../../models/UserModel";
import {AuthenticateFlags} from "../actions/appdb.actions";
import {RedPepperService} from "../../services/redpepper.service";
import {IPepperConnection} from "../../store/imsdb.interfaces";

export const EFFECT_AUTH_START = 'EFFECT_AUTH_START';
export const EFFECT_AUTH_END = 'EFFECT_AUTH_END';
export const EFFECT_UPDATE_USER_MODEL = 'EFFECT_UPDATE_USER_MODEL';
export const EFFECT_AUTH_STATUS = 'EFFECT_AUTH_STATUS';
export const EFFECT_TWO_FACTOR_AUTH = 'EFFECT_TWO_FACTOR_AUTH';
export const EFFECT_TWO_FACTOR_UPDATING = 'EFFECT_TWO_FACTOR_UPDATING';
export const EFFECT_TWO_FACTOR_UPDATED = 'EFFECT_TWO_FACTOR_UPDATED';

@Injectable()
export class AppDbEffects {
    parseString;

    constructor(private actions$: Actions,
                private store: Store<ApplicationState>,
                private redPepperService: RedPepperService,
                private http: Http) {

        // todo: disabled injection as broken in AOT
        // @Inject('OFFLINE_ENV') private offlineEnv,
        
        this.parseString = xml2js.parseString;
    }

    @Effect({dispatch: true})
    authTwoFactor$: Observable<Action> = this.actions$.ofType(EFFECT_TWO_FACTOR_AUTH)
        .switchMap(action => this.authTwoFactor(action))
        .map(authStatus => ({type: EFFECT_AUTH_END, payload: authStatus}));

    private authTwoFactor(action: Action): Observable<any> {
        this.store.dispatch({type: EFFECT_AUTH_STATUS, payload: AuthenticateFlags.TWO_FACTOR_CHECK})

        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(baseUrl => {
                const url = baseUrl.replace('END_POINT', 'twoFactor') + `/${action.payload.token}/${action.payload.enable}`
                return this.http.get(url)
                    .catch((err: any) => {
                        alert('Error getting two factor');
                        return Observable.throw(err);
                    })
                    .finally(() => {
                    })
                    .map(res => {
                        var status = res.json();
                        if (status.result) {
                            this.store.dispatch({type: EFFECT_AUTH_STATUS, payload: AuthenticateFlags.TWO_FACTOR_PASS})
                        } else {
                            this.store.dispatch({type: EFFECT_AUTH_STATUS, payload: AuthenticateFlags.TWO_FACTOR_FAIL})
                        }
                    })
            })
    }

    @Effect()
    updatedTwoFactor$: Observable<Action> = this.actions$.ofType(EFFECT_TWO_FACTOR_UPDATING)
        .switchMap(action => this.updatedTwoFactor(action))
        .map(authStatus => ({type: EFFECT_AUTH_END, payload: authStatus}));

    private updatedTwoFactor(action: Action): Observable<any> {
        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(baseUrl => {
                const url = baseUrl.replace('END_POINT', 'twoFactor') + `/${action.payload.token}/${action.payload.enable}`
                return this.http.get(url)
                    .catch((err: any) => {
                        alert('Error getting two factor');
                        return Observable.throw(err);
                    })
                    .finally(() => {
                    })
                    .map(res => {
                        var status = res.json().result;
                        status == true ? this.store.dispatch({
                                type: EFFECT_AUTH_STATUS,
                                payload: AuthenticateFlags.TWO_FACTOR_UPDATE_PASS
                            }) : this.store.dispatch({
                                type: EFFECT_AUTH_STATUS,
                                payload: AuthenticateFlags.TWO_FACTOR_UPDATE_FAIL
                            })
                        this.store.dispatch({
                            type: EFFECT_TWO_FACTOR_UPDATED,
                            payload: status
                        })
                    })
            })
    }


    @Effect()
    authUser$: Observable<Action> = this.actions$.ofType(EFFECT_AUTH_START)
        .switchMap(action => this.authUser(action))
        .map(authStatus => ({type: EFFECT_AUTH_END, payload: authStatus}));

    private authUser(action: Action): Observable<any> {
        let userModel: UserModel = action.payload;
        this.store.dispatch({type: EFFECT_UPDATE_USER_MODEL, payload: userModel});

        return this.redPepperService.dbConnect(userModel.user(), userModel.pass()).take(1).map((pepperConnection: IPepperConnection) => {

            if (pepperConnection.pepperAuthReply.status == false) {
                userModel = userModel.setAuthenticated(false);
                userModel = userModel.setAccountType(-1);
                this.store.dispatch({type: EFFECT_UPDATE_USER_MODEL, payload: userModel});
                this.store.dispatch({type: EFFECT_AUTH_STATUS, payload: AuthenticateFlags.WRONG_PASS});
                return;

            } else {

                if (pepperConnection.pepperAuthReply.warning == 'not a studioLite account') {
                    // console.log('pro account!!');
                } else {
                    // console.log('lite account');
                }

                var whiteLabel = jQuery(pepperConnection.loadManager.m_resellerInfo).find('WhiteLabel');//.attr('enabled'));
                var resellerId = jQuery(pepperConnection.loadManager.m_resellerInfo).find('BusinessInfo');//.attr('businessId'));
                var resellerDataString = jQuery(pepperConnection.loadManager.m_resellerInfo).children()[0].innerHTML;

                var resellerDataJson = {};
                const boundCallback = Observable.bindCallback(this.processXml, (xmlData: any) => xmlData);
                boundCallback(this, resellerDataString).subscribe((i_resellerDataJson) => {
                    resellerDataJson = i_resellerDataJson;
                })
                userModel = userModel.setAuthenticated(true);
                userModel = userModel.setAccountType(AuthenticateFlags.USER_ACCOUNT);
                userModel = userModel.setResellerInfo(pepperConnection.loadManager.m_resellerInfo);
                userModel = userModel.setResellerName(
                    jQuery(pepperConnection.loadManager.m_resellerInfo)
                        .find('BusinessInfo')
                        .attr('name')
                );
                userModel = userModel.setResellerId(
                    Number(jQuery(pepperConnection.loadManager.m_resellerInfo)
                        .find('BusinessInfo')
                        .attr('businessId'))
                );
                userModel = userModel.setEri(pepperConnection.loadManager.m_eri);
                userModel = userModel.setResellerWhiteLabel(resellerDataJson);

                this.store.dispatch({type: EFFECT_UPDATE_USER_MODEL, payload: userModel});
                this.store.dispatch({
                    type: EFFECT_AUTH_STATUS, payload: AuthenticateFlags.USER_ACCOUNT
                });

                /////////////////////////////////////////////////////////////////////////////
                // todo: currently if logging in with enterprise account, dbConnect will timeout,
                // todo: Alon needs to fix and we can dispatch code below
                // userModel = userModel.setAuthenticated(true);
                // userModel = userModel.setAccountType(AuthenticateFlags.ENTERPRISE_ACCOUNT);
                // this.store.dispatch({type: EFFECT_UPDATE_USER_MODEL, payload: userModel});
                // this.store.dispatch({
                //     type: EFFECT_AUTH_STATUS, payload: AuthenticateFlags.ENTERPRISE_ACCOUNT
                // });
                /////////////////////////////////////////////////////////////////////////////
            }

            // if passed check for two factor
            if (userModel.getAuthenticated()) {
                this.twoFactorCheck()
                    .take(1)
                    .subscribe((twoFactorResult) => {
                        if (window['offlineDevMode']) {
                            return this.store.dispatch({
                                type: EFFECT_AUTH_STATUS,
                                payload: AuthenticateFlags.AUTH_PASS_NO_TWO_FACTOR
                            });
                        }
                        userModel = userModel.setBusinessId(twoFactorResult.businessId);
                        userModel = userModel.setTwoFactorRequired(twoFactorResult.enabled);
                        this.store.dispatch({type: EFFECT_UPDATE_USER_MODEL, payload: userModel});
                        if (twoFactorResult.enabled) {
                            this.store.dispatch({
                                type: EFFECT_AUTH_STATUS,
                                payload: AuthenticateFlags.TWO_FACTOR_ENABLED
                            });
                        } else {
                            this.store.dispatch({
                                type: EFFECT_AUTH_STATUS,
                                payload: AuthenticateFlags.AUTH_PASS_NO_TWO_FACTOR
                            });
                        }
                    })
            }
        });
    }

    private processXml(context, xmlData, cb) {
        context.parseString(xmlData, {attrkey: 'attr'}, function (err, result) {
            if (err || !result)
                return cb(null);
            return cb(result);
        })
    }

    private twoFactorCheck(): Observable<any> {
        return this.store.select(store => store.appDb.appBaseUrlCloud)
            .take(1)
            .mergeMap(appBaseUrlCloud => {
                if (window['offlineDevMode']) {
                    return Observable.of({});
                }
                var url = appBaseUrlCloud.replace('END_POINT', 'twoFactorCheck');
                return this.http.get(url)
                    .catch((err: any) => {
                        return Observable.throw(err);
                    })
                    .map(res => {
                        return res.json()
                    })
            })
    }
}


// this.store.select(store => store.appDb.appBaseUrl)
//     .take(1)
//     .mergeMap(baseUrl => {
//         const url = `${baseUrl}?command=GetCustomers&resellerUserName=${userModel.user()}&resellerPassword=${userModel.pass()}`;
//         return this.http.get(url)
//             .catch((err: any) => {
//                 alert('Error getting order details');
//                 return Observable.throw(err);
//             })
//             .finally(() => {
//             })
//             .map(res => {
//                 return res.text()
//             }).flatMap((i_xmlData: string) => {
//                 const boundCallback = Observable.bindCallback(this.processXml, (xmlData: any) => xmlData);
//                 return boundCallback(this, i_xmlData)
//             }).map(result => {
//
//
//             })
//     })
// this.redPepperService.dbConnect(userModel.user(), userModel.pass(), (result:{[key: string]: string}) => {
//     console.log(result);
// })
