import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ScenesNavigation} from "./scenes-navigation";
import {DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {SharedModule} from "../../modules/shared.module";
import {SceneManager} from "./scene-manager";
import {ScenePropsManager} from "./scene-props-manager";

export const LAZY_ROUTES = [
    {path: ':folder', component: ScenesNavigation},
    {path: ':folder/:id', component: ScenesNavigation},
    {path: '**', component: ScenesNavigation}
];

@NgModule({
    imports: [DropdownModulePrime, SharedModule, CommonModule, RouterModule.forChild(LAZY_ROUTES)],
    declarations: [ScenesNavigation, ScenePropsManager, SceneManager ]
})
export class ScenesLazyModule {
}