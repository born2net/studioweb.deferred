import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ScenesNavigation} from "./scenes-navigation";
import {DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {SharedModule} from "../../modules/shared.module";
import {ScenePropsManager} from "./scene-props-manager";
import {SceneList} from "./scene-list";
import {SceneManager} from "./scene-manager";
import {Scenes} from "./scenes";
import {SceneEditor} from "./scene-editor";

export const LAZY_ROUTES = [
    {path: ':folder', component: ScenesNavigation},
    {path: ':folder/:id', component: ScenesNavigation},
    {path: '**', component: ScenesNavigation}
];

@NgModule({
    imports: [DropdownModulePrime, SharedModule, CommonModule, RouterModule.forChild(LAZY_ROUTES)],
    declarations: [Scenes, SceneEditor, ScenesNavigation, ScenePropsManager, SceneManager, SceneList ]
})
export class ScenesLazyModule {
}