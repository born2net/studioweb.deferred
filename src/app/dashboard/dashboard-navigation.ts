import {Component, ChangeDetectionStrategy, trigger, transition, animate, state, style} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as screenTemplates from "../../libs/screen-templates.json";
import {IScreenTemplateData} from "../../comps/screen-template/screen-template";



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
    template: `<h2>Account Dashboard</h2>
                
               <chart [options]="options"></chart>
               
               <div *ngIf="templateData">
                    <screen-template [setTemplate]="templateData"></screen-template>
                </div>
                
    `,
})
export class Dashboard extends Compbaser {

    templateData: IScreenTemplateData;

    constructor() {
        super();
        this.options = {
            title : { text : 'simple chart' },
            series: [{
                data: [29.9, 71.5, 106.4, 129.2],
            }]
        };

        this.templateData = {
            i_selfDestruct: true,
            i_owner: this,
            resolution: '1920x1080',
            screenType: 'screenType11',
            orientation: 'HORIZONTAL',
            screenProps: screenTemplates['HORIZONTAL']['1920x1080']['screenType11'],
            scale: 14
        };

        // screenProps: screenTemplates[this.templateData['orientation']][this.templateData['resolution']][this.templateData['screenType']],
        this.templateData['screenProps'] = screenTemplates['HORIZONTAL']['1920x1080']['screenType11'];


        // _.forEach(screenTemplates,(v,k)=>{
        //     console.log('a'+k,v);
        // })
        
    }
    options: Object;

    
    destroy() {
    }
}