import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {FasterqLineModel} from "../../models/FasterqLineModel";

@Component({
    selector: 'fasterq-line-props',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        {{lineSelected?.lineName}}
    `,
})
export class FasterqLineProps extends Compbaser implements AfterViewInit {

    lineSelected: FasterqLineModel;

    constructor(private yp: YellowPepperService) {
        super();

        this.cancelOnDestroy(
            this.yp.listenFasterqLineSelected()
                .subscribe((i_lineSelected: FasterqLineModel) => {
                    this.lineSelected = i_lineSelected;
                }, (e) => console.error(e))
        )
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}
