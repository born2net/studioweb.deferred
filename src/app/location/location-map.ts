import {Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ChangeDetectorRef} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import {SebmGoogleMap} from "angular2-google-maps/esm/core";

@Component({
    selector: 'location-map',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .sebm-google-map-container {
            height: 760px;
            width: 700px;
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <h1>aa</h1>
        <sebm-google-map #googleMaps [disableDefaultUI]="false" style="width: 700px ; height: 700px" [latitude]="38.2500" [longitude]="-96.7500"></sebm-google-map>
        <br/>
        <br/>
        <br/>
        <h1>ab</h1>
        <!--<sebm-google-map #googleMaps style="width: 100% ; height: 100%"-->
        <!--(mapClick)="mapClicked($event)"-->
        <!--[latitude]="38.2500"-->
        <!--[longitude]="-96.7500"-->
        <!--[zoom]="zoom"-->
        <!--[disableDefaultUI]="false"-->
        <!--[zoomControl]="false">-->

        <!--<sebm-google-map-marker style="width: 300px ; height: 400px"-->
        <!--*ngFor="let m of markers; let i = index"-->
        <!--(markerClick)="clickedMarker(m, i)"-->
        <!--[latitude]="m.lat"-->
        <!--[longitude]="m.lng"-->
        <!--[iconUrl]="getMarkerIcon(m)"-->
        <!--[label]="m.label">-->
        <!--&lt;!&ndash;<sebm-google-map-info-window>&ndash;&gt;-->
        <!--&lt;!&ndash;<strong>InfoWindow content</strong>&ndash;&gt;-->
        <!--&lt;!&ndash;</sebm-google-map-info-window>&ndash;&gt;-->

        <!--</sebm-google-map-marker>-->
        <!--</sebm-google-map>-->
    `,
})
export class LocationMap extends Compbaser implements AfterViewInit {

    lat: number = 51.678418;
    lng: number = 7.809007;

    constructor(private yp: YellowPepperService, private cd:ChangeDetectorRef) {
        super();
    }

    @ViewChild('googleMaps')
    googleMaps: SebmGoogleMap;

    ngAfterViewInit() {
        this.setCenter(38.2500, -96.7500);
    }

    public forceUpdateUi() {
        this.cd.reattach();
        setTimeout(()=> {
            this.cd.detach();
            this.googleMaps.triggerResize();
        }, 1000)
    }

    public setCenter(lat, lng) {
        // this.googleMaps.latitude = lat;
        // this.googleMaps.longitude = lng;
        // for private access to all APIs do:
        this.googleMaps['_mapsWrapper'].setCenter({
            lat: lat,
            lng: lng,
        });
        this.forceUpdateUi();
    }

    ngOnInit() {
    }

    destroy() {
    }
}
