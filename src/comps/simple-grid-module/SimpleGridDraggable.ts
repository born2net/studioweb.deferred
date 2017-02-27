import {ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Output, QueryList} from "@angular/core";
import {SimpleGridTable} from "./SimpleGridTable";
import {timeout} from "../../decorators/timeout-decorator";
import {SimpleGridRecord} from "./SimpleGridRecord";
import {Subscription} from "rxjs";

@Directive({
    selector: 'tbody[simpleGridDraggable]'
})
export class SimpleGridDraggable {

    // we have to Inject -> forwardRef as SimpleGridTable is not yet due to load order of files
    constructor(@Inject(forwardRef(() => SimpleGridTable)) i_table: SimpleGridTable, private el: ElementRef) {
        this.m_table = i_table;
    }

    private m_table: SimpleGridTable
    private m_draggables;
    private target;
    private y;

    m_items;
    m_selectedIdx = -1;
    m_sub: Subscription;

    @ContentChildren(SimpleGridRecord) simpleGridRecords: QueryList<SimpleGridRecord>;

    @Output()
    dragCompleted: EventEmitter<any> = new EventEmitter<any>();

    ngAfterViewInit() {
        this.createSortable();
        this.m_sub = this.simpleGridRecords
            .changes.subscribe(v => {
                this.createSortable();
            });
    }

    _cleanSortables() {
        if (this.m_draggables)
            this.m_draggables.forEach((drag) => drag.kill());
    }

    /**
     Create a draggable sortable list
     **/
    @timeout(500)
    public createSortable() {
        var self = this;
        jQuery(self.el.nativeElement).children().each((i, child) => {
            jQuery.data(child, "idx", i);

        });
        this.simpleGridRecords.forEach((rec: SimpleGridRecord, i) => {
            // rec['child'] = children[i]
            rec.index = i;
        })

        if (jQuery(self.el.nativeElement).children().length == 0) return;
        this._cleanSortables();
        self.m_draggables = Draggable.create(jQuery(self.el.nativeElement).children(), {
            type: "y",
            bounds: self.el.nativeElement,
            dragClickables: false,
            edgeResistance: 1,
            onPress: self._sortablePress,
            onDragStart: self._sortableDragStart,
            onDrag: self._sortableDrag,
            liveSnap: self._sortableSnap,
            onDragEnd: function () {
                self.m_selectedIdx = -1;
                var t = this.target,
                    max = t.kids.length - 1,
                    newIndex = Math.round(this.y / t.currentHeight);
                newIndex += (newIndex < 0 ? -1 : 0) + t.currentIndex;
                if (newIndex === max) {
                    t.parentNode.appendChild(t);
                } else {
                    t.parentNode.insertBefore(t, t.kids[newIndex + 1]);
                }
                TweenLite.set(t.kids, {yPercent: 0, overwrite: "all"});
                TweenLite.set(t, {y: 0, color: ""});
                // self.simpleGridRecords.forEach((v:SimpleGridRecord)=>{
                //     console.log(v.item.getKey('id'));
                // })
                // var items = jQuery(self.el.nativeElement).children();

                // var first = jQuery(self.el.nativeElement).children().first();
                // console.log('position ' + jQuery.data(first[0], "idx"));
                //
                // self.simpleGridRecords.forEach((rec:SimpleGridRecord,i)=>{
                //     console.log('position ' + i + ' ' + rec.item.getKey('event'));
                // })

                jQuery(self.el.nativeElement).children().each((i, child) => {

                    var oldIndex = jQuery.data(child, "idx");

                    var found:SimpleGridRecord = self.simpleGridRecords.find((rec:SimpleGridRecord)=>{
                        return rec.index == oldIndex;
                    })
                    console.log(i + ' ' + found.item.getKey('event'));
                })

                // var items = jQuery().children().each((child,ela)=>{
                //     var a = jQuery(self.el.nativeElement).outterHTML;
                //     var b = jQuery(self.el.nativeElement).find('[data-block_id]');
                //     var c = jQuery(self.el.nativeElement).find('data-block_id');
                //     var d = jQuery(self.el.nativeElement).find('block_id');
                //     var e = jQuery(ela).find('td');
                // });
                // self.dragCompleted.emit(items)

                //_.each(self.m_draggables, function(i){
                //    this.enabled(false);
                //});
            }
        });
    }

    /**
     Sortable list on press
     @method _sortablePress
     **/
    _sortablePress() {
        var t = this.target,
            i = 0,
            child = t;
        while (child = child.previousSibling)
            if (child.nodeType === 1) i++;
        t.currentIndex = i;
        t.currentHeight = t.offsetHeight;
        t.kids = [].slice.call(t.parentNode.children); // convert to array
    }

    /**
     Sortable drag list on press
     @method _sortableDragStart
     **/
    _sortableDragStart() {
        TweenLite.set(this.target, {color: "#88CE02"});
    }

    /**
     Sortable drag list
     @method _sortableDrag
     **/
    _sortableDrag() {
        var t = this.target,
            elements = t.kids.slice(), // clone
            indexChange = Math.round(this.y / t.currentHeight),
            bound1 = t.currentIndex,
            bound2 = bound1 + indexChange;
        if (bound1 < bound2) { // moved down
            TweenLite.to(elements.splice(bound1 + 1, bound2 - bound1), 0.15, {yPercent: -100});
            TweenLite.to(elements, 0.15, {yPercent: 0});
        } else if (bound1 === bound2) {
            elements.splice(bound1, 1);
            TweenLite.to(elements, 0.15, {yPercent: 0});
        } else { // moved up
            TweenLite.to(elements.splice(bound2, bound1 - bound2), 0.15, {yPercent: 100});
            TweenLite.to(elements, 0.15, {yPercent: 0});
        }
    }

    /**
     snap to set rounder values
     @method _sortableSnap
     **/
    _sortableSnap(y) {
        return y;
        // enable code below to enable snapinnes on dragging
        // var h = this.target.currentHeight;
        // return Math.round(y / h) * h;
    }

    ngOnDestroy() {
        this._cleanSortables();
        this.m_sub.unsubscribe();
        this.m_draggables = null;
    }
}