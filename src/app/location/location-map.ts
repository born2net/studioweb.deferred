import {Component, ChangeDetectionStrategy, AfterViewInit} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";

@Component({
    selector: 'location-map',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <sebm-google-map #googleMaps style="width: 100% ; height: 100%"
                         (mapClick)="mapClicked($event)"
                         [latitude]="38.2500"
                         [longitude]="-96.7500"
                         [zoom]="zoom"
                         [disableDefaultUI]="false"
                         [zoomControl]="false">

            <sebm-google-map-marker style="width: 300px ; height: 400px"
                                    *ngFor="let m of markers; let i = index"
                                    (markerClick)="clickedMarker(m, i)"
                                    [latitude]="m.lat"
                                    [longitude]="m.lng"
                                    [iconUrl]="getMarkerIcon(m)"
                                    [label]="m.label">
                <!--<sebm-google-map-info-window>-->
                <!--<strong>InfoWindow content</strong>-->
                <!--</sebm-google-map-info-window>-->

            </sebm-google-map-marker>
        </sebm-google-map>
    `,
})
export class LocationMap extends Compbaser implements AfterViewInit {

    constructor(private yp: YellowPepperService) {
        super();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
    }

    destroy() {
    }
}
