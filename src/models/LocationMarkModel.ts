import {StoreModel} from "../models/StoreModel";
export class LocationMarkModel extends StoreModel {

    constructor(data) {
        super(data);
    }

    public setLng(value) {
        return this.setKey<LocationMarkModel>(LocationMarkModel, 'lng', value);
    }

    public getLng() {
        return this.getKey('lng');
    }

    public setLat(value) {
        return this.setKey<LocationMarkModel>(LocationMarkModel, 'lat', value);
    }

    public getLat() {
        return this.getKey('lat');
    }

    public seRadius(value) {
        return this.setKey<LocationMarkModel>(LocationMarkModel, 'radius', value);
    }

    public getRadius() {
        return this.getKey('radius');
    }

}