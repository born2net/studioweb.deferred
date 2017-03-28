import {StoreModel} from "../models/StoreModel";
export class StationModel extends StoreModel {

    constructor(data) {
        super(data);
    }

    public setTime() {
        return this.setKey<StationModel>(StationModel, 'authTime', new Date());
    }

    public getTime() {
        return this.getKey('authTime');
    }

    // public setField(i_field, i_value) {
    //     var value = this.getKey('Value');
    //     value[i_field] = i_value;
    //     return this.setKey<AdnetRateModel>(AdnetRateModel, 'Value', value);
    // }

}