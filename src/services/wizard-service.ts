import {Injectable} from "@angular/core";


@Injectable()
export class WizardService {

    constructor() {
        var enjoyhint_instance = new EnjoyHint({});

    }

    public inModule(i_name: string) {
        var enjoyhint_instance = new EnjoyHint({});
        var enjoyhint_script_steps;
        switch (i_name) {
            case 'campaigns': {
                enjoyhint_script_steps = [
                    {
                        'click #newCampaign': 'Click the "New" button to start creating your project'
                    }
                ];
                break;
            }

            case 'scenes': {
                enjoyhint_script_steps = [
                    {
                        'click #newScene': 'Click the "New" button to start creating your project'
                    }
                ];
                break;
            }
        }
        enjoyhint_instance.set(enjoyhint_script_steps);
        enjoyhint_instance.run();

    }
}