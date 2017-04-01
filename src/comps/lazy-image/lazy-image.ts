import {Directive, ElementRef, EventEmitter, Input, NgZone, Output} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

/**
 *  Usage
 *
 <img lazyImage class="center-block" style="width: 229px; height: 130px"
 [loadingImage]="'https://secure.digitalsignage.com/studioweb/assets/screen_loading.png'"
 [defaultImage]="'https://secure.digitalsignage.com/studioweb/assets/screen.png'"
 [errorImage]="'https://secure.digitalsignage.com/studioweb/assets/screen_error.png'"
 [retry]="5"
 [delay]="1500"
 (loaded)="_onLoaded()"
 (error)="_onError()"
 (completed)="_onCompleted()">

 or to use via API

 ...

 @ViewChild(LazyImage)
 lazyImage: LazyImage;
 ..

 _resetSnapshotSelection() {
    if (this.lazyImage)
         this.lazyImage.resetToDefault();
 }

 _takeSnapshot() {
     this.lazyImage.url = 'http://example.com/foo.png;
 }


 */

@Directive({
    selector: '[lazyImage]'
})
export class LazyImage {

    private m_url;
    private cancel$ = new Subject();

    constructor(private el: ElementRef, private ngZone: NgZone) {
    }

    @Input() defaultImage: string;
    @Input() loadingImage: string;
    @Input() errorImage: string;
    @Input() retry: number = 10;
    @Input() delay: number = 500;


    @Input()
    set url(i_url: string) {
        this.m_url = i_url;
        this.loadImage(i_url);
    }

    @Output() loaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() completed: EventEmitter<any> = new EventEmitter<any>();
    @Output() errored: EventEmitter<any> = new EventEmitter<any>();

    set setUrl(i_url) {
        this.m_url = i_url;
        this.loadImage(i_url);
    }

    public resetToDefault() {
        this.setImage(this.el.nativeElement, this.defaultImage);
        this.cancel$.next({})
    }

    ngAfterViewInit() {
        this.setImage(this.el.nativeElement, this.defaultImage);
    }

    ngOnInit() {
    }

    setImage(element: HTMLElement, i_url) {
        // const isImgNode = element.nodeName.toLowerCase() === 'img';
        // if (isImgNode) {
        // } else {
        //     element.style.backgroundImage = `url('${imagePath}')`;
        // }
        (<HTMLImageElement>element).src = i_url;
        return element;
    }

    loadImage(i_url) {
        const pollAPI$ = Observable.defer(() => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = i_url;
                img.onload = () => {
                    resolve(i_url);
                };
                img.onerror = err => {
                    this.setImage(this.el.nativeElement, this.loadingImage);
                    reject(err)
                };
            })


        }).retryWhen(err => {

            return err.scan((errorCount, err) => {
                if (errorCount >= this.retry) {
                    throw err;
                }
                return errorCount + 1;
            }, 0).delay(this.delay);
        }).takeUntil(this.cancel$)

        pollAPI$.subscribe((v) => {
            this.setImage(this.el.nativeElement, this.m_url)
            this.loaded.emit();
        }, (e) => {
            this.setImage(this.el.nativeElement, this.errorImage);
            this.errored.emit();
            // console.error(e)
        }, () => {
            this.completed.emit();
        })

    }

    destroy() {
    }
}
