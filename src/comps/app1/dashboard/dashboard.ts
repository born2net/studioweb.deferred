import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";
import {ApplicationState} from "../../../store/application.state";
import {Store} from "@ngrx/store";
import {RedPepperService} from "../../../services/redpepper.service";
import {Compbaser} from "ng-mslib";
import {Router} from "@angular/router";

@Component({
    selector: 'Dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
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
    template: `<h2>StudioWeb</h2>`,
})
export class Dashboard extends Compbaser {

    constructor(private store: Store<ApplicationState>, private redPepperService: RedPepperService, private router: Router) {
        super();
    }

    destroy() {
    }
}