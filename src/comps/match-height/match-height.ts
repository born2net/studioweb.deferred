import {Directive, ElementRef, HostListener, Input} from "@angular/core";
import {timeout} from "../../decorators/timeout-decorator";

@Directive({
    selector: '[matchheight]'
})
export class MatchHeight {

    constructor(private el: ElementRef) {
        console.log(this.el);
    }

    @Input() matchheight:number = 50;

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
        var bodyHeight = jQuery('body').height() - this.matchheight;
        jQuery(this.el.nativeElement).height(bodyHeight);
    }


}


//     jQuery('.ng-content-wrapper', this.el.nativeElement)
//         .delay(500)
//         .queue(function (next) {
//             $(this).css('overflow-y', 'scroll');
//             next();
//         });