import {Component, ChangeDetectionStrategy, ElementRef, HostListener} from "@angular/core";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'panel-split-main',

    styles: [`
        .ng-content-wrapper {
                overflow-y: hidden;
                margin-left: 5px;
        }
        @media (min-width: 767px) {
             .ng-content-wrapper {
                margin-right: 60px;
            }
        }
        @media (min-width: 768px) {
             .ng-content-wrapper {
                margin-right: 10px;
            }
        }
        @media (min-width: 992px) {
             .ng-content-wrapper {
                margin-right: 30px;
            }
        }
        @media (min-width: 1900px) {
             .ng-content-wrapper {
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
                <!--<div class="ng-content-wrapper" [style.height.px]="parentdiv.clientHeight">-->
                <div class="ng-content-wrapper" [style.height.px]="m_divHeight">
                    <ng-content></ng-content>
                </div>
            </div>
    `
})
export class PanelSplitMain {

    constructor(private el: ElementRef) {
    }

    m_divHeight;


    ngAfterContentInit() {
        jQuery('.ng-content-wrapper', this.el.nativeElement)
            .delay(500)
            .queue(function (next) {
                $(this).css('overflow-y', 'scroll');
                next();
            });
        this.onResize();
    }

    // @HostBinding('style.overflow')
    // overFlow;

    @HostListener('window:resize')
    onResize() {
        this.m_divHeight = jQuery('body').height() - 10;
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

