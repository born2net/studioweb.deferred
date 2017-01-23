import {Component, ChangeDetectionStrategy, ViewContainerRef, ChangeDetectorRef, Input, EventEmitter, Output} from "@angular/core";
import {Sliderpanel} from "./Sliderpanel";

export interface ISliderItemData {
    to: string;
    direction: string;
}

@Component({
    selector: 'Slideritem',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
                    <button *ngIf="fromDirection && showFromButton" type="button" (click)="onPrev()" class="btn btn-default btn-sm">
                        <span class="fa fa-arrow-left "></span>
                    </button>
                    
                    <button *ngIf="toDirection && showToButton" type="button" (click)="onNext()" class="btn btn-default btn-sm">
                        <span class="fa fa-arrow-right"></span>
                    </button>                
                        
                <ng-content></ng-content>
    `,
})
export class Slideritem {

    constructor(private viewContainer: ViewContainerRef, protected sliderPanel: Sliderpanel) {
        this.viewContainer.element.nativeElement.classList.add('page');
        this.sliderPanel.addSlider(this);
    }

    @Input() toDirection: 'left' | 'right';
    @Input() fromDirection: 'left' | 'right';
    @Input() to: string;
    @Input() from: string;
    @Input() showToButton: boolean = true;
    @Input() showFromButton: boolean = true;
    @Output()
    onChange: EventEmitter<ISliderItemData> = new EventEmitter<ISliderItemData>();

    public addClass(i_className) {
        this.viewContainer.element.nativeElement.classList.add(i_className);
    }

    public hasClass(i_className) {
        this.viewContainer.element.nativeElement.classList.contains(i_className);
    }

    public getNative() {
        return this.viewContainer.element.nativeElement;
    }

    public removeClass(i_className) {
        this.viewContainer.element.nativeElement.classList.remove(i_className);
    }

    public slideTo(to: string, direction: string) {
        this.onChange.emit({
            to: to,
            direction: direction
        })
        this.sliderPanel.slideToPage(to, direction)
    }

    public onNext() {
        this.slideTo(this.to, this.toDirection);
    }

    public onPrev() {
        this.slideTo(this.from, this.fromDirection);
    }
}

