import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IDataBaseManager, ILoadManager, IPepperConnection, IPepperAuthReply} from "../store/imsdb.interfaces";
import * as MsdbModels from "../store/imsdb.interfaces_auto";
import {TableNames, ISDK} from "../store/imsdb.interfaces_auto";
import {StoreModel} from "../store/model/StoreModel";
import {List} from "immutable";

export type redpepperTables = {
    tables: ISDK
    tableNames: Array<string>;
    data?: any;
}

export type redpepperTablesAction =  {
    type: 'ACTION_REDUXIFY_MSDB';
    payload: Array<redpepperTables>
}

@Injectable()
export class RedPepperService {

    private m_loaderManager: ILoadManager;
    private databaseManager: IDataBaseManager;

    public dbConnect(i_user, i_pass): Observable<any> {
        return Observable.create(observer => {
            this.m_loaderManager = new LoaderManager() as ILoadManager;
            this.databaseManager = this.m_loaderManager.m_dataBaseManager;

            this.m_loaderManager.create(i_user, i_pass, (pepperAuthReply: IPepperAuthReply) => {
                var pepperConnection: IPepperConnection = {
                    pepperAuthReply: pepperAuthReply,
                    dDataBaseManager: this.databaseManager,
                    loadManager: this.m_loaderManager,
                }
                observer.next(pepperConnection);
            });
        })
    }

    private capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    reduxifyMsdbTable(tableNameTargets?: Array<string>): redpepperTables {
        var tablesNames: Array<string> = tableNameTargets ? tableNameTargets : TableNames;
        var tableNamesTouched = {};
        var redpepperSet: redpepperTables = {tables: null, tableNames: tablesNames};
        var tables = {}
        tablesNames.forEach((table, v) => {
            var tableName = 'table_' + table;
            var storeName = this.capitalizeFirstLetter(StringJS(table).camelize().s) + 'Modal';
            var storeModelList: List<StoreModel> = List<StoreModel>();
            tables[tableName] = storeModelList;
            this.databaseManager[tableName]().getAllPrimaryKeys().forEach((k, primary_id) => {
                var record = this.databaseManager[tableName]().getRec(primary_id);
                var newClass: StoreModel = new MsdbModels[storeName](record);
                storeModelList = storeModelList.push(newClass);
                tables[tableName] = storeModelList;
                tableNamesTouched[tableName] = tableName;
            });
            redpepperSet.tables = tables as any;
            redpepperSet.tableNames = Object.keys(tableNamesTouched).map(function (key) { return tableNamesTouched[key]; });;
        });
        return redpepperSet;
    }

    /**
     Create a new campaign in the local database
     @method createCampaign
     @param {Number} i_campaginName
     @return {Number} campaign id created
     **/
    createCampaign(i_campaignName): redpepperTables {
        var campaigns = this.databaseManager.table_campaigns();
        var campaign = campaigns.createRecord();
        campaign.campaign_name = i_campaignName;
        campaigns.addRecord(campaign, undefined);
        return this.reduxifyMsdbTable(['campaigns']);
    }

    renameCampaign(i_campaignName): redpepperTables {
        this.databaseManager.table_campaigns().openForEdit(0);
        var recCampaign = this.databaseManager.table_campaigns().getRec(0);
        recCampaign['campaign_name'] = i_campaignName;
        return this.reduxifyMsdbTable(['campaigns']);
    }

    /**
     Create a new board, also known as Screen (screen divisions reside inside the board as viewers)
     @method createBoard
     @param {Number} i_boardName
     @param {Number} i_width of the board
     @param {Number} i_height of the board
     @return {Number} the board id
     **/
    createBoard(i_boardName, i_width, i_height): redpepperTables {
        var boards = this.databaseManager.table_boards();
        var board = boards.createRecord();
        board.board_name = i_boardName;
        board.board_pixel_width = i_width;
        board.board_pixel_height = i_height;
        boards.addRecord(board, undefined);
        // return board['board_id'];
        var redpepperSet:redpepperTables = this.reduxifyMsdbTable(['boards','campaigns']);
        redpepperSet.data = {board_id: board['board_id']};
        return redpepperSet;
    }

    /**
     Create a new global template (screen and viewers) and assign the new template to the given global board_id
     @method createNewTemplate
     @param {Number} i_board_id
     @param {Object} i_screenProps json object with all the viewers and attributes to create in msdb
     @return {Object} returnData encapsulates the board_template_id and board_template_viewer_ids created
     **/
    createNewTemplate(i_board_id, i_screenProps) {
        var self = this;

        var returnData = {
            board_template_id: -1,
            viewers: []
        };
        // create screen template under board_id
        var boardTemplates = self.databaseManager.table_board_templates();
        var boardTemplate = boardTemplates.createRecord();
        boardTemplate.template_name = "board template";
        boardTemplate.board_id = i_board_id; // bind screen template to board
        boardTemplates.addRecord(boardTemplate, undefined);

        var board_template_id = boardTemplate['board_template_id'];

        // add viewers (screen divisions)
        var viewers = self.databaseManager.table_board_template_viewers();
        var i = 0;
        for (var screenValues in i_screenProps) {
            i++;
            var viewer = viewers.createRecord();
            viewer.viewer_name = "Viewer" + i;
            viewer.pixel_width = i_screenProps[screenValues]['w'];
            viewer.pixel_height = i_screenProps[screenValues]['h'];
            viewer.pixel_x = i_screenProps[screenValues]['x'];
            viewer.pixel_y = i_screenProps[screenValues]['y'];
            viewer.board_template_id = boardTemplate.board_template_id; // bind screen division to screen template
            viewers.addRecord(viewer, undefined);
            returnData['viewers'].push(viewer['board_template_viewer_id']);
        }
        returnData['board_template_id'] = board_template_id
        // pepper.fire(Pepper['NEW_TEMPLATE_CREATED'], self, null, returnData);
        return returnData;
    }

    /**
     Set a campaign table record for the specified i_campaign_id.
     The method uses generic key / value fields so it can set any part of the record.
     @method setCampaignRecord
     @param {Number} i_campaign_id
     @param {Object} i_key
     @param {String} i_value
     @return {Object} foundCampaignRecord
     **/
    setCampaignRecord(i_campaign_id, i_key, i_value) {
        var self = this;
        self.databaseManager.table_campaigns().openForEdit(i_campaign_id);
        var recCampaign = self.databaseManager.table_campaigns().getRec(i_campaign_id);
        recCampaign[i_key] = i_value;
    }

    /**
     Assign a campaign to a board, binding the to by referenced ids
     @method assignCampaignToBoard
     @param {Number} i_campaign_id the campaign id to assign to board
     @param {Number} i_board_id the board id to assign to campaign
     @return {Number} campain_board_id
     **/
    assignCampaignToBoard(i_campaign_id, i_board_id) {
        var self = this;
        var campaign_boards = self.databaseManager.table_campaign_boards();
        var campain_board = campaign_boards.createRecord();
        campain_board.campaign_id = i_campaign_id;
        campain_board.board_id = i_board_id;
        campaign_boards.addRecord(campain_board, undefined);
        return campain_board['campaign_board_id'];
    }

    /**
     Create a new timeline under the specified campaign_id
     @method createNewTimeline
     @param {Number} i_campaign_id
     @return {Number} campaign_timeline_id the timeline id created
     **/
    createNewTimeline(i_campaign_id) {
        var self = this;
        var timelines = self.databaseManager.table_campaign_timelines();
        var timeline = timelines.createRecord();
        timeline.campaign_id = i_campaign_id;
        timeline.timeline_name = "Timeline";
        timelines.addRecord(timeline, undefined);
        // pepper.fire(Pepper['NEW_TIMELINE_CREATED'], self, null, timeline['campaign_timeline_id']);
        return timeline['campaign_timeline_id'];
    }

    /**
     Set the sequence index of a timeline in campaign. If timeline is not found in sequencer, we insert it with the supplied i_sequenceIndex
     @method setCampaignTimelineSequencerIndex
     @param {Number} i_campaign_id
     @param {Number} i_campaign_timeline_id
     @param {Number} i_sequenceIndex is the index to use for the timeline so we can playback the timeline in the specified index order
     @return none
     **/
    setCampaignTimelineSequencerIndex(i_campaign_id, i_campaign_timeline_id, i_sequenceIndex) {
        var self = this;
        var updatedSequence = false;
        $(self.databaseManager.table_campaign_timeline_sequences().getAllPrimaryKeys()).each(function (k, campaign_timeline_sequence_id) {
            var recCampaignTimelineSequence = self.databaseManager.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            if (recCampaignTimelineSequence.campaign_timeline_id == i_campaign_timeline_id) {
                self.databaseManager.table_campaign_timeline_sequences().openForEdit(campaign_timeline_sequence_id);
                var recEditCampaignTimelineSequence = self.databaseManager.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
                recEditCampaignTimelineSequence.sequence_index = i_sequenceIndex;
                recEditCampaignTimelineSequence.sequence_count = 0;
                updatedSequence = true;
            }
        });

        // i_campaign_timeline_id was not found in the sequencer so create new record
        if (updatedSequence == false) {
            var table_campaign_timeline_sequences = self.databaseManager.table_campaign_timeline_sequences();
            var recCampaignTimelineSequence = table_campaign_timeline_sequences.createRecord();
            recCampaignTimelineSequence.sequence_index = i_sequenceIndex;
            recCampaignTimelineSequence.sequence_count = 0;
            recCampaignTimelineSequence.campaign_timeline_id = i_campaign_timeline_id;
            recCampaignTimelineSequence.campaign_id = i_campaign_id;
            table_campaign_timeline_sequences.addRecord(recCampaignTimelineSequence, undefined);
        }
    }

    /**
     Assign viewers (screen divisions) on the timeline to channels, so we get one viewer per channel
     @method assignViewersToTimelineChannels
     @param {Number} i_campaign_timeline_board_template_id
     @param {Object} i_viewers a json object with all viewers
     @param {Array} i_channels a json object with all channels
     @return none
     **/
    assignViewersToTimelineChannels(i_campaign_timeline_board_template_id, i_viewers, i_channels) {
        var self = this;
        var viewerChanels = self.databaseManager.table_campaign_timeline_board_viewer_chanels();
        for (var i in i_viewers) {
            var viewerChanel = viewerChanels.createRecord();
            viewerChanel.campaign_timeline_board_template_id = i_campaign_timeline_board_template_id;
            viewerChanel.board_template_viewer_id = i_viewers[i];
            viewerChanel.campaign_timeline_chanel_id = i_channels.shift();
            viewerChanels.addRecord(viewerChanel, undefined);
        }
    }

    /**
     Create a campaign timelime scheduler record for new timeline
     @method createCampaignTimelineScheduler
     @param {Number} i_campaign_id
     @param {Number} i_campaign_timeline_id
     @return none
     **/
    createCampaignTimelineScheduler(i_campaign_id, i_campaign_timeline_id) {
        var self = this;
        var startDate = new Date();
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        var dateStart = startDate.getMonth() + 1 + '/' + startDate.getDate() + '/' + startDate.getFullYear() + ' 12:00 AM';
        var dateEnd = endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear() + ' 12:00 AM';
        var table_campaign_timeline_schedules = self.databaseManager.table_campaign_timeline_schedules();
        var recCampaignTimelineSchedules = table_campaign_timeline_schedules.createRecord();
        recCampaignTimelineSchedules.campaign_timeline_id = i_campaign_timeline_id;
        recCampaignTimelineSchedules.custom_duration = 'True';
        recCampaignTimelineSchedules.duration = 3600;
        recCampaignTimelineSchedules.repeat_type = 1;
        recCampaignTimelineSchedules.week_days = 127;
        recCampaignTimelineSchedules.conflict = false;
        recCampaignTimelineSchedules.pattern_name = 'pattern';
        recCampaignTimelineSchedules.priority = 1;
        recCampaignTimelineSchedules.start_date = dateStart;
        recCampaignTimelineSchedules.end_date = dateEnd;
        table_campaign_timeline_schedules.addRecord(recCampaignTimelineSchedules, undefined);
    }

    /**
     Set a timeline's total duration
     @method setTimelineTotalDuration
     @param {Number} i_campaign_timeline_id
     @param {Number} i_totalDuration
     **/
    setTimelineTotalDuration(i_campaign_timeline_id, i_totalDuration) {
        var self = this;
        self.databaseManager.table_campaign_timelines().openForEdit(i_campaign_timeline_id);
        var recCampaignTimeline = self.databaseManager.table_campaign_timelines().getRec(i_campaign_timeline_id);
        recCampaignTimeline['timeline_duration'] = i_totalDuration;
    }


}