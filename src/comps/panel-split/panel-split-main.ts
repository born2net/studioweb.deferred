import {Component, ChangeDetectionStrategy, ElementRef, Output, EventEmitter, HostListener} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'panel-split-main',

    styles: [`
        .mmm {
                overflow: auto;
                margin-left: 5px;
        }
        @media (min-width: 767px) {
             .mmm {
                margin-right: 60px;
            }
        }
        @media (min-width: 768px) {
             .mmm {
                margin-right: 10px;
            }
        }
        @media (min-width: 992px) {
             .mmm {
                margin-right: 30px;
            }
        }
        @media (min-width: 1900px) {
             .mmm {
                margin-right: 30px;
            }
        }

        .mainPanelWrap {
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
            <div #parentdiv class="col-xs-7 col-sm-8 col-md-9 col-lg-10 mainPanelWrap">
                <!--<div class="mmm" [style.height.px]="parentdiv.clientHeight">-->
                <div class="mmm" [style.height.px]="divHeight">
                    <ng-content></ng-content>
                </div>
            </div>
    `
})
export class PanelSplitMain {

    constructor(private el: ElementRef) {

    }

    divHeight;

    ngAfterViewInit(){
        // this.divHeight = jQuery('body').innerHeight();
        // jQuery(this.el.nativeElement).find('.propPanelWrap').height(h-100);
        // this.onResize();
    }

    ngAfterContentInit(){
        this.onResize();
    }

    //
    // @HostBinding('style.height.px')
    // boxHeight: number = 5000;
    //
    @HostListener('window:resize')
    onResize() {
        this.divHeight = jQuery('body').height() -  100;
        console.log(this.divHeight);
        // jQuery(this.el.nativeElement).find('.propPanelWrap').height(h-100);
    }


    setFullScreen(value) {
        if (!value) {
            // full screen
            jQuery(this.el.nativeElement).find('.mainPanelWrap').removeClass('col-xs-7 col-sm-8 col-md-9 col-lg-10')
            jQuery(this.el.nativeElement).find('.mainPanelWrap').addClass('col-xs-12')
        } else {
            jQuery(this.el.nativeElement).find('.mainPanelWrap').addClass('col-xs-7 col-sm-8 col-md-9 col-lg-10')
            jQuery(this.el.nativeElement).find('.mainPanelWrap').removeClass('col-xs-12')
        }

    }


}

