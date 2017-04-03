import {Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, ChangeDetectorRef} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Observable} from "rxjs/Observable";
import {FasterqQueueModel} from "../../models/fasterq-queue-model";
import {Map, List} from 'immutable';

@Component({
    selector: 'fasterq-editor',
    styles: [`
        .personInLine {
            margin: 10px;
            padding: 0;
            float: left;
            width: 40px;
            height: 100px;
            cursor: pointer;
            color: #D0D0D0;
        }

        .called {
            color: #BE6734;
        }

        .serviced {
            color: #ACFD89;
        }
    `],
    templateUrl: './fasterq-editor.html'
})
export class FasterqEditor extends Compbaser implements AfterViewInit {

    m_stopWatchHandle = new Stopwatch();
    m_stopTimer = '00:00:00';
    m_selectedServiceID: any = -1;
    m_queues: List<FasterqQueueModel> = List([]);

    constructor(private yp: YellowPepperService, private el: ElementRef, private cd:ChangeDetectorRef) {
        super();
        this.cancelOnDestroy(
            this.yp.listenFasterqQueues()
                .subscribe((i_queues:List<FasterqQueueModel>) => {
                    this.m_queues = List([]);
                    for (var i = -8; i < 0; i++) {
                        i_queues = i_queues.unshift(new FasterqQueueModel({line_id: -1}))
                    }
                    this.m_queues = i_queues;
                    this.cd.markForCheck();
                }, (e) => console.error(e))
        )
    }

    /**
     Scroll to position of selected queue / UI person
     @method _scrollTo
     @param {Element} i_element
     **/
    _scrollTo(i_element) {
        this._watchStop();
        if (i_element.length == 0)
            return;
        this.m_selectedServiceID = $(i_element, this.el.nativeElement).data('service_id');
        // var model = self.m_queuesCollection.where({'service_id': self.m_selectedServiceID})[0];
        // self._populatePropsQueue(model);
        //
        // var scrollXPos = $(i_element).position().left;
        // // console.log('current offset ' + scrollXPos + ' ' + 'going to index ' + $(i_element).index() + ' service_id ' + $(i_element).data('service_id'));
        // self.m_offsetPosition = $(Elements.FQ_LINE_QUEUE_COMPONENT_CONTAINER).scrollLeft();
        // scrollXPos += self.m_offsetPosition;
        // var final = scrollXPos - 480;
        // TweenLite.to(Elements.FQ_LINE_QUEUE_COMPONENT_CONTAINER, 2, {
        //     scrollTo: {x: final, y: 0},
        //     ease: Power4.easeOut
        // });
    }

    /**
     Stop the stop watch UI
     @method _watchStop
     **/
    _watchStop() {
        this.m_stopWatchHandle.stop();
        this.m_stopWatchHandle.reset();
        this.m_stopTimer = '00:00:00';
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}
