import {Directive, ElementRef, HostListener} from "@angular/core";
import {timeout} from "../../decorators/timeout-decorator";

@Directive({
    selector: '[match-height]'
})
export class MatchHeight {

    constructor(private el: ElementRef) {
        console.log(this.el);
    }

    ngAfterContentInit() {
        this.onResize();
    }

    // @timeout(500)
    // private enableScroller() {
    //     // jQuery('.ng-content-wrapper', this.el.nativeElement).css('overflow-y', 'scroll');
    // }

    // @HostBinding('style.overflow')
    // overFlow;

    @HostListener('window:resize')
    onResize() {
        var bodyHeight = jQuery('body').height() - 150;
        jQuery(this.el.nativeElement).height(bodyHeight);
    }


}


//     jQuery('.ng-content-wrapper', this.el.nativeElement)
//         .delay(500)
//         .queue(function (next) {
//             $(this).css('overflow-y', 'scroll');
//             next();
//         });