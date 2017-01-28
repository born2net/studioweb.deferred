
import {ChangeDetectionStrategy, Component, ElementRef} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CommBroker} from "../../services/CommBroker";
import {RedPepperService} from "../../services/redpepper.service";

@Component({
    selector: 'sequencer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
    `,
})
export class Sequencer extends Compbaser {

    constructor(private el: ElementRef, private comBroker: CommBroker, private pepper: RedPepperService) {
        super();
        var self = this;
    }

    ngOnInit() {
    }

    destroy() {
    }
}