import {Component, ChangeDetectionStrategy, Input} from "@angular/core";
import {Compbaser} from "ng-mslib";
import * as _ from 'lodash';



@Component({
    selector: 'screen-template',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
           `,
})
export class ScreenTemplate extends Compbaser {

    constructor() {
        super();
    }

    @Input()
    set setTemplate(i_screenTemplateData:any) {
        // this.m_selfDestruct = i_selfDestruct;
        this.m_myElementID = 'svgScreenLayout' + '_' + _.uniqueId();
        this.m_screenTemplateData = i_screenTemplateData;
        this.m_orientation = i_screenTemplateData['orientation'];
        this.m_resolution = i_screenTemplateData['resolution'];
        this.m_screenProps = i_screenTemplateData['screenProps'];
        this.m_scale = i_screenTemplateData['scale'];
        this.m_svgWidth = (this.m_resolution.split('x')[0]) / this.m_scale;
        this.m_svgHeight = (this.m_resolution.split('x')[1]) / this.m_scale;
        this.m_useLabels = false;
    }

    m_screenTemplateData;
    m_myElementID;
    m_orientation;
    m_resolution;
    m_screenProps;
    m_scale;
    m_svgWidth;
    m_svgHeight;
    m_useLabels;

    
    ngOnInit() {
    }

    destroy() {
    }
}