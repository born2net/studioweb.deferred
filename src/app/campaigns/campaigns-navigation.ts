import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {routerTransition} from "../route-animation";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    // new animation, can't add due to angular language service bug
    host: {
        '[@routerTransition]': '',
        '[style.display]': "'block'"
    },
    animations: [routerTransition()],

    // old animation
    // host: {
    //     '[@routeAnimation]': 'true',
    //     '[style.display]': "'block'"
    // },
    // animations: [
    //     trigger('routeAnimation', [
    //         state('*', style({opacity: 1})),
    //         transition('void => *', [
    //             style({opacity: 0}),
    //             animate(333)
    //         ]),
    //         transition('* => void', animate(333, style({opacity: 0})))
    //     ])
    // ],

    template: `
        <small class="debug">campaigns-navigation</small>
        <panel-split-container>
            <panel-split-main>
                <campaigns>
                </campaigns>
            </panel-split-main>
            <panel-split-side>
                <props></props>
            </panel-split-side>
        </panel-split-container>
`
})
export class CampaignsNavigation extends Compbaser {
    constructor(){
        super();
    }
}

