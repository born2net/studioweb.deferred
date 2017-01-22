import {Component, ChangeDetectionStrategy, ElementRef, Output, EventEmitter} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'panel-split-side',
    styles: [`
        .propPanelWrap {
            position: fixed;
            min-height: 100%;
            max-height: 100%;
            right: 0;
            top: 0;
            height: 100%;
            overflow: hidden;
            -webkit-transition: width 0.1s ease, margin 0.1s ease;
            -moz-transition: width 0.1s ease, margin 0.1s ease;
            -o-transition: width 0.1s ease, margin 0.1s ease;
            transition: width 0.1s ease, margin 0.1s ease;
            background-color: #4c4c4c;
            padding: 0;
            margin: 0;
            z-index: 200;
            border-left: 2px #bdbdbd solid;
        }
        
        .restorePanel {
            position: absolute;
            right: 0;
            top: 3px;
        }
        
        .fa-arrow-circle-right {
            padding-top: 60px;
        }
    `],
    template: `
            <!--<div class="hidden-xs hidden-sm restorePanel" *ngIf="!showSidePanel">-->
            <div class="restorePanel" *ngIf="!showSidePanel">
                <a style="font-size: 1.5em ; color: #313335" href="#" class="btn fa fa-arrow-circle-left" (click)="_toggle($event)"></a>
            </div>
            
            <!--<div class="hidden-xs hidden-sm col-md-2 col-lg-2 propPanelWrap">-->
            <div class="col-xs-5 col-sm-4 col-md-3 col-lg-2 propPanelWrap">
                <a style="font-size: 1.5em ; color: white" href="#" class="btn fa fa-arrow-circle-right" (click)="_toggle($event)"></a>
                <ng-content></ng-content>
            </div>
    `
})
export class PanelSplitSide {

    constructor(private el: ElementRef) {
    }

    @Output()
    onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    private showSidePanel: boolean = true;

    _toggle(event: MouseEvent) {
        event.preventDefault();
        this.showSidePanel = !this.showSidePanel;
        this.onToggle.emit(this.showSidePanel);
        if (this.showSidePanel) {
            jQuery(this.el.nativeElement).find('.propPanelWrap').addClass('col-xs-7 col-sm-8 col-md-9 col-lg-10')
            jQuery(this.el.nativeElement).find('.propPanelWrap').fadeIn('50')
        } else {
            jQuery(this.el.nativeElement).find('.propPanelWrap').fadeOut(0)
            jQuery(this.el.nativeElement).find('.propPanelWrap').removeClass('col-xs-7 col-sm-8 col-md-9 col-lg-10')
        }
    }
}

