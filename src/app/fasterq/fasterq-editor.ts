import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'fasterq-editor',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fasterq-editor.html'
})
export class FasterqEditor extends Compbaser implements AfterViewInit {

    constructor(private yp: YellowPepperService) {
        super();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}
