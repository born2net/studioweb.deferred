import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'json-event-grid',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
               <small class="debug">{{me}}</small>
               <div style="overflow-x: scroll">
                   <div style="width: 600px">
                       <simpleGridTable #simpleGrid>
                           <thead>
                           <tr>
                               <th>event</th>
                               <th>action</th>
                               <th>url</th>
                           </tr>
                           </thead>
                           <tbody>
                           <tr class="simpleGridRecord" simpleGridRecord *ngFor="let item of m_events; let index=index" [item]="item" [index]="index">
                               <td style="width: 30%" [editable]="true" (labelEdited)="_onLabelEdited($event,index)" field="event" simpleGridData [item]="item"></td>
                               <td style="width: 35%" simpleGridDataDropdown [testSelection]="_selectedAction()" (changed)="_setAction($event,index)" field="name" [item]="item" [dropdown]="m_actions"></td>
                               <td style="width: 35%" [editable]="true" (labelEdited)="_onUrlEdited($event,index)" field="url" simpleGridData [item]="item"></td>
                           </tr>
                           </tbody>
                       </simpleGridTable>
                   </div>
               </div>
        
           `,
})
export class JsonEventGrid extends Compbaser implements AfterViewInit {

    m_duration = '00:00:00'
    constructor(private yp:YellowPepperService) {
        super();
    }

    ngAfterViewInit(){


    }

    ngOnInit() {
    }

    destroy() {
    }
}