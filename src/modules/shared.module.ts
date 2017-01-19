import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {Infobox} from "../comps/infobox/Infobox";
import {Sliderpanel} from "../comps/sliderpanel/Sliderpanel";
import {Slideritem} from "../comps/sliderpanel/Slideritem";

var sharedComponents = [Infobox, Sliderpanel, Slideritem];

@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule],
    exports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule, ...sharedComponents],
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