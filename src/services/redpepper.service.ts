import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
// import * as _ from 'lodash';
import {Observable} from "rxjs";

export interface IPepperConnection {
    pepperAuthReply:IPepperAuthReply;
    dDataBaseManager:IDataBaseManager;
    loadManager:ILoadManager;
}

interface IPepperAuthReply {
    error: string;
    status: boolean;
    warning: string;
}

interface IDataBaseManager {
    m_businessData: {};
    m_selectedDataBase: number;

}
interface ILoadManager {
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


@Injectable()
export class RedPepperService {

    constructor(private store: Store<ApplicationState>) {
        // this.store.select(store => store.appDb.userModel).subscribe((userModel: UserModel) => {
        //     this.userModel = userModel;
        // })
    }

    private loaderManager: ILoadManager;
    private msdb: IDataBaseManager;

    public dbConnect(i_user, i_pass): Observable<any> {
        return Observable.create(observer => {
            this.loaderManager = new LoaderManager() as ILoadManager;
            this.msdb = this.loaderManager.m_dataBaseManager;
            
            this.loaderManager.create(i_user, i_pass, (pepperAuthReply: IPepperAuthReply) => {
                var pepperConnection:IPepperConnection = {
                    pepperAuthReply: pepperAuthReply,
                    dDataBaseManager: this.msdb,
                    loadManager: this.loaderManager,
                }
                observer.next(pepperConnection);

                // if (i_result.status) {
                // var domain = loaderManager['m_domain'];
                // var resellerInfo =  loaderManager['m_resellerInfo'];
                // var whiteLabel = parseInt($(resellerInfo).find('WhiteLabel').attr('enabled'));
                // var resellerId = parseInt($(resellerInfo).find('BusinessInfo').attr('businessId'));
                // var resellerName = $(resellerInfo).find('BusinessInfo').attr('name');
                // var businessID = loaderManager['m_businessId'];
                // var eri = loaderManager['m_eri'];
                // var authTime = Date.now();
                // var components = jQuery(resellerInfo).find('InstalledApps').find('App');
                // var installComponents = {};
                // _.each(components, function (component) {
                //     if (Number(jQuery(component).attr('installed')) == 1)
                //         installComponents[jQuery(component).attr('id')] = 1;
                // });
                // }
            });

        })


    }
}