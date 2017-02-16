/**
 * extend msdb.interfaces_auto with additional functionality
 * requirement: same name as extended class / model + Ext
 */


import {CampaignsModel, CampaignTimelineChanelPlayersModel} from "../imsdb.interfaces_auto";

export class CampaignsModelExt extends CampaignsModel {

    public getCampaignPlaylistModeName(): string {
        if (this.getCampaignPlaylistMode() == 0) {
            return 'sequencer'
        } else {
            return 'scheduler'
        }
    }

}

export class CampaignTimelineChanelPlayersModelExt extends CampaignTimelineChanelPlayersModel {
    public getPlayerOffsetTimeInt() {
        return parseFloat(this.getKey('player_offset_time'));
    }

}