import {animate, ChangeDetectionStrategy, Component, state, style, transition, trigger} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {BlockService} from "../blocks/block-service";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    providers: [BlockService, {
        provide: "BLOCK_PLACEMENT",
        useValue: 'SCENE'
    }
    ],
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
        <small class="debug">scene-navigation</small>
        <panel-split-container>
            <panel-split-main>
                <scenes>
                </scenes>
            </panel-split-main>
            <panel-split-side>
                <scene-props-manager></scene-props-manager>
            </panel-split-side>
        </panel-split-container>
    `
})
export class ScenesNavigation extends Compbaser {
}

