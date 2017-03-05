import {Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ChangeDetectorRef, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {ISceneData, YellowPepperService} from "../../services/yellowpepper.service";
import {BlockSceneBase} from "../blocks/block-scene-base";
import {BlockService} from "../blocks/block-service";

@Component({
    selector: 'scene-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <scene-toolbar (onToolbarAction)="_onToolbarAction($event)"></scene-toolbar>
        <div id="sceneCanvasContainer" data-toggle="context" data-target="#sceneContextMenu" class="yScroll context sceneElements" style=" overflow-x: visible" align="center"></div>
        <!--<div style="display: flex">-->
        <!--<canvas #canvas1 width="300" height="300"></canvas>-->
        <!--<canvas #canvas2 width="300" height="300"></canvas>-->
        <!--</div>-->
    `
})
export class SceneEditor extends Compbaser implements AfterViewInit {

    public fabricCanvas1: fabric.IStaticCanvas;
    public fabricCanvas2: fabric.IStaticCanvas;

    @ViewChild('canvas1')
    canvas1;

    @ViewChild('canvas2')
    canvas2;

    constructor(private yp: YellowPepperService, private cd: ChangeDetectorRef, private bs:BlockService) {
        super();
        this.cd.detach();

        var a = new BlockSceneBase(bs);

        this.cancelOnDestroy(
            this.yp.listenSceneSelected()
                .subscribe((i_scene: ISceneData) => {
                    // console.log(i_scene.scene_id);
                }, (e) => console.error(e))
        );
    }

    ngAfterViewInit() {
    }

    ngOnInit() {
        // this.fabricCanvas1 = new fabric.Canvas(this.canvas1.nativeElement);
        // var rect = new fabric.Rect({
        //     top: 100,
        //     left: 100,
        //     width: 60,
        //     height: 70,
        //     fill: 'blue'
        // });
        // this.fabricCanvas1.add(rect);
        //
        // this.fabricCanvas2 = new fabric.Canvas(this.canvas2.nativeElement);
        // var circle = new fabric.Circle({
        //     radius: 30,
        //     stroke: 'green',
        //     fill: 'green'
        // });
        // this.fabricCanvas2.add(circle);
    }

    @Output()
    onGoBack:EventEmitter<any> = new EventEmitter<any>();


    _onToolbarAction(event) {
        con('toolbar ' + event);
        switch (event) {
            case 'back': {
                this.onGoBack.emit();
                break;
            }
        }
    }

    destroy() {
    }
}