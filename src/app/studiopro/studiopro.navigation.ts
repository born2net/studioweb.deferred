import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {SelectItem} from 'primeng/primeng';
import {Observable} from "rxjs";
import {UserModel} from "../../models/UserModel";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application.state";

@Component({
    selector: 'StudioProNavigation',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    template: `
               <small class="release">studiopro
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
               
               <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
               <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
               <h4>total campaigns {{totalCampaigns}}</h4>
               <hr/>
               <small class="debug">{{me}}</small>
               <p-dropdown [options]="cities" ></p-dropdown>
               <hr/>
               <Infobox [value1]="lastLogin" value2="in seconds" value3="time since last login" icon="fa-clock-o"></Infobox>
           `,
})
export class StudioProNavigation extends Compbaser {

    constructor(private store: Store<ApplicationState>, private redPepperService: RedPepperService) {
        super();
        this.totalCampaigns = redPepperService.getCampaignIDs().length;
        this.cities = [];
        this.cities.push({label: 'Select City', value: null});
        this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
        this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
        this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
        this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
        this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});

        this.userModel$ = this.store.select(store => store.appDb.userModel);
    }

    public userModel$: Observable<UserModel>;

    totalCampaigns = 0;
    cities: SelectItem[];
    selectedCity: string;
    lastLogin = 'v9';

    ngOnInit() {
    }

    destroy() {
    }
}