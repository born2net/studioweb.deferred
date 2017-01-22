import {CampaignsModal} from "../imsdb.interfaces_auto";

export class CampaignsModalExt extends CampaignsModal {

    public getCampaignPlaylistModeName(): string {
        if (this.getCampaignPlaylistMode() == 0) {
            return 'sequencer'
        } else {
            return 'scheduler'
        }
    }
}