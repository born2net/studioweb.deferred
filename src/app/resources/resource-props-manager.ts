import {Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ResourcesModel} from "../../store/imsdb.interfaces_auto";
import {Lib} from "../../Lib";
import {RedPepperService} from "../../services/redpepper.service";

@Component({
    selector: 'resource-props-manager',
    styles: [`
        ul {
            padding: 0
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <br/>
        <br/>


        <ul matchBodyHeight="50" style="overflow-y: auto; overflow-x: hidden" [ngSwitch]="m_sideProps$ | async">
            <div *ngSwitchCase="m_sidePropsEnum.resourceProps">
                <h5><i class="fa fa-{{m_formatIcon}}"></i>resource property</h5>
                <input class="form-control" inlength="1" placeholder="resource name" (blur)="_onUpdateResourceName($event)" [(ngModel)]="m_resourceName" type="text"/>
                <div [ngSwitch]="m_resourceType">
                    <div *ngSwitchCase="'image'">
                        <h4>image</h4>
                    </div>
                </div>
                <div [ngSwitch]="m_resourceType">
                    <div *ngSwitchCase="'video'">
                        <div style="width: 100% height: 200px">
                            <media-player></media-player>
                        </div>
                    </div>
                </div>
                <div [ngSwitch]="m_resourceType">
                    <div *ngSwitchCase="'swf'">
                        <h4>flash</h4>
                    </div>
                </div>
                
            </div>
            
            <div *ngSwitchCase="m_sidePropsEnum.miniDashboard">
                <h4>resource dashboard</h4>
            </div>
            
        </ul>



    `,
})
export class ResourcePropsManager extends Compbaser {

    m_resourceType;
    m_sideProps$: Observable<SideProps>;
    m_sidePropsEnum = SideProps;
    m_uiUserFocusItem$: Observable<SideProps>;
    m_formatIcon = '';
    m_resourceName = '';
    m_selectedResoure: ResourcesModel;

    constructor(private yp: YellowPepperService, private rp:RedPepperService) {
        super();
        this.m_uiUserFocusItem$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);

        this.cancelOnDestroy(
            //
            this.yp.listenResourceSelected()
                .subscribe((i_resource: ResourcesModel) => {
                    this.m_selectedResoure = i_resource;
                    this.m_resourceName = this.m_selectedResoure.getResourceName();
                    switch (this.m_selectedResoure.getResourceType()){
                        case 'jpg':
                        case 'svg':
                        case 'png': {
                            this.m_formatIcon = 'image';
                            this.m_resourceType = 'image';
                            break;
                        }
                        case 'm4v':
                        case 'mp4':
                        case 'flv': {
                            this.m_formatIcon = 'video-camera';
                            this.m_resourceType = 'video';
                            break;
                        }
                        case 'swf': {
                            this.m_formatIcon = 'bolt';
                            this.m_resourceType = 'swf';
                            break;
                        }
                    }
                }, (e) => console.error(e))
        )

    }

    _onUpdateResourceName(event){
        var text = Lib.CleanProbCharacters(this.m_resourceName, 1);
        this.rp.setResourceRecord(this.m_selectedResoure.getResourceId(), 'resource_name', text);
        this.rp.reduxCommit();
        // var elem = self.$el.find('[data-resource_id="' + this.m_selectedResoure.getResourceId() + '"]');
        // elem.find('span').text(text);
    }

    ngOnInit() {
    }

    destroy() {
    }
}