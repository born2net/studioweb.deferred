import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";

@Component({
    selector: 'channel-block-props',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="release">my component
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
               <small class="debug">{{me}}</small>
               <h3>channel block props</h3>
           `,
})
export class ChannelBlockProps extends Compbaser {

    constructor() {
        super();
    }

    ngOnInit() {
    }

    destroy() {
    }
}