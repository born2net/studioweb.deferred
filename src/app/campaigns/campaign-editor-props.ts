import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";

@Component({
    selector: 'campaign-editor-props',
    host: {
        '(input-blur)': 'onFormChange($event)'
    },
    template: `
        <div>
            <h3>Campaigns</h3>  
        </div>
    `
})
export class CampaignEditorProps extends Compbaser {

    constructor(private yp: YellowPepperService) {
        super();

    }



    destroy() {
    }
}
