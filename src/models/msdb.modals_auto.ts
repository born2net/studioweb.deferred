import {StoreModel} from "../store/model/StoreModel";

export class GlobalSettingsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getParamId() {
        return this.getKey('param_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getParamKey() {
        return this.getKey('param_key');
    }

    public getParamValue() {
        return this.getKey('param_value');
    }

}
export class ResourcesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getResourceId() {
        return this.getKey('resource_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getResourceName() {
        return this.getKey('resource_name');
    }

    public getResourceType() {
        return this.getKey('resource_type');
    }

    public getResourcePixelWidth() {
        return this.getKey('resource_pixel_width');
    }

    public getResourcePixelHeight() {
        return this.getKey('resource_pixel_height');
    }

    public getDefaultPlayer() {
        return this.getKey('default_player');
    }

    public getSnapshot() {
        return this.getKey('snapshot');
    }

    public getResourceTotalTime() {
        return this.getKey('resource_total_time');
    }

    public getResourceDateCreated() {
        return this.getKey('resource_date_created');
    }

    public getResourceDateModified() {
        return this.getKey('resource_date_modified');
    }

    public getResourceTrust() {
        return this.getKey('resource_trust');
    }

    public getResourcePublic() {
        return this.getKey('resource_public');
    }

    public getResourceBytesTotal() {
        return this.getKey('resource_bytes_total');
    }

    public getResourceModule() {
        return this.getKey('resource_module');
    }

    public getTreePath() {
        return this.getKey('tree_path');
    }

    public getAccessKey() {
        return this.getKey('access_key');
    }

    public getResourceHtml() {
        return this.getKey('resource_html');
    }

    public getShortcut() {
        return this.getKey('shortcut');
    }

    public getShortcutBusinessId() {
        return this.getKey('shortcut_business_id');
    }

    public getShortcutResourceId() {
        return this.getKey('shortcut_resource_id');
    }

}
export class AdLocalPackagesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdLocalPackageId() {
        return this.getKey('ad_local_package_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getEnabled() {
        return this.getKey('enabled');
    }

    public getPackageName() {
        return this.getKey('package_name');
    }

    public getUseDateRange() {
        return this.getKey('use_date_range');
    }

    public getStartDate() {
        return this.getKey('start_date');
    }

    public getEndDate() {
        return this.getKey('end_date');
    }

}
export class AdLocalContentsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdLocalContentId() {
        return this.getKey('ad_local_content_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdLocalPackageId() {
        return this.getKey('ad_local_package_id');
    }

    public getEnabled() {
        return this.getKey('enabled');
    }

    public getContentName() {
        return this.getKey('content_name');
    }

}
export class CategoryValuesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCategoryValueId() {
        return this.getKey('category_value_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getParentCategoryValueId() {
        return this.getKey('parent_category_value_id');
    }

    public getCategoryValue() {
        return this.getKey('category_value');
    }

}
export class CatalogItemsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCatalogItemId() {
        return this.getKey('catalog_item_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getItemName() {
        return this.getKey('item_name');
    }

    public getAdLocalContentId() {
        return this.getKey('ad_local_content_id');
    }

}
export class CatalogItemInfosModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCatalogItemId() {
        return this.getKey('catalog_item_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getInfo0() {
        return this.getKey('info0');
    }

    public getInfo1() {
        return this.getKey('info1');
    }

    public getInfo2() {
        return this.getKey('info2');
    }

    public getInfo3() {
        return this.getKey('info3');
    }

}
export class CatalogItemResourcesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCatalogItemResourceId() {
        return this.getKey('catalog_item_resource_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCatalogItemId() {
        return this.getKey('catalog_item_id');
    }

    public getResourceId() {
        return this.getKey('resource_id');
    }

    public getResourceGroup() {
        return this.getKey('resource_group');
    }

}
export class CatalogItemCategoriesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCatalogItemCategoryId() {
        return this.getKey('catalog_item_category_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCatalogItemId() {
        return this.getKey('catalog_item_id');
    }

    public getCategoryValueId() {
        return this.getKey('category_value_id');
    }

}
export class PlayerDataModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getPlayerDataId() {
        return this.getKey('player_data_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getPlayerDataValue() {
        return this.getKey('player_data_value');
    }

    public getPlayerDataPublic() {
        return this.getKey('player_data_public');
    }

    public getTreePath() {
        return this.getKey('tree_path');
    }

    public getSourceCode() {
        return this.getKey('source_code');
    }

    public getAccessKey() {
        return this.getKey('access_key');
    }

}
export class BoardsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getBoardId() {
        return this.getKey('board_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getBoardName() {
        return this.getKey('board_name');
    }

    public getBoardPixelWidth() {
        return this.getKey('board_pixel_width');
    }

    public getBoardPixelHeight() {
        return this.getKey('board_pixel_height');
    }

    public getMonitorOrientationEnabled() {
        return this.getKey('monitor_orientation_enabled');
    }

    public getMonitorOrientationIndex() {
        return this.getKey('monitor_orientation_index');
    }

    public getAccessKey() {
        return this.getKey('access_key');
    }

    public getTreePath() {
        return this.getKey('tree_path');
    }

}
export class CampaignsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignId() {
        return this.getKey('campaign_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignName() {
        return this.getKey('campaign_name');
    }

    public getCampaignPlaylistMode() {
        return this.getKey('campaign_playlist_mode');
    }

    public getKioskMode() {
        return this.getKey('kiosk_mode');
    }

    public getKioskKey() {
        return this.getKey('kiosk_key');
    }

    public getKioskTimelineId() {
        return this.getKey('kiosk_timeline_id');
    }

    public getKioskWaitTime() {
        return this.getKey('kiosk_wait_time');
    }

    public getMouseInterruptMode() {
        return this.getKey('mouse_interrupt_mode');
    }

    public getTreePath() {
        return this.getKey('tree_path');
    }

    public getAccessKey() {
        return this.getKey('access_key');
    }

}
export class CampaignChannelsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignChannelId() {
        return this.getKey('campaign_channel_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignId() {
        return this.getKey('campaign_id');
    }

    public getChanelName() {
        return this.getKey('chanel_name');
    }

    public getChanelColor() {
        return this.getKey('chanel_color');
    }

    public getRandomOrder() {
        return this.getKey('random_order');
    }

    public getRepeatToFit() {
        return this.getKey('repeat_to_fit');
    }

    public getFixedPlayersLength() {
        return this.getKey('fixed_players_length');
    }

}
export class CampaignChannelPlayersModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignChannelPlayerId() {
        return this.getKey('campaign_channel_player_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignChannelId() {
        return this.getKey('campaign_channel_id');
    }

    public getPlayerOffsetTime() {
        return this.getKey('player_offset_time');
    }

    public getPlayerDuration() {
        return this.getKey('player_duration');
    }

    public getPlayerData() {
        return this.getKey('player_data');
    }

    public getMouseChildren() {
        return this.getKey('mouse_children');
    }

    public getAdLocalContentId() {
        return this.getKey('ad_local_content_id');
    }

}
export class CampaignTimelinesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignId() {
        return this.getKey('campaign_id');
    }

    public getTimelineName() {
        return this.getKey('timeline_name');
    }

    public getTimelineDuration() {
        return this.getKey('timeline_duration');
    }

}
export class CampaignEventsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignEventId() {
        return this.getKey('campaign_event_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignId() {
        return this.getKey('campaign_id');
    }

    public getSenderName() {
        return this.getKey('sender_name');
    }

    public getEventName() {
        return this.getKey('event_name');
    }

    public getEventCondition() {
        return this.getKey('event_condition');
    }

    public getCommandName() {
        return this.getKey('command_name');
    }

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

    public getCommandParams() {
        return this.getKey('command_params');
    }

}
export class CampaignBoardsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignBoardId() {
        return this.getKey('campaign_board_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getBoardId() {
        return this.getKey('board_id');
    }

    public getCampaignId() {
        return this.getKey('campaign_id');
    }

    public getCampaignBoardName() {
        return this.getKey('campaign_board_name');
    }

    public getAllowPublicView() {
        return this.getKey('allow_public_view');
    }

    public getAdminPublicView() {
        return this.getKey('admin_public_view');
    }

}
export class BoardTemplatesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getBoardTemplateId() {
        return this.getKey('board_template_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getBoardId() {
        return this.getKey('board_id');
    }

    public getTemplateName() {
        return this.getKey('template_name');
    }

}
export class BoardTemplateViewersModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getBoardTemplateViewerId() {
        return this.getKey('board_template_viewer_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getBoardTemplateId() {
        return this.getKey('board_template_id');
    }

    public getViewerName() {
        return this.getKey('viewer_name');
    }

    public getPixelX() {
        return this.getKey('pixel_x');
    }

    public getPixelY() {
        return this.getKey('pixel_y');
    }

    public getPixelWidth() {
        return this.getKey('pixel_width');
    }

    public getPixelHeight() {
        return this.getKey('pixel_height');
    }

    public getEnableGaps() {
        return this.getKey('enable_gaps');
    }

    public getViewerOrder() {
        return this.getKey('viewer_order');
    }

    public getLocked() {
        return this.getKey('locked');
    }

}
export class CampaignTimelineChanelsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineChanelId() {
        return this.getKey('campaign_timeline_chanel_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

    public getChanelName() {
        return this.getKey('chanel_name');
    }

    public getChanelColor() {
        return this.getKey('chanel_color');
    }

    public getRandomOrder() {
        return this.getKey('random_order');
    }

    public getRepeatToFit() {
        return this.getKey('repeat_to_fit');
    }

    public getFixedPlayersLength() {
        return this.getKey('fixed_players_length');
    }

}
export class CampaignTimelineChannelsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineChannelId() {
        return this.getKey('campaign_timeline_channel_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

}
export class CampaignTimelineBoardTemplatesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineBoardTemplateId() {
        return this.getKey('campaign_timeline_board_template_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

    public getBoardTemplateId() {
        return this.getKey('board_template_id');
    }

    public getCampaignBoardId() {
        return this.getKey('campaign_board_id');
    }

    public getTemplateOffsetTime() {
        return this.getKey('template_offset_time');
    }

    public getTemplateDuration() {
        return this.getKey('template_duration');
    }

}
export class CampaignTimelineBoardViewerChanelsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineBoardViewerChanelId() {
        return this.getKey('campaign_timeline_board_viewer_chanel_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineBoardTemplateId() {
        return this.getKey('campaign_timeline_board_template_id');
    }

    public getBoardTemplateViewerId() {
        return this.getKey('board_template_viewer_id');
    }

    public getCampaignTimelineChanelId() {
        return this.getKey('campaign_timeline_chanel_id');
    }

}
export class CampaignTimelineBoardViewerChannelsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineBoardViewerChannelId() {
        return this.getKey('campaign_timeline_board_viewer_channel_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineBoardTemplateId() {
        return this.getKey('campaign_timeline_board_template_id');
    }

    public getBoardTemplateViewerId() {
        return this.getKey('board_template_viewer_id');
    }

    public getCampaignChannelId() {
        return this.getKey('campaign_channel_id');
    }

}
export class CampaignTimelineChanelPlayersModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineChanelPlayerId() {
        return this.getKey('campaign_timeline_chanel_player_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineChanelId() {
        return this.getKey('campaign_timeline_chanel_id');
    }

    public getPlayerOffsetTime() {
        return this.getKey('player_offset_time');
    }

    public getPlayerDuration() {
        return this.getKey('player_duration');
    }

    public getPlayerId() {
        return this.getKey('player_id');
    }

    public getPlayerEditorId() {
        return this.getKey('player_editor_id');
    }

    public getPlayerData() {
        return this.getKey('player_data');
    }

    public getMouseChildren() {
        return this.getKey('mouse_children');
    }

    public getAdLocalContentId() {
        return this.getKey('ad_local_content_id');
    }

}
export class CampaignTimelineSchedulesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineScheduleId() {
        return this.getKey('campaign_timeline_schedule_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

    public getPriorty() {
        return this.getKey('priorty');
    }

    public getStartDate() {
        return this.getKey('start_date');
    }

    public getEndDate() {
        return this.getKey('end_date');
    }

    public getRepeatType() {
        return this.getKey('repeat_type');
    }

    public getWeekDays() {
        return this.getKey('week_days');
    }

    public getCustomDuration() {
        return this.getKey('custom_duration');
    }

    public getDuration() {
        return this.getKey('duration');
    }

    public getStartTime() {
        return this.getKey('start_time');
    }

    public getPatternEnabled() {
        return this.getKey('pattern_enabled');
    }

    public getPatternName() {
        return this.getKey('pattern_name');
    }

}
export class CampaignTimelineSequencesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getCampaignTimelineSequenceId() {
        return this.getKey('campaign_timeline_sequence_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getCampaignId() {
        return this.getKey('campaign_id');
    }

    public getCampaignTimelineId() {
        return this.getKey('campaign_timeline_id');
    }

    public getSequenceIndex() {
        return this.getKey('sequence_index');
    }

    public getSequenceCount() {
        return this.getKey('sequence_count');
    }

}
export class ScriptsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getScriptId() {
        return this.getKey('script_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getScriptSrc() {
        return this.getKey('script_src');
    }

}
export class MusicChannelsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getMusicChannelId() {
        return this.getKey('music_channel_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getMusicChannelName() {
        return this.getKey('music_channel_name');
    }

    public getAccessKey() {
        return this.getKey('access_key');
    }

    public getTreePath() {
        return this.getKey('tree_path');
    }

}
export class MusicChannelSongsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getMusicChannelSongId() {
        return this.getKey('music_channel_song_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getMusicChannelId() {
        return this.getKey('music_channel_id');
    }

    public getResourceId() {
        return this.getKey('resource_id');
    }

}
export class BranchStationsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getBranchStationId() {
        return this.getKey('branch_station_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getBranchId() {
        return this.getKey('branch_id');
    }

    public getCampaignBoardId() {
        return this.getKey('campaign_board_id');
    }

    public getStationName() {
        return this.getKey('station_name');
    }

    public getRebootExceedMemEnabled() {
        return this.getKey('reboot_exceed_mem_enabled');
    }

    public getRebootExceedMemValue() {
        return this.getKey('reboot_exceed_mem_value');
    }

    public getRebootTimeEnabled() {
        return this.getKey('reboot_time_enabled');
    }

    public getRebootTimeValue() {
        return this.getKey('reboot_time_value');
    }

    public getRebootErrorEnabled() {
        return this.getKey('reboot_error_enabled');
    }

    public getMonitorStandbyEnabled() {
        return this.getKey('monitor_standby_enabled');
    }

    public getMonitorStandbyFrom() {
        return this.getKey('monitor_standby_from');
    }

    public getMonitorStandbyTo() {
        return this.getKey('monitor_standby_to');
    }

    public getLocationAddress() {
        return this.getKey('location_address');
    }

    public getLocationLong() {
        return this.getKey('location_long');
    }

    public getLocationLat() {
        return this.getKey('location_lat');
    }

    public getMapType() {
        return this.getKey('map_type');
    }

    public getMapZoom() {
        return this.getKey('map_zoom');
    }

    public getStationSelected() {
        return this.getKey('station_selected');
    }

    public getAdvertisingDescription() {
        return this.getKey('advertising_description');
    }

    public getAdvertisingKeys() {
        return this.getKey('advertising_keys');
    }

    public getRebootExceedMemAction() {
        return this.getKey('reboot_exceed_mem_action');
    }

    public getRebootTimeAction() {
        return this.getKey('reboot_time_action');
    }

    public getRebootErrorAction() {
        return this.getKey('reboot_error_action');
    }

    public getStationMode() {
        return this.getKey('station_mode');
    }

    public getPowerMode() {
        return this.getKey('power_mode');
    }

    public getPowerOnDay1() {
        return this.getKey('power_on_day1');
    }

    public getPowerOffDay1() {
        return this.getKey('power_off_day1');
    }

    public getPowerOnDay2() {
        return this.getKey('power_on_day2');
    }

    public getPowerOffDay2() {
        return this.getKey('power_off_day2');
    }

    public getPowerOnDay3() {
        return this.getKey('power_on_day3');
    }

    public getPowerOffDay3() {
        return this.getKey('power_off_day3');
    }

    public getPowerOnDay4() {
        return this.getKey('power_on_day4');
    }

    public getPowerOffDay4() {
        return this.getKey('power_off_day4');
    }

    public getPowerOnDay5() {
        return this.getKey('power_on_day5');
    }

    public getPowerOffDay5() {
        return this.getKey('power_off_day5');
    }

    public getPowerOnDay6() {
        return this.getKey('power_on_day6');
    }

    public getPowerOffDay6() {
        return this.getKey('power_off_day6');
    }

    public getPowerOnDay7() {
        return this.getKey('power_on_day7');
    }

    public getPowerOffDay7() {
        return this.getKey('power_off_day7');
    }

    public getSendNotification() {
        return this.getKey('send_notification');
    }

    public getFrameRate() {
        return this.getKey('frame_rate');
    }

    public getQuality() {
        return this.getKey('quality');
    }

    public getTransitionEnabled() {
        return this.getKey('transition_enabled');
    }

    public getZwaveConfig() {
        return this.getKey('zwave_config');
    }

    public getLanServerEnabled() {
        return this.getKey('lan_server_enabled');
    }

    public getLanServerIp() {
        return this.getKey('lan_server_ip');
    }

    public getLanServerPort() {
        return this.getKey('lan_server_port');
    }

}
export class AdRatesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdRateId() {
        return this.getKey('ad_rate_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdRateName() {
        return this.getKey('ad_rate_name');
    }

    public getAdRateMap() {
        return this.getKey('ad_rate_map');
    }

    public getHourRate0() {
        return this.getKey('hour_rate0');
    }

    public getHourRate1() {
        return this.getKey('hour_rate1');
    }

    public getHourRate2() {
        return this.getKey('hour_rate2');
    }

    public getHourRate3() {
        return this.getKey('hour_rate3');
    }

}
export class StationAdsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getBranchStationId() {
        return this.getKey('branch_station_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdvertisingNetwork() {
        return this.getKey('advertising_network');
    }

    public getAdvertisingDescription() {
        return this.getKey('advertising_description');
    }

    public getAdvertisingKeys() {
        return this.getKey('advertising_keys');
    }

    public getAdRateId() {
        return this.getKey('ad_rate_id');
    }

}
export class AdOutPackagesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdOutPackageId() {
        return this.getKey('ad_out_package_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getPackageName() {
        return this.getKey('package_name');
    }

    public getStartDate() {
        return this.getKey('start_date');
    }

    public getEndDate() {
        return this.getKey('end_date');
    }

}
export class AdOutPackageContentsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdOutPackageContentId() {
        return this.getKey('ad_out_package_content_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdOutPackageId() {
        return this.getKey('ad_out_package_id');
    }

    public getResourceId() {
        return this.getKey('resource_id');
    }

    public getPlayerDataId() {
        return this.getKey('player_data_id');
    }

    public getDuration() {
        return this.getKey('duration');
    }

    public getReparationsPerHour() {
        return this.getKey('reparations_per_hour');
    }

}
export class AdOutPackageStationsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdOutPackageStationId() {
        return this.getKey('ad_out_package_station_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdOutPackageId() {
        return this.getKey('ad_out_package_id');
    }

    public getAdOutSubdomain() {
        return this.getKey('ad_out_subdomain');
    }

    public getAdOutBusinessId() {
        return this.getKey('ad_out_business_id');
    }

    public getAdOutStationId() {
        return this.getKey('ad_out_station_id');
    }

    public getDaysMask() {
        return this.getKey('days_mask');
    }

    public getHourStart() {
        return this.getKey('hour_start');
    }

    public getHourEnd() {
        return this.getKey('hour_end');
    }

}
export class AdInDomainsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdInDomainId() {
        return this.getKey('ad_in_domain_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdOutDomain() {
        return this.getKey('ad_out_domain');
    }

    public getAcceptNewBusiness() {
        return this.getKey('accept_new_business');
    }

}
export class AdInDomainBusinessesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdInDomainBusinessId() {
        return this.getKey('ad_in_domain_business_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdInDomainId() {
        return this.getKey('ad_in_domain_id');
    }

    public getAdOutBusinessId() {
        return this.getKey('ad_out_business_id');
    }

    public getAcceptNewPackage() {
        return this.getKey('accept_new_package');
    }

}
export class AdInDomainBusinessPackagesModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdInDomainBusinessPackageId() {
        return this.getKey('ad_in_domain_business_package_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdInDomainBusinessId() {
        return this.getKey('ad_in_domain_business_id');
    }

    public getAdPackageId() {
        return this.getKey('ad_package_id');
    }

    public getAcceptNewStation() {
        return this.getKey('accept_new_station');
    }

    public getSuspendModifiedPackageDate() {
        return this.getKey('suspend_modified_package_date');
    }

    public getSuspendModifiedContent() {
        return this.getKey('suspend_modified_content');
    }

}
export class AdInDomainBusinessPackageStationsModal extends StoreModel {
    constructor(data: any = {}) {super(data);}

    public getAdInDomainBusinessPackageStationId() {
        return this.getKey('ad_in_domain_business_package_station_id');
    }

    public getChangelistId() {
        return this.getKey('changelist_id');
    }

    public getChangeType() {
        return this.getKey('change_type');
    }

    public getAdInDomainBusinessPackageId() {
        return this.getKey('ad_in_domain_business_package_id');
    }

    public getAdPackageStationId() {
        return this.getKey('ad_package_station_id');
    }

    public getAcceptStatus() {
        return this.getKey('accept_status');
    }

    public getSuspendModifiedStation() {
        return this.getKey('suspend_modified_station');
    }

}
