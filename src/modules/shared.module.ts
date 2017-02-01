import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {Infobox} from "../comps/infobox/Infobox";
import {Sliderpanel} from "../comps/sliderpanel/Sliderpanel";
import {Slideritem} from "../comps/sliderpanel/Slideritem";
import {PanelSplitMain} from "../comps/panel-split/panel-split-main";
import {PanelSplitSide} from "../comps/panel-split/panel-split-side";
import {PanelSplitContainer} from "../comps/panel-split/panel-split-container";
import {ListToArrayPipe} from "../pipes/list-to-array-pipe";
import {MatchBodyHeight} from "../comps/match-body-height/match-body-height";
import {Props} from "../comps/props/props";
import {ScreenTemplate} from "../comps/screen-template/screen-template";
import {CampaignProps} from "../app/campaigns/campaign-props";
import {BlurForwarder} from "../comps/blurforwarder/BlurForwarder";
import {ContextMenuModule} from "angular2-contextmenu";

var sharedComponents = [Infobox, Sliderpanel, Slideritem, PanelSplitMain,
    PanelSplitSide, PanelSplitContainer, ListToArrayPipe, MatchBodyHeight, Props, ScreenTemplate, CampaignProps, BlurForwarder];

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule,  ContextMenuModule],
    exports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ...sharedComponents],
    declarations: [...sharedComponents]
})

export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}