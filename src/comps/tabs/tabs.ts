import {Component} from '@angular/core';
//import {Tab} from 'tab';

@Component({
    selector: 'tabs',
    template: `
    <ul class="nav nav-tabs">
      <ng-container *ngFor="let tab of tabs">
          <li (click)="selectTab(tab, $event)" [class.active]="tab.active">
              <a href="#">aaa {{tab.title}}</a>      
          </li>
      </ng-container>
    </ul>
    <ng-content></ng-content>
  `
})
export class Tabs {

    tabs:any[];
    removed;
    constructor() {
        this.tabs = [];
    }

    private selectTab(tab, event) {
        event.preventDefault;
        _deactivateAllTabs(this.tabs);
        tab.active = true;
        function _deactivateAllTabs(tabs:any[]) {
            tabs.forEach((tab)=>tab.active = false);
        }
        return false;
    }

    // _deactivateAllTabs(){
    //   this.tabs.forEach((tab)=>tab.active = false);
    // }

    addTab(tab:any) {
        if (this.tabs.length === 0) {
            tab.active = true;
        }
        this.tabs.push(tab);
    }

    show(){
        if(this.removed)
            this.tabs.push(this.removed[0])
        this.removed = null;
    }

    hide(tab) {
        var i = this.tabs.indexOf(tab)
        if (i!=-1) {
            this.tabs.forEach((tab)=>tab.active = false);
            this.removed = this.tabs.splice(i, 1);
            this.tabs[0].active = true;
        }

        // this.tabs = this.tabs.filter(i_tab => i_tab.title != i_title) as List<any>
    }
}