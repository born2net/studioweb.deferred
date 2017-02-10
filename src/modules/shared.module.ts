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
import {ScreenTemplate} from "../comps/screen-template/screen-template";
import {BlurForwarder} from "../comps/blurforwarder/BlurForwarder";
import {ContextMenuModule} from "angular2-contextmenu";
import {ChartModule} from "angular2-highcharts";
import {BlockProp} from "../app/blocks/BlockProp";
import {SpinnerModule} from "primeng/primeng";

var sharedComponents = [Infobox, Sliderpanel, Slideritem, PanelSplitMain, PanelSplitSide, PanelSplitContainer, ListToArrayPipe, MatchBodyHeight, ScreenTemplate, BlurForwarder, BlockProp];

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ChartModule, ReactiveFormsModule, SpinnerModule],
    exports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ChartModule, SpinnerModule, ...sharedComponents],
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