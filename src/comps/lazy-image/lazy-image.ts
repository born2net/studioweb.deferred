import {Directive, ElementRef, EventEmitter, Input, NgZone, Output} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Directive({
    selector: '[lazyImage]'
})
export class LazyImage {

    private m_url;

    constructor(private el: ElementRef, private ngZone: NgZone) {
    }

    @Input()
    set url(i_url: string) {
        this.m_url = i_url;
        this.loadImage(i_url);
    }

    @Output() loaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() completed: EventEmitter<any> = new EventEmitter<any>();

    set setUrl(i_url) {
        this.m_url = i_url;
        this.loadImage(i_url);
    }

    ngAfterViewInit() {
        this.setImage(this.el.nativeElement, 'https://secure.digitalsignage.com/studioweb/assets/screen.png');
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
                img.src = 'http://example.com/aaa';
                img.src = i_url;
                img.onload = () => {
                    resolve(i_url);
                };
                img.onerror = err => {
                    this.setImage(this.el.nativeElement, 'https://secure.digitalsignage.com/studioweb/assets/screen_loading.png');
                    reject(err)
                };
            })

        }).retryWhen(err => {

            return err.scan(function(errorCount, err) {
                if(errorCount >= 3) {
                    throw err;
                }
                return errorCount + 1;
            }, 0).delay(2000);
        })

        pollAPI$.subscribe((v) => {
            this.setImage(this.el.nativeElement, this.m_url)
            this.loaded.emit();
        }, (e) => {
            this.setImage(this.el.nativeElement, 'https://secure.digitalsignage.com/studioweb/assets/screen_error.png');
            console.error(e)
        }, () => {
            this.completed.emit();
        })

    }

    destroy() {
    }
}
