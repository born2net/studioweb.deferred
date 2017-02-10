import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'block-prop',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="release">my component
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
               <small class="debug">{{me}}</small>
           `,
})
export class BlockProp extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}