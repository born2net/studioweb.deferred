import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {RedPepperService} from "../../services/redpepper.service";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application.state";

@Component({
    selector: 'ScenesNavigation',
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
    template: `
               <small class="release">scenes
                   <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
               </small>
           `,
})
export class ScenesNavigation extends Compbaser {

    constructor(private store: Store<ApplicationState>, private redPepperService: RedPepperService) {
        super();
    }

    destroy() {
    }
}