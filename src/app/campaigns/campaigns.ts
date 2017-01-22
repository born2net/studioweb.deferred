import {Component, ChangeDetectionStrategy} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaigns',
    template: `
        <Sliderpanel>
            <Slideritem class="page center screen1 selected" [toDirection]="'left'" [to]="'screen2'">
                <campaign-list></campaign-list>
            </Slideritem>
            <Slideritem class="page right screen2" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen1'" [to]="'screen3'">
                <h3>campaign name</h3>
            </Slideritem>
            <Slideritem class="page right screen3" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen2'" [to]="'screen4'">
                <h3>screen orientation</h3>
            </Slideritem>
            <Slideritem class="page right screen4" [toDirection]="'left'" [fromDirection]="'right'" [from]="'screen3'" [to]="'screen5'">
                <h3>screen layout</h3>
            </Slideritem>
            <Slideritem class="page right screen5" [fromDirection]="'right'" [from]="'screen4'">
                <h3>campaign editor</h3>
            </Slideritem>
        </Sliderpanel>
    `
})
export class Campaigns {

}

