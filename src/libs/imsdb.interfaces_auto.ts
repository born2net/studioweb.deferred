import {List} from 'immutable';
import * as Modals from "../models/msdb.modals_auto";


export interface IStoreData {

    table_global_settings: List<Modals.GlobalSettingsModal>;
    table_resources: List<Modals.ResourcesModal>;
    table_ad_local_packages: List<Modals.AdLocalPackagesModal>;
    table_ad_local_contents: List<Modals.AdLocalContentsModal>;
    table_category_values: List<Modals.CategoryValuesModal>;
    table_catalog_items: List<Modals.CatalogItemsModal>;
    table_catalog_item_infos: List<Modals.CatalogItemInfosModal>;
    table_catalog_item_resources: List<Modals.CatalogItemResourcesModal>;
    table_catalog_item_categories: List<Modals.CatalogItemCategoriesModal>;
    table_player_data: List<Modals.PlayerDataModal>;
    table_boards: List<Modals.BoardsModal>;
    table_campaigns: List<Modals.CampaignsModal>;
    table_campaign_channels: List<Modals.CampaignChannelsModal>;
    table_campaign_channel_players: List<Modals.CampaignChannelPlayersModal>;
    table_campaign_timelines: List<Modals.CampaignTimelinesModal>;
    table_campaign_events: List<Modals.CampaignEventsModal>;
    table_campaign_boards: List<Modals.CampaignBoardsModal>;
    table_board_templates: List<Modals.BoardTemplatesModal>;
    table_board_template_viewers: List<Modals.BoardTemplateViewersModal>;
    table_campaign_timeline_chanels: List<Modals.CampaignTimelineChanelsModal>;
    table_campaign_timeline_channels: List<Modals.CampaignTimelineChannelsModal>;
    table_campaign_timeline_board_templates: List<Modals.CampaignTimelineBoardTemplatesModal>;
    table_campaign_timeline_board_viewer_chanels: List<Modals.CampaignTimelineBoardViewerChanelsModal>;
    table_campaign_timeline_board_viewer_channels: List<Modals.CampaignTimelineBoardViewerChannelsModal>;
    table_campaign_timeline_chanel_players: List<Modals.CampaignTimelineChanelPlayersModal>;
    table_campaign_timeline_schedules: List<Modals.CampaignTimelineSchedulesModal>;
    table_campaign_timeline_sequences: List<Modals.CampaignTimelineSequencesModal>;
    table_scripts: List<Modals.ScriptsModal>;
    table_music_channels: List<Modals.MusicChannelsModal>;
    table_music_channel_songs: List<Modals.MusicChannelSongsModal>;
    table_branch_stations: List<Modals.BranchStationsModal>;
    table_ad_rates: List<Modals.AdRatesModal>;
    table_station_ads: List<Modals.StationAdsModal>;
    table_ad_out_packages: List<Modals.AdOutPackagesModal>;
    table_ad_out_package_contents: List<Modals.AdOutPackageContentsModal>;
    table_ad_out_package_stations: List<Modals.AdOutPackageStationsModal>;
    table_ad_in_domains: List<Modals.AdInDomainsModal>;
    table_ad_in_domain_businesses: List<Modals.AdInDomainBusinessesModal>;
    table_ad_in_domain_business_packages: List<Modals.AdInDomainBusinessPackagesModal>;
    table_ad_in_domain_business_package_stations: List<Modals.AdInDomainBusinessPackageStationsModal>;

}


export const TableNames = [
    'global_settings',
    'resources',
    'ad_local_packages',
    'ad_local_contents',
    'category_values',
    'catalog_items',
    'catalog_item_infos',
    'catalog_item_resources',
    'catalog_item_categories',
    'player_data',
    'boards',
    'campaigns',
    'campaign_channels',
    'campaign_channel_players',
    'campaign_timelines',
    'campaign_events',
    'campaign_boards',
    'board_templates',
    'board_template_viewers',
    'campaign_timeline_chanels',
    'campaign_timeline_channels',
    'campaign_timeline_board_templates',
    'campaign_timeline_board_viewer_chanels',
    'campaign_timeline_board_viewer_channels',
    'campaign_timeline_chanel_players',
    'campaign_timeline_schedules',
    'campaign_timeline_sequences',
    'scripts',
    'music_channels',
    'music_channel_songs',
    'branch_stations',
    'ad_rates',
    'station_ads',
    'ad_out_packages',
    'ad_out_package_contents',
    'ad_out_package_stations',
    'ad_in_domains',
    'ad_in_domain_businesses',
    'ad_in_domain_business_packages',
    'ad_in_domain_business_package_stations',

]


export interface IBaseProto {
    m_name:string;
    fields:Array<any>
    addData: (i_xmlTable) => any;
    getHandle: (i_id) => any;
    setRecordId: (i_handle,i_id) => any;
    createRecord: () => any;
    addRecord: (i_record,i_handle) => any;
    getRec: (i_handle) => any;
    getAllPrimaryKeys: () => any;
    openForEdit: (i_handel) => any;
    openForDelete: (i_handel) => any;
    appendModifyAndNewChangelist: (i_doc) => any;
    appendDeletedChangelist: (i_doc) => any;
    getPlayerDataIds: (i_playerData) => any;
    convertToIds: (i_docPlayerData) => any;
    createPlayId: (i_xmlPlayer) => any;
    getNewPrimaryKeys: () => any;
    getModifyPrimaryKeys: () => any;
    getDeletedPrimaryKeys: () => any;
    getConflictPrimaryKeys: () => any;
    commitChanges: (i_changelistId) => any;

}


export interface ITable_global_settings extends IBaseProto {
    m_fields: [{"field":"param_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"param_key"},{"field":"param_value"}]
}
export interface ITable_resources extends IBaseProto {
    m_fields: [{"field":"resource_id","foriegn":"resources","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"resource_name"},{"field":"resource_type"},{"field":"resource_pixel_width"},{"field":"resource_pixel_height"},{"field":"default_player"},{"field":"snapshot"},{"field":"resource_total_time"},{"field":"resource_date_created"},{"field":"resource_date_modified"},{"field":"resource_trust"},{"field":"resource_public"},{"field":"resource_bytes_total"},{"field":"resource_module"},{"field":"tree_path"},{"field":"access_key"},{"field":"resource_html"},{"field":"shortcut"},{"field":"shortcut_business_id"},{"field":"shortcut_resource_id"}]
}
export interface ITable_ad_local_packages extends IBaseProto {
    m_fields: [{"field":"ad_local_package_id","foriegn":"ad_local_packages","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"enabled"},{"field":"package_name"},{"field":"use_date_range"},{"field":"start_date"},{"field":"end_date"}]
}
export interface ITable_ad_local_contents extends IBaseProto {
    m_fields: [{"field":"ad_local_content_id","foriegn":"ad_local_contents","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_local_package_id","foriegn":"ad_local_packages","isNullAble":false},{"field":"enabled"},{"field":"content_name"}]
}
export interface ITable_category_values extends IBaseProto {
    m_fields: [{"field":"category_value_id","foriegn":"category_values","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"parent_category_value_id"},{"field":"category_value"}]
}
export interface ITable_catalog_items extends IBaseProto {
    m_fields: [{"field":"catalog_item_id","foriegn":"catalog_items","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"item_name"},{"field":"ad_local_content_id","foriegn":"ad_local_contents","isNullAble":true}]
}
export interface ITable_catalog_item_infos extends IBaseProto {
    m_fields: [{"field":"catalog_item_id","foriegn":"catalog_items","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"info0"},{"field":"info1"},{"field":"info2"},{"field":"info3"}]
}
export interface ITable_catalog_item_resources extends IBaseProto {
    m_fields: [{"field":"catalog_item_resource_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"catalog_item_id","foriegn":"catalog_items","isNullAble":false},{"field":"resource_id","foriegn":"resources","isNullAble":false},{"field":"resource_group"}]
}
export interface ITable_catalog_item_categories extends IBaseProto {
    m_fields: [{"field":"catalog_item_category_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"catalog_item_id","foriegn":"catalog_items","isNullAble":false},{"field":"category_value_id","foriegn":"category_values","isNullAble":false}]
}
export interface ITable_player_data extends IBaseProto {
    m_fields: [{"field":"player_data_id","foriegn":"player_data","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"player_data_value"},{"field":"player_data_public"},{"field":"tree_path"},{"field":"source_code"},{"field":"access_key"}]
}
export interface ITable_boards extends IBaseProto {
    m_fields: [{"field":"board_id","foriegn":"boards","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"board_name"},{"field":"board_pixel_width"},{"field":"board_pixel_height"},{"field":"monitor_orientation_enabled"},{"field":"monitor_orientation_index"},{"field":"access_key"},{"field":"tree_path"}]
}
export interface ITable_campaigns extends IBaseProto {
    m_fields: [{"field":"campaign_id","foriegn":"campaigns","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_name"},{"field":"campaign_playlist_mode"},{"field":"kiosk_mode"},{"field":"kiosk_key"},{"field":"kiosk_timeline_id"},{"field":"kiosk_wait_time"},{"field":"mouse_interrupt_mode"},{"field":"tree_path"},{"field":"access_key"}]
}
export interface ITable_campaign_channels extends IBaseProto {
    m_fields: [{"field":"campaign_channel_id","foriegn":"campaign_channels","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_id","foriegn":"campaigns","isNullAble":false},{"field":"chanel_name"},{"field":"chanel_color"},{"field":"random_order"},{"field":"repeat_to_fit"},{"field":"fixed_players_length"}]
}
export interface ITable_campaign_channel_players extends IBaseProto {
    m_fields: [{"field":"campaign_channel_player_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_channel_id","foriegn":"campaign_channels","isNullAble":false},{"field":"player_offset_time"},{"field":"player_duration"},{"field":"player_data"},{"field":"mouse_children"},{"field":"ad_local_content_id","foriegn":"ad_local_contents","isNullAble":true}]
}
export interface ITable_campaign_timelines extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_id","foriegn":"campaigns","isNullAble":false},{"field":"timeline_name"},{"field":"timeline_duration"}]
}
export interface ITable_campaign_events extends IBaseProto {
    m_fields: [{"field":"campaign_event_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_id","foriegn":"campaigns","isNullAble":true},{"field":"sender_name"},{"field":"event_name"},{"field":"event_condition"},{"field":"command_name"},{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":true},{"field":"command_params"}]
}
export interface ITable_campaign_boards extends IBaseProto {
    m_fields: [{"field":"campaign_board_id","foriegn":"campaign_boards","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"board_id","foriegn":"boards","isNullAble":false},{"field":"campaign_id","foriegn":"campaigns","isNullAble":false},{"field":"campaign_board_name"},{"field":"allow_public_view"},{"field":"admin_public_view"}]
}
export interface ITable_board_templates extends IBaseProto {
    m_fields: [{"field":"board_template_id","foriegn":"board_templates","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"board_id","foriegn":"boards","isNullAble":false},{"field":"template_name"}]
}
export interface ITable_board_template_viewers extends IBaseProto {
    m_fields: [{"field":"board_template_viewer_id","foriegn":"board_template_viewers","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"board_template_id","foriegn":"board_templates","isNullAble":false},{"field":"viewer_name"},{"field":"pixel_x"},{"field":"pixel_y"},{"field":"pixel_width"},{"field":"pixel_height"},{"field":"enable_gaps"},{"field":"viewer_order"},{"field":"locked"}]
}
export interface ITable_campaign_timeline_chanels extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_chanel_id","foriegn":"campaign_timeline_chanels","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":false},{"field":"chanel_name"},{"field":"chanel_color"},{"field":"random_order"},{"field":"repeat_to_fit"},{"field":"fixed_players_length"}]
}
export interface ITable_campaign_timeline_channels extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_channel_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":false}]
}
export interface ITable_campaign_timeline_board_templates extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_board_template_id","foriegn":"campaign_timeline_board_templates","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":false},{"field":"board_template_id","foriegn":"board_templates","isNullAble":false},{"field":"campaign_board_id","foriegn":"campaign_boards","isNullAble":false},{"field":"template_offset_time"},{"field":"template_duration"}]
}
export interface ITable_campaign_timeline_board_viewer_chanels extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_board_viewer_chanel_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_board_template_id","foriegn":"campaign_timeline_board_templates","isNullAble":false},{"field":"board_template_viewer_id","foriegn":"board_template_viewers","isNullAble":false},{"field":"campaign_timeline_chanel_id","foriegn":"campaign_timeline_chanels","isNullAble":false}]
}
export interface ITable_campaign_timeline_board_viewer_channels extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_board_viewer_channel_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_board_template_id","foriegn":"campaign_timeline_board_templates","isNullAble":false},{"field":"board_template_viewer_id","foriegn":"board_template_viewers","isNullAble":false},{"field":"campaign_channel_id","foriegn":"campaign_channels","isNullAble":false}]
}
export interface ITable_campaign_timeline_chanel_players extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_chanel_player_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_chanel_id","foriegn":"campaign_timeline_chanels","isNullAble":false},{"field":"player_offset_time"},{"field":"player_duration"},{"field":"player_id"},{"field":"player_editor_id"},{"field":"player_data"},{"field":"mouse_children"},{"field":"ad_local_content_id","foriegn":"ad_local_contents","isNullAble":true}]
}
export interface ITable_campaign_timeline_schedules extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_schedule_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":false},{"field":"priorty"},{"field":"start_date"},{"field":"end_date"},{"field":"repeat_type"},{"field":"week_days"},{"field":"custom_duration"},{"field":"duration"},{"field":"start_time"},{"field":"pattern_enabled"},{"field":"pattern_name"}]
}
export interface ITable_campaign_timeline_sequences extends IBaseProto {
    m_fields: [{"field":"campaign_timeline_sequence_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"campaign_id","foriegn":"campaigns","isNullAble":false},{"field":"campaign_timeline_id","foriegn":"campaign_timelines","isNullAble":false},{"field":"sequence_index"},{"field":"sequence_count"}]
}
export interface ITable_scripts extends IBaseProto {
    m_fields: [{"field":"script_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"script_src"}]
}
export interface ITable_music_channels extends IBaseProto {
    m_fields: [{"field":"music_channel_id","foriegn":"music_channels","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"music_channel_name"},{"field":"access_key"},{"field":"tree_path"}]
}
export interface ITable_music_channel_songs extends IBaseProto {
    m_fields: [{"field":"music_channel_song_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"music_channel_id","foriegn":"music_channels","isNullAble":false},{"field":"resource_id","foriegn":"resources","isNullAble":false}]
}
export interface ITable_branch_stations extends IBaseProto {
    m_fields: [{"field":"branch_station_id","foriegn":"branch_stations","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"branch_id"},{"field":"campaign_board_id","foriegn":"campaign_boards","isNullAble":true},{"field":"station_name"},{"field":"reboot_exceed_mem_enabled"},{"field":"reboot_exceed_mem_value"},{"field":"reboot_time_enabled"},{"field":"reboot_time_value"},{"field":"reboot_error_enabled"},{"field":"monitor_standby_enabled"},{"field":"monitor_standby_from"},{"field":"monitor_standby_to"},{"field":"location_address"},{"field":"location_long"},{"field":"location_lat"},{"field":"map_type"},{"field":"map_zoom"},{"field":"station_selected"},{"field":"advertising_description"},{"field":"advertising_keys"},{"field":"reboot_exceed_mem_action"},{"field":"reboot_time_action"},{"field":"reboot_error_action"},{"field":"station_mode"},{"field":"power_mode"},{"field":"power_on_day1"},{"field":"power_off_day1"},{"field":"power_on_day2"},{"field":"power_off_day2"},{"field":"power_on_day3"},{"field":"power_off_day3"},{"field":"power_on_day4"},{"field":"power_off_day4"},{"field":"power_on_day5"},{"field":"power_off_day5"},{"field":"power_on_day6"},{"field":"power_off_day6"},{"field":"power_on_day7"},{"field":"power_off_day7"},{"field":"send_notification"},{"field":"frame_rate"},{"field":"quality"},{"field":"transition_enabled"},{"field":"zwave_config"},{"field":"lan_server_enabled"},{"field":"lan_server_ip"},{"field":"lan_server_port"}]
}
export interface ITable_ad_rates extends IBaseProto {
    m_fields: [{"field":"ad_rate_id","foriegn":"ad_rates","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_rate_name"},{"field":"ad_rate_map"},{"field":"hour_rate0"},{"field":"hour_rate1"},{"field":"hour_rate2"},{"field":"hour_rate3"}]
}
export interface ITable_station_ads extends IBaseProto {
    m_fields: [{"field":"branch_station_id","foriegn":"branch_stations","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"advertising_network"},{"field":"advertising_description"},{"field":"advertising_keys"},{"field":"ad_rate_id","foriegn":"ad_rates","isNullAble":true}]
}
export interface ITable_ad_out_packages extends IBaseProto {
    m_fields: [{"field":"ad_out_package_id","foriegn":"ad_out_packages","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"package_name"},{"field":"start_date"},{"field":"end_date"}]
}
export interface ITable_ad_out_package_contents extends IBaseProto {
    m_fields: [{"field":"ad_out_package_content_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_out_package_id","foriegn":"ad_out_packages","isNullAble":false},{"field":"resource_id","foriegn":"resources","isNullAble":true},{"field":"player_data_id","foriegn":"player_data","isNullAble":true},{"field":"duration"},{"field":"reparations_per_hour"}]
}
export interface ITable_ad_out_package_stations extends IBaseProto {
    m_fields: [{"field":"ad_out_package_station_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_out_package_id","foriegn":"ad_out_packages","isNullAble":false},{"field":"ad_out_subdomain"},{"field":"ad_out_business_id"},{"field":"ad_out_station_id"},{"field":"days_mask"},{"field":"hour_start"},{"field":"hour_end"}]
}
export interface ITable_ad_in_domains extends IBaseProto {
    m_fields: [{"field":"ad_in_domain_id","foriegn":"ad_in_domains","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_out_domain"},{"field":"accept_new_business"}]
}
export interface ITable_ad_in_domain_businesses extends IBaseProto {
    m_fields: [{"field":"ad_in_domain_business_id","foriegn":"ad_in_domain_businesses","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_in_domain_id","foriegn":"ad_in_domains","isNullAble":false},{"field":"ad_out_business_id"},{"field":"accept_new_package"}]
}
export interface ITable_ad_in_domain_business_packages extends IBaseProto {
    m_fields: [{"field":"ad_in_domain_business_package_id","foriegn":"ad_in_domain_business_packages","isNullAble":false},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_in_domain_business_id","foriegn":"ad_in_domain_businesses","isNullAble":false},{"field":"ad_package_id"},{"field":"accept_new_station"},{"field":"suspend_modified_package_date"},{"field":"suspend_modified_content"}]
}
export interface ITable_ad_in_domain_business_package_stations extends IBaseProto {
    m_fields: [{"field":"ad_in_domain_business_package_station_id"},{"field":"changelist_id"},{"field":"change_type"},{"field":"ad_in_domain_business_package_id","foriegn":"ad_in_domain_business_packages","isNullAble":false},{"field":"ad_package_station_id"},{"field":"accept_status"},{"field":"suspend_modified_station"}]
}
export interface ICreateDataBase extends IBaseProto {
    m_fields: undefined
}
export interface ICreateHandles extends IBaseProto {
    m_fields: undefined
}



export interface IDataManager_proto {
    table_global_settings:()=> ITable_global_settings
    table_resources:()=> ITable_resources
    table_ad_local_packages:()=> ITable_ad_local_packages
    table_ad_local_contents:()=> ITable_ad_local_contents
    table_category_values:()=> ITable_category_values
    table_catalog_items:()=> ITable_catalog_items
    table_catalog_item_infos:()=> ITable_catalog_item_infos
    table_catalog_item_resources:()=> ITable_catalog_item_resources
    table_catalog_item_categories:()=> ITable_catalog_item_categories
    table_player_data:()=> ITable_player_data
    table_boards:()=> ITable_boards
    table_campaigns:()=> ITable_campaigns
    table_campaign_channels:()=> ITable_campaign_channels
    table_campaign_channel_players:()=> ITable_campaign_channel_players
    table_campaign_timelines:()=> ITable_campaign_timelines
    table_campaign_events:()=> ITable_campaign_events
    table_campaign_boards:()=> ITable_campaign_boards
    table_board_templates:()=> ITable_board_templates
    table_board_template_viewers:()=> ITable_board_template_viewers
    table_campaign_timeline_chanels:()=> ITable_campaign_timeline_chanels
    table_campaign_timeline_channels:()=> ITable_campaign_timeline_channels
    table_campaign_timeline_board_templates:()=> ITable_campaign_timeline_board_templates
    table_campaign_timeline_board_viewer_chanels:()=> ITable_campaign_timeline_board_viewer_chanels
    table_campaign_timeline_board_viewer_channels:()=> ITable_campaign_timeline_board_viewer_channels
    table_campaign_timeline_chanel_players:()=> ITable_campaign_timeline_chanel_players
    table_campaign_timeline_schedules:()=> ITable_campaign_timeline_schedules
    table_campaign_timeline_sequences:()=> ITable_campaign_timeline_sequences
    table_scripts:()=> ITable_scripts
    table_music_channels:()=> ITable_music_channels
    table_music_channel_songs:()=> ITable_music_channel_songs
    table_branch_stations:()=> ITable_branch_stations
    table_ad_rates:()=> ITable_ad_rates
    table_station_ads:()=> ITable_station_ads
    table_ad_out_packages:()=> ITable_ad_out_packages
    table_ad_out_package_contents:()=> ITable_ad_out_package_contents
    table_ad_out_package_stations:()=> ITable_ad_out_package_stations
    table_ad_in_domains:()=> ITable_ad_in_domains
    table_ad_in_domain_businesses:()=> ITable_ad_in_domain_businesses
    table_ad_in_domain_business_packages:()=> ITable_ad_in_domain_business_packages
    table_ad_in_domain_business_package_stations:()=> ITable_ad_in_domain_business_package_stations
    createDataBase:()=> ICreateDataBase
    createHandles:()=> ICreateHandles

}

