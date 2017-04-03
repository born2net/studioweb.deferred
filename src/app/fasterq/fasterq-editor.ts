import {Component, ChangeDetectionStrategy, AfterViewInit, ElementRef} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {Observable} from "rxjs/Observable";
import {FasterqQueueModel} from "../../models/fasterq-queue-model";
import {Map, List} from 'immutable';

@Component({
    selector: 'fasterq-editor',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fasterq-editor.html'
})
export class FasterqEditor extends Compbaser implements AfterViewInit {

    m_stopWatchHandle = new Stopwatch();
    m_stopTimer = '00:00:00';
    m_selectedServiceID: any = -1;
    queues$: Observable<List<FasterqQueueModel>>

    constructor(private yp: YellowPepperService, private el: ElementRef) {
        super();
        this.queues$ = this.yp.listenFasterqQueues();
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
