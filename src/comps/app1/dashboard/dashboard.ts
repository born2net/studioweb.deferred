import {Component, ChangeDetectionStrategy, ElementRef, ViewChild} from "@angular/core";
import {Compbaser} from "../../compbaser/Compbaser";
import {ApplicationState} from "../../../store/application.state";
import {Store} from "@ngrx/store";
import {UserModel} from "../../../models/UserModel";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import ICanvas = fabric.ICanvas;
import {List} from 'immutable';
import {ResourcesModal} from "../../../store/imsdb.interfaces_auto";

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <h2>Dashboard</h2>
               <h4>user name: {{(userModel$ | async)?.getUser() }}</h4>
               <h4>account type: {{(userModel$ | async)?.getAccountType()}}</h4>
               <canvas #canvas width="300" height="300"></canvas>
               <button (click)="setZoom()">zoom</button>
               
           `,
})
export class Dashboard extends Compbaser {

    private userModel$: Observable<UserModel>;
    private fabricCanvas: ICanvas;

    @ViewChild('canvas')
    canvas;

    constructor(private store: Store<ApplicationState>) {
        super();
        this.userModel$ = this.store.select(store => store.appDb.userModel);

        this.store.select(store => store.storeData.msdb.table_campaigns).subscribe((v) => {
            console.log(v);
        })

        this.store.select(store => store.storeData.msdb.table_resources).subscribe((resourceModels:List<ResourcesModal>) => {
            console.log(resourceModels.get(4).getResourceName());
            console.log(resourceModels.get(4).getResourceBytesTotal());
        })

        setTimeout(()=>{
            this.store.dispatch({type:'UPD_TABLE_RESOURCES'})
            this.store.dispatch({type:'ADD_CAMPAIGN'})
        },2000)

    }

    private setZoom() {
        this.fabricCanvas.setZoom(_.random(1, 1.5));
    }

    ngOnInit() {
        this.fabricCanvas = new fabric.Canvas(this.canvas.nativeElement);
        var rect = new fabric.Rect({
            top: 100,
            left: 100,
            width: 60,
            height: 70,
            fill: 'red'
        });
        this.fabricCanvas.add(rect);
    }

    destroy() {
    }
}