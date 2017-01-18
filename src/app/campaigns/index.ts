import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CampaignsView} from "./campaigns.view";
import {DropdownModule as DropdownModulePrime} from "primeng/primeng";
import {SharedModule} from "../../modules/shared.module";

export const LAZY_ROUTES = [
    {path: ':folder', component: CampaignsView},
    {path: ':folder/:id', component: CampaignsView},
    {path: '**', component: CampaignsView}
];

@NgModule({
    imports: [DropdownModulePrime, SharedModule, CommonModule, RouterModule.forChild(LAZY_ROUTES)],
    declarations: [CampaignsView]
})
export class CampaignsModule {
}