import {Component, ChangeDetectionStrategy, ViewChild, trigger, transition, animate, state, style} from "@angular/core";
import {ApplicationState} from "../../store/application.state";
import {Store} from "@ngrx/store";
import {Compbaser} from "ng-mslib";
import {Router} from "@angular/router";
import {RedPepperService} from "../../services/redpepper.service";
import {BlockService} from "../blocks/block-service";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    providers: [BlockService,
        {
            provide: "BLOCK_PLACEMENT",
            useValue: 'SCENE'
        }
    ],
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
    styles: [`
        button {
            width: 200px;
            margin: 5px;
        }
    `],
    template: `
        <h2>Scenes</h2>
        <div style="display: flex">
            <canvas #canvas1 width="300" height="300"></canvas>
            <canvas #canvas2 width="300" height="300"></canvas>
        </div>
        <scene-props-manager></scene-props-manager>
    `,
})
export class ScenesNavigation extends Compbaser {

    public fabricCanvas1: fabric.IStaticCanvas;
    public fabricCanvas2: fabric.IStaticCanvas;

    @ViewChild('canvas1')
    canvas1;

    @ViewChild('canvas2')
    canvas2;

    constructor(private blockService:BlockService) {
        super();
        console.log(this.blockService.getServiceType());
    }

    ngOnInit() {
        this.fabricCanvas1 = new fabric.Canvas(this.canvas1.nativeElement);
        var rect = new fabric.Rect({
            top: 100,
            left: 100,
            width: 60,
            height: 70,
            fill: 'blue'
        });
        this.fabricCanvas1.add(rect);

        this.fabricCanvas2 = new fabric.Canvas(this.canvas2.nativeElement);
        var circle = new fabric.Circle({
            radius: 30,
            stroke: 'green',
            fill: 'green'
        });
        this.fabricCanvas2.add(circle);
    }


    destroy() {
    }
}

