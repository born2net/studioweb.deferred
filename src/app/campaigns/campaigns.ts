import {Component, ChangeDetectionStrategy} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'campaigns',
    template: `
        <Sliderpanel>
            <Slideritem class="page center order1 selected" [toDirection]="'left'" [to]="'order2'">
                <campaign-list></campaign-list>
            </Slideritem>
            <Slideritem class="page right order2" class="page right order2" [toDirection]="'left'" [fromDirection]="'right'" [from]="'order1'" [to]="'order3'">
                <h1>Order 2</h1>
            </Slideritem>
            <Slideritem class="page right order3" [fromDirection]="'right'" [from]="'order2'">
                <h1>Order 3</h1>
            </Slideritem>
        </Sliderpanel>
    `
})
export class Campaigns {

}

