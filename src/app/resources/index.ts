import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ResourcesNavigation} from "./resources.navigation";
import {DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {SharedModule} from "../../modules/shared.module";

export const LAZY_ROUTES = [
    {path: ':folder', component: ResourcesNavigation},
    {path: ':folder/:id', component: ResourcesNavigation},
    {path: '**', component: ResourcesNavigation}
];

@NgModule({
    imports: [DropdownModulePrime, SharedModule, CommonModule, RouterModule.forChild(LAZY_ROUTES)],
    declarations: [ResourcesNavigation]
})
export class ResourcesLazyModule {
}