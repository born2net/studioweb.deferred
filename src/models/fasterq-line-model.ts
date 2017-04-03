import {StoreModel} from "../models/StoreModel";
export class FasterqLineModel extends StoreModel {

    constructor(data) {
        super(data);
    }

    public get lineId() {
        return this.getKey('line_id');
    }

    public get businessId() {
        return this.getKey('business_id');
    }

    public get lineName() {
        return this.getKey('name');
    }

    public get serviceId() {
        return this.getKey('service_id');
    }

    public get reminder() {
        return this.getKey('reminder');
    }
}