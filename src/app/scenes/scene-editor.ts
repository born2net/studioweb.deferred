import {Component, ChangeDetectionStrategy, AfterViewInit, ViewChild} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISceneData, YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'scene-editor',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <div style="display: flex">
                   <canvas #canvas1 width="300" height="300"></canvas>
                   <canvas #canvas2 width="300" height="300"></canvas>
               </div>
           `
})
export class SceneEditor extends Compbaser implements AfterViewInit {

    public fabricCanvas1: fabric.IStaticCanvas;
    public fabricCanvas2: fabric.IStaticCanvas;

    @ViewChild('canvas1')
    canvas1;

    @ViewChild('canvas2')
    canvas2;

    constructor(private yp:YellowPepperService) {
        super();
        this.cancelOnDestroy(
            this.yp.listenSceneSelected()
                .subscribe((i_scene: ISceneData) => {
                console.log(i_scene.scene_id);
                }, (e) => console.error(e))
        );
    }

    ngAfterViewInit(){
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