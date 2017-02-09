import {ModuleWithProviders, NgModule} from "@angular/core";
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
import {TimelineProps} from "../app/campaigns/timeline-props";
import {ChannelProps} from "../app/campaigns/channel-props";
import {DashboardProps} from "../app/campaigns/dashboard-props";
import {CampaignEditorProps} from "../app/campaigns/campaign-editor-props";
import {ChartModule} from "angular2-highcharts";
import {CampaignSchedProps} from "../app/campaigns/campaign-sched-props";

var sharedComponents = [Infobox, Sliderpanel, Slideritem, PanelSplitMain, PanelSplitSide, PanelSplitContainer, ListToArrayPipe,
    MatchBodyHeight, ScreenTemplate, CampaignProps, BlurForwarder, Props, TimelineProps, ChannelProps, DashboardProps, CampaignEditorProps, CampaignSchedProps];

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ChartModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ChartModule, ...sharedComponents],
    entryComponents: [ScreenTemplate],
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