import {Inject, Injectable} from "@angular/core";
import {getDiggData} from "./block-digg";
import {getYouTubeData} from "./block-youtube";


@Injectable()
export class BlockService {

    constructor(@Inject('BLOCK_PLACEMENT') private blockPlacement: string) {
    }

    public getServiceType(): string {
        return this.blockPlacement;
    }


    getPlayerData = (i_type) => {
        if (i_type == '1') {
            return getDiggData();
        } else {
            return getYouTubeData();
        }

    }

}