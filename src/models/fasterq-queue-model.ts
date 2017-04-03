import {StoreModel} from "../models/StoreModel";
export class FasterqQueueModel extends StoreModel {

    constructor(data) {
        super(data);
    }

    public get queued() {
        return this.getKey('queue_id');
    }

}