import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {StationsNavigation} from "./stations.navigation";
import {DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {SharedModule} from "../../modules/shared.module";

export const LAZY_ROUTES = [
    {path: ':folder', component: StationsNavigation},
    {path: ':folder/:id', component: StationsNavigation},
    {path: '**', component: StationsNavigation}
];

@NgModule({
    imports: [DropdownModulePrime, SharedModule, CommonModule, RouterModule.forChild(LAZY_ROUTES)],
    declarations: [StationsNavigation]
})
export class StationsLazyModule {
}