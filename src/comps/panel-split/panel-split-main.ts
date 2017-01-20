import {Component, ChangeDetectionStrategy, ElementRef, Output, EventEmitter} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'panel-split-main',
    styles: [`
        .mainPanelWrap {
             border-left: 1px #808080 solid; 
            -webkit-transition: width 0.1s ease, margin 0.1s ease;
            -moz-transition: width 0.1s ease, margin 0.1s ease;
            -o-transition: width 0.1s ease, margin 0.1s ease;
            transition: width 0.1s ease, margin 0.1s ease;
        }
        button {
            width: 200px;
            margin: 5px;
        }
        .mainPanelWrap {
            padding: 0;
            margin: 0;
        }
    `],
    template: `
            <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 mainPanelWrap">            
                <ng-content></ng-content>
            </div>

    `
})
export class PanelSplitMain {

    constructor(private el: ElementRef) {

    }

    setFullScreen(value) {
        if (!value) {
            jQuery(this.el.nativeElement).find('.mainPanelWrap').removeClass('col-md-9 col-lg-9')
            jQuery(this.el.nativeElement).find('.mainPanelWrap').addClass('col-md-12 col-lg-12')
        } else {
            jQuery(this.el.nativeElement).find('.mainPanelWrap').addClass('col-md-9 col-lg-9')
            jQuery(this.el.nativeElement).find('.mainPanelWrap').removeClass('col-md-12 col-lg-12')
        }

    }


    ngAfterViewInit() {
    }
}

