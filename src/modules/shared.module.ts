import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {Infobox} from "../comps/infobox/Infobox";
@NgModule({
    imports: [CommonModule, FormsModule, HttpModule, JsonpModule, ReactiveFormsModule],
    declarations: [Infobox],
    exports: [CommonModule, FormsModule, Infobox, HttpModule, JsonpModule, ReactiveFormsModule]
})

// here we are loading the AuthService ONLY when this shared module is loaded by the app and not
// by a feature or lazy loaded module, this making sure we share a single instance of AuthService
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}