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
import {BlockPropContainer} from "../app/blocks/block-prop-container";
import {FormatSecondsPipe} from "../pipes/format-seconds-pipe";
import {DraggableList} from "../comps/draggable-list";
import {ColorPickerModule} from "ngx-color-picker";
import {Tabs} from "../comps/tabs/tabs";
import {Tab} from "../comps/tabs/tab";
import {BlockPropImage} from "../app/blocks/block-prop-image";
import {BlockPropCommon} from "../app/blocks/block-prop-common";
import {BlockPropHtml} from "../app/blocks/block-prop-html";
import {BlockPropClock} from "../app/blocks/block-prop-clock";
import {FontSelector} from "../comps/font-selector/font-selector";
import {BlockPropWeather} from "../app/blocks/block-prop-weather";
import {BlockPropJsonPlayer} from "../app/blocks/block-prop-json-player";
import {SimpleGridModule} from "../comps/simple-grid-module/SimpleGridModule";

var sharedComponents = [Tabs, Tab, Infobox, Sliderpanel, Slideritem, PanelSplitMain, PanelSplitSide, PanelSplitContainer, ListToArrayPipe, FormatSecondsPipe, MatchBodyHeight, ScreenTemplate, BlurForwarder, DraggableList,
    FontSelector, BlockPropContainer, BlockPropImage, BlockPropCommon, BlockPropHtml, BlockPropClock, BlockPropWeather, BlockPropJsonPlayer];

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ChartModule, ReactiveFormsModule, ColorPickerModule, SimpleGridModule],
    exports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ContextMenuModule, ChartModule, ColorPickerModule, SimpleGridModule, ...sharedComponents],
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