import {Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, ElementRef, Inject} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {SebmGoogleMap} from "angular2-google-maps/esm/core";
import {IUiState} from "../../store/store.data";
import {ACTION_UISTATE_UPDATE} from "../../store/actions/appdb.actions";
import {MapsAPILoader} from "angular2-google-maps/core";
import {BlockService, IBlockData, ISceneData} from "../blocks/block-service";
import {RedPepperService} from "../../services/redpepper.service";
import {PLACEMENT_CHANNEL, PLACEMENT_SCENE} from "../../interfaces/Consts";
import {CampaignTimelineChanelPlayersModel} from "../../store/imsdb.interfaces_auto";
import {LocationMarkModel} from "../../models/LocationMarkModel";

export declare var google: any;

export interface IMarker {
    lat: number;
    lng: number;
    radius: number;
    draggable: boolean;
    new:boolean;
}


// example: http://embed.plnkr.co/YX7W20/

@Component({
    selector: 'location-map',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .sebm-google-map-container {
            height: 700px;
            width: 1700px;
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <button (click)="_close()" type="button" class="openPropsButton btn btn-default btn-sm">
            <span class="glyphicon glyphicon-chevron-left"></span>
        </button>
        <p class="inputPlacement"></p>
        <div class="row map">
            <!--<sebm-google-map class="center-block" #googleMaps [disableDefaultUI]="false" [latitude]="38.2500" [longitude]="-96.7500"></sebm-google-map>-->

            <sebm-google-map #googleMaps class="center-block"
                             [latitude]="lat"
                             [longitude]="lng"
                             [zoom]="zoom"
                             [disableDefaultUI]="false"
                             [zoomControl]="false"
                             (mapClick)="mapClicked($event)">

                <!--<sebm-google-map-marker-->
                <!--*ngFor="let m of markers; let i = index"-->
                <!--(markerClick)="clickedMarker(m, i)"-->
                <!--[latitude]="m.lat"-->
                <!--[longitude]="m.lng"                        -->
                <!--[label]="m.label"-->
                <!--[markerDraggable]="m.draggable"-->
                <!--(dragEnd)="markerDragEnd(m, $event)">-->

                <!--<sebm-google-map-info-window>-->
                <!--<strong>InfoWindow content</strong>-->
                <!--</sebm-google-map-info-window>-->

                <!--</sebm-google-map-marker>-->

                <sebm-google-map-circle *ngFor="let m of markers; let i = index"
                                        (circleClick)="clickedMarker(m, i)"
                                        [latitude]="m.lat"
                                        (dragEnd)="markerDragEnd(m, $event)"
                                        [longitude]="m.lng"
                                        [radius]="m.radius"
                                        [fillColor]="'red'"
                                        [circleDraggable]="true"
                                        [editable]="true">
                </sebm-google-map-circle>

            </sebm-google-map>

        </div>

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

    zoom: number = 8;
    lat: number = 51.673858;
    lng: number = 7.815982;
    markers: IMarker[] = [];
    private m_blockData: IBlockData;


    constructor(private yp: YellowPepperService, private cd: ChangeDetectorRef, private m_mapsAPILoader: MapsAPILoader,
                private bs: BlockService, @Inject('BLOCK_PLACEMENT') private blockPlacement: string, private rp: RedPepperService) {

        super();
        // this.m_mapsAPILoader.load().then(() => {
        //     console.log('google script loaded');
        //     var geocoder = new google.maps.Geocoder();
        //     // this._createMap();
        // });
    }

    @ViewChild('googleMaps')
    googleMaps: SebmGoogleMap;

    @Output()
    onClose: EventEmitter<any> = new EventEmitter<any>();

    ngAfterViewInit() {

        //
        this.yp.listenLocationMarkerSelected()
            .subscribe((i_marker: LocationMarkModel) => {
                this.setCenter(i_marker.getLat(), i_marker.getLng())
            }, (e) => console.error(e))

        if (this.blockPlacement == PLACEMENT_CHANNEL)
            this._listenOnChannels();
        if (this.blockPlacement == PLACEMENT_SCENE)
            this._listenOnScenes();
    }


    private _listenOnChannels() {
        this.cancelOnDestroy(
            //
            this.yp.listenBlockChannelSelectedOrChanged()
                .mergeMap((i_campaignTimelineChanelPlayersModel: CampaignTimelineChanelPlayersModel) => {
                    return this.bs.getBlockData(i_campaignTimelineChanelPlayersModel.getCampaignTimelineChanelPlayerId())
                })
                .subscribe((blockData: IBlockData) => {
                    this.m_blockData = blockData;
                    this.render();

                }, (e) => console.error(e))
        )
    }

    private _listenOnScenes() {
        this.cancelOnDestroy(
            //
            this.yp.listenSceneOrBlockSelectedChanged()
                .mergeMap((i_sceneData: ISceneData) => {
                    return this.bs.getBlockDataInScene(i_sceneData)
                })
                .subscribe((blockData: IBlockData) => {
                    this.m_blockData = blockData;
                    this.render();
                }, (e) => console.error(e))
        )
    }

    render() {
        this.markers = [];
        var domPlayerData = this.bs.getBlockPlayerData(this.m_blockData)
        $(domPlayerData).find('GPS').children().each((k, v) => {
            var marker: LocationMarkModel = new LocationMarkModel({
                id: Math.random(),
                draggable: true,
                label: '',
                lat: parseFloat(jXML(v).attr('lat')),
                lng: parseFloat(jXML(v).attr('lng')),
                radius: parseFloat(jXML(v).attr('radios')) * 1000, // convert to meters
                new: false
            });
            this.markers.push(marker.getData().toJS());
            //map.points.push(point);

        });
        if (this.markers.length > 0)
            this.setCenter(this.markers[0].lat, this.markers[0].lng);
    }

    clickedMarker(i_marker: LocationMarkModel, index: number) {
        // con(`clicked the marker: ${i_marker.label || index}`)
        var uiState: IUiState = {locationMap: {locationMarkerSelected: i_marker}}
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    mapClicked($event: MouseEvent) {
        let marker: LocationMarkModel = new LocationMarkModel({
            id: Math.random(),
            radius: 10000,
            lat: $event['coords'].lat,
            lng: $event['coords'].lng,
            draggable: true,
            new: true
        });
        this.markers.push(marker.getData().toJS());
        this.forceUpdateUi();
        var uiState: IUiState = {locationMap: {locationMarkerSelected: marker}}
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
    }

    markerDragEnd(m: LocationMarkModel, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    _close() {
        var uiState: IUiState = {
            locationMap: {
                loadLocationMap: false
            }
        }
        this.yp.dispatch(({type: ACTION_UISTATE_UPDATE, payload: uiState}))
        this.onClose.emit()
    }

    public forceUpdateUi() {
        this.cd.reattach();
        setTimeout(() => {
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
        console.log('dest maps');
    }
}


// markers: marker[] = [
//     {
//         lat: 51.673858,
//         lng: 7.815982,
//         label: 'A',
//         radius: 4000,
//         draggable: true,
//         id: 1
//     },
//     {
//         lat: 51.373858,
//         lng: 7.215982,
//         label: 'B',
//         radius: 10000,
//         draggable: true,
//         id: 2
//     },
//     {
//         lat: 51.723858,
//         lng: 7.895982,
//         radius: 300,
//         label: 'C',
//         draggable: true,
//         id: 3
//     }
// ]

/**
 Create the google map and listen to corresponding events such map clicks (not within a circle or marker)
 as well as the Search box find input etc
 @method _createMap
 **/
// _createMap() {
//     var self = this;
//     google.maps.LatLng.prototype.destinationPoint = function (brng, dist) {
//         dist = dist / 6371;
//         brng = brng.toRad();
//
//         var lat1 = this.lat().toRad(), lon1 = this.lng().toRad();
//
//         var lat2:any = Math.asin(Math.sin(lat1) * Math.cos(dist) +
//             Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
//
//         var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
//                 Math.cos(lat1),
//                 Math.cos(dist) - Math.sin(lat1) *
//                 Math.sin(lat2));
//
//         if (isNaN(lat2) || isNaN(lon2)) return null;
//
//         return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
//     };
//
//     var pointA = new google.maps.LatLng(34.155260, -118.787163);   // Circle center
//     var radius = 1; // 10km
//
//     var mapOpt = {
//         mapTypeId: google.maps.MapTypeId.TERRAIN,
//         center: pointA,
//         zoom: 10
//     };
//     var map = $('.map', self.el.nativeElement);
//     // self.m_map = new google.maps.Map(map[0], mapOpt);
//     console.log(this.googleMaps);

/*

 // Create the search box and link it to the UI element.
 //var input = $('#pac-input', self.el)[0];
 var c = $('.inputPlacement', self.el);
 $(c).append('<input class="pac-input" class="controls" type="text" placeholder="Search Box">');
 var input = $(c).find('input')[0];


 var searchBox = new google.maps.places.SearchBox(input);
 self.m_map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

 // Bias the SearchBox results towards current map's viewport.
 self.m_map.addListener('bounds_changed', function () {
 searchBox.setBounds(self.m_map.getBounds());
 });

 var markers = [];
 // Listen for the event fired when the user selects a prediction and retrieve details for location
 searchBox.addListener('places_changed', function () {
 var places = searchBox.getPlaces();

 if (places.length == 0) {
 return;
 }

 // Clear out the old markers.
 markers.forEach(function (marker) {
 marker.setMap(null);
 });
 markers = [];

 // For each place, get the icon, name and location.
 var bounds = new google.maps.LatLngBounds();
 places.forEach(function (place) {
 var icon = {
 url: place.icon,
 size: new google.maps.Size(71, 71),
 origin: new google.maps.Point(0, 0),
 anchor: new google.maps.Point(17, 34),
 scaledSize: new google.maps.Size(25, 25)
 };

 // Create a marker for each place.
 markers.push(new google.maps.Marker({
 map: self.m_map,
 icon: icon,
 title: place.name,
 position: place.geometry.location
 }));

 if (place.geometry.viewport) {
 // Only geocodes have viewport.
 bounds.union(place.geometry.viewport);
 } else {
 bounds.extend(place.geometry.location);
 }
 });
 self.m_map.fitBounds(bounds);
 });

 google.maps.event.addListener(self.m_map, 'click', function (event) {
 var lat = event.latLng.lat();
 var lng = event.latLng.lng();
 if (self._getSimulationMode()) {
 console.log('out of range ' + lat + ' ' + lng);
 self._simulateEvent(lat, lng, false);
 return;
 }
 if (self.m_markerOnClick) {
 self.addPoint(event.latLng, 0.10);
 self.m_markerOnClick = false;
 BB.comBroker.fire(BB.EVENTS.ADD_LOCATION_POINT, self, null, {lat: lat, lng: lng});
 }
 });
 */
//}