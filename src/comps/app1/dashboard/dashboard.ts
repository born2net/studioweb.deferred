import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "../../compbaser/Compbaser";
import {ApplicationState} from "../../../store/application-state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../../models/UserModel";
import {Observable} from "rxjs";
import * as _ from 'lodash';

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <h2>Dashboard</h2>
               <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
               <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
               
               <canvas id="canvas" width="300" height="300"></canvas>
               <button (click)="setZoom()">zoom</button>
               
           `,
})
export class Dashboard extends Compbaser {

    private userModel$: Observable<UserModel>;

    private canvas;
    constructor(private store: Store<ApplicationState>) {
        super();
        this.userModel$ = this.store.select(store => store.appDb.userModel);


        setTimeout(()=>{
            this.canvas = new fabric.Canvas('canvas');


            var rect = new fabric.Rect({
                top : 100,
                left : 100,
                width : 60,
                height : 70,
                fill : 'red'
            });

            this.canvas.add(rect);
            
        },3000)



    }

    private setZoom(){
        this.canvas.setZoom(_.random(1,3));
    }

    destroy() {
    }
}