import {Component, ChangeDetectionStrategy, ElementRef, Output, EventEmitter, ChangeDetectorRef, HostListener, HostBinding} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'panel-split-side',
    styles: [`
        .propPanelWrap {
            position: fixed;
            min-height: 100%;
            max-height: 100%;
            right: 0;
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
    `],
    template: `
            <div class="hidden-xs hidden-sm col-md-3 col-lg-3 propPanelWrap">
                <button class="btn fa fa-plus" (click)="_toggle()">x</button>
                <ng-content></ng-content>
            </div>
    `
})
export class PanelSplitSide {

    constructor(private el: ElementRef, private cd:ChangeDetectorRef) {
    }

    // ngAfterViewInit(){
    //     // var h = jQuery('#appNavigatorWasp').innerHeight();
    //     // jQuery(this.el.nativeElement).find('.propPanelWrap').height(h-100);
    // }
    //
    // @HostBinding('style.height.px')
    // boxHeight: number = 5000;
    //
    // @HostListener('window:resize')
    // onResize() {
    // }

    @Output()
    onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    private showSidePanel: boolean = true;

    _toggle() {
        setTimeout(() => {
            this._toggle();
        }, 2000)
        this.showSidePanel = !this.showSidePanel;
        this.onToggle.emit(this.showSidePanel);
        if (this.showSidePanel) {
            jQuery(this.el.nativeElement).find('.propPanelWrap').addClass('col-md-3 col-lg-3')
            jQuery(this.el.nativeElement).find('.propPanelWrap').fadeIn('50')
        } else {
            jQuery(this.el.nativeElement).find('.propPanelWrap').fadeOut(0)
            jQuery(this.el.nativeElement).find('.propPanelWrap').removeClass('col-md-3 col-lg-3')

        }


    }
}

