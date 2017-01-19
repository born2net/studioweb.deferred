import {Routes, RouterModule} from "@angular/router";
import {App1} from "./comps/app1/App1";
import {LoginPanel} from "./comps/entry/LoginPanel";
import {Logout} from "./comps/logout/Logout";
import {Privileges} from "./comps/app1/privileges/Privileges";
import {AuthService} from "./services/AuthService";
import {AutoLogin} from "./comps/entry/AutoLogin";
import {Dashboard} from "./comps/app1/dashboard/dashboard";


const routes: Routes = [
    {path: 'index.html', data: {title: 'Login'}, component: AutoLogin},
    {path: 'AutoLogin', data: {title: 'Login'}, component: AutoLogin},
    {path: 'UserLogin', data: {title: 'Login'}, component: LoginPanel},
    {path: 'UserLogin/:twoFactor', data: {title: 'Login'}, component: LoginPanel},
    {path: 'UserLogin/:twoFactor/:user/:pass', data: {title: 'Login'}, component: LoginPanel},
    {path: 'Logout', component: Logout},
    {path: '', pathMatch: 'full', redirectTo: '/App1/Campaigns'},
    {path: 'studioweb', pathMatch: 'full', redirectTo: '/App1/Campaigns'},  // IE/FF compatibility
    {
        path: 'App1', component: App1,
        children: [
            {path: '', component: App1, canActivate: [AuthService]},
            {path: 'Campaigns', loadChildren: '../app/campaigns/index#CampaignsLazyModule', canActivate: [AuthService]},
            {path: 'Fasterq', loadChildren: '../app/fasterq/index#FasterqLazyModule', canActivate: [AuthService]},
            {path: 'Resources', loadChildren: '../app/resources/index#ResourcesLazyModule', canActivate: [AuthService]},
            {path: 'Settings', loadChildren: '../app/settings/index#SettingsLazyModule', canActivate: [AuthService]},
            {path: 'Stations', loadChildren: '../app/stations/index#StationsLazyModule', canActivate: [AuthService]},
            {path: 'StudioPro', loadChildren: '../app/studiopro/index#StudioProLazyModule', canActivate: [AuthService]},
            {path: 'Dashboard', component: Dashboard, data: {title: 'Dashboard'}, canActivate: [AuthService]},
            {path: 'Privileges', component: Privileges, data: {title: 'Privileges'}, canActivate: [AuthService]},
            {path: 'Logout', component: Logout, data: {title: 'Logout'}, canActivate: [AuthService]},
            {path: '**', redirectTo: 'Dashboard'}
        ]
    }
];

export const routing = RouterModule.forRoot(routes, {enableTracing: false});


