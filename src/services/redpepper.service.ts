import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {IDataBaseManager, ILoadManager, IPepperConnection, IPepperAuthReply} from "../store/imsdb.interfaces";
import * as MsdbModels from "../store/imsdb.interfaces_auto";
import {TableNames, ISDK} from "../store/imsdb.interfaces_auto";
import {StoreModel} from "../store/model/StoreModel";
import {List} from "immutable";
import {ACTION_REDUXIFY_NOW} from "../store/actions/appdb.actions";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application.state";

export type redpepperTables = {
    tables: ISDK
    tableNames: Array<string>;
    data?: any;
}

export type redpepperTablesAction =  {
    type: 'ACTION_REDUXIFY_NOW';
    payload: Array<redpepperTables>
}

@Injectable()
export class RedPepperService {

    constructor(private store: Store<ApplicationState>) {
    }

    private m_tablesPendingToProcess: Array<any> = [];
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

    /**
     Save to server
     @method save
     @return none
     **/
    save(i_callback) {
        this.m_loaderManager.save(i_callback);
    }

    /**
     Sync internal sdk to remote mediaSERVER account
     @method requestData
     @param {Function} i_callback
     **/
    sync(i_callBack) {
        this.m_loaderManager.requestData(i_callBack);
    }

    private addPendingTables(tables: Array<any>) {
        tables.forEach(table => {
            if (this.m_tablesPendingToProcess.indexOf(table) == -1)
                this.m_tablesPendingToProcess.push(table);
        });
    }

    private resetPendingTables() {
        this.m_tablesPendingToProcess = [];
    }

    private capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * reduxSubmit
     * if passed in table names, process it
     * if not, try and see if any pending pendingTableSync exist, if so process it
     * if not, process all tables
     * @param tableNameTargets
     * @returns {redpepperTables}
     */
    reduxSubmit(tableNameTargets?: Array<string>): redpepperTables {
        var tablesNames: Array<string> = [];
        if (tableNameTargets) {
            tablesNames = tableNameTargets;
        } else {
            if (this.m_tablesPendingToProcess.length > 0) {
                tablesNames = this.m_tablesPendingToProcess;
            } else {
                tablesNames = TableNames;
            }
        }
        tablesNames = tablesNames.map(tableName => {
            if (tableName.indexOf('table_') > -1)  // protection against appending table_
                return tableName.replace(/table_/, '');
            return tableName;

        });
        var tableNamesTouched = {};
        var redpepperSet: redpepperTables = {tables: null, tableNames: tablesNames};
        var tables = {}
        tablesNames.forEach((table, v) => {
            var tableName = 'table_' + table;
            var storeName = this.capitalizeFirstLetter(StringJS(table).camelize().s) + 'Modal';
            var storeModelList: List<StoreModel> = List<StoreModel>();
            tables[tableName] = storeModelList;

            var totalKeys = 0
            $(this.databaseManager[tableName]().getAllPrimaryKeys()).each((k, primary_id) => {
                totalKeys++;
            })
            if (totalKeys == 0) {
                tables[tableName] = storeModelList;
                tableNamesTouched[tableName] = tableName;
            } else {
                $(this.databaseManager[tableName]().getAllPrimaryKeys()).each((k, primary_id) => {
                    var record = this.databaseManager[tableName]().getRec(primary_id);
                    // if (record == null)
                    //     return;
                    // if (record.change_type == 3)
                    //     return;
                    // record.this = null;
                    // record.proto = null;
                    // record._proto_ = null;
                    // record.__proto__ = null;
                    var newClass: StoreModel = new MsdbModels[storeName](record);
                    storeModelList = storeModelList.push(newClass);
                    tables[tableName] = storeModelList;
                    tableNamesTouched[tableName] = tableName;
                });
                // this.databaseManager[tableName]().getAllPrimaryKeys().forEach((k, primary_id) => {
                //
                // });
            }


            redpepperSet.tables = tables as any;
            redpepperSet.tableNames = Object.keys(tableNamesTouched).map(function (key) {
                return tableNamesTouched[key];
            });
        });
        this.resetPendingTables();
        this.store.dispatch({type: ACTION_REDUXIFY_NOW, payload: [redpepperSet]})
        return redpepperSet;
    }


    /**
     Create a new campaign in the local database
     @method createCampaign
     @param {Number} i_campaginName
     @return {Number} campaign id created
     **/
    createCampaign(i_campaignName): number {
        var campaigns = this.databaseManager.table_campaigns();
        var campaign = campaigns.createRecord();
        campaign.campaign_name = i_campaignName;
        campaigns.addRecord(campaign, undefined);
        this.addPendingTables(['campaigns']);
        return campaign.campaign_id;
    }

    renameCampaign(i_campaignName): void {
        this.databaseManager.table_campaigns().openForEdit(0);
        var recCampaign = this.databaseManager.table_campaigns().getRec(0);
        recCampaign['campaign_name'] = i_campaignName;
        this.addPendingTables(['campaigns']);
    }

    /**
     Create a new board, also known as Screen (screen divisions reside inside the board as viewers)
     @method createBoard
     @param {Number} i_boardName
     @param {Number} i_width of the board
     @param {Number} i_height of the board
     @return {Number} the board id
     **/
    createBoard(i_boardName, i_width, i_height): number {
        var boards = this.databaseManager.table_boards();
        var board = boards.createRecord();
        board.board_name = i_boardName;
        board.board_pixel_width = i_width;
        board.board_pixel_height = i_height;
        boards.addRecord(board, undefined);
        this.addPendingTables(['table_boards']);
        return board['board_id'];
    }

    /**
     Create a new global template (screen and viewers) and assign the new template to the given global board_id
     @method createNewTemplate
     @param {Number} i_board_id
     @param {Object} i_screenProps json object with all the viewers and attributes to create in msdb
     @return {Object} returnData encapsulates the board_template_id and board_template_viewer_ids created
     **/
    createNewTemplate(i_board_id, i_screenProps): any {
        var returnData = {
            board_template_id: -1,
            viewers: []
        };
        // create screen template under board_id
        var boardTemplates = this.databaseManager.table_board_templates();
        var boardTemplate = boardTemplates.createRecord();
        boardTemplate.template_name = "board template";
        boardTemplate.board_id = i_board_id; // bind screen template to board
        boardTemplates.addRecord(boardTemplate, undefined);

        var board_template_id = boardTemplate['board_template_id'];

        // add viewers (screen divisions)
        var viewers = this.databaseManager.table_board_template_viewers();
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
        this.addPendingTables(['table_board_templates', 'table_board_template_viewers']);
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
    setCampaignRecord(i_campaign_id, i_key, i_value): void {
        this.databaseManager.table_campaigns().openForEdit(i_campaign_id);
        var recCampaign = this.databaseManager.table_campaigns().getRec(i_campaign_id);
        recCampaign[i_key] = i_value;
        this.addPendingTables(['table_campaigns']);
    }

    /**
     Assign a campaign to a board, binding the to by referenced ids
     @method assignCampaignToBoard
     @param {Number} i_campaign_id the campaign id to assign to board
     @param {Number} i_board_id the board id to assign to campaign
     @return {Number} campain_board_id
     **/
    assignCampaignToBoard(i_campaign_id, i_board_id): number {
        var campaign_boards = this.databaseManager.table_campaign_boards();
        var campain_board = campaign_boards.createRecord();
        campain_board.campaign_id = i_campaign_id;
        campain_board.board_id = i_board_id;
        campaign_boards.addRecord(campain_board, undefined);
        this.addPendingTables(['table_campaign_boards']);
        return campain_board['campaign_board_id']
    }

    /**
     Create a new timeline under the specified campaign_id
     @method createNewTimeline
     @param {Number} i_campaign_id
     @return {Number} campaign_timeline_id the timeline id created
     **/
    createNewTimeline(i_campaign_id): number {
        var timelines = this.databaseManager.table_campaign_timelines();
        var timeline = timelines.createRecord();
        timeline.campaign_id = i_campaign_id;
        timeline.timeline_name = "Timeline";
        timelines.addRecord(timeline, undefined);
        this.addPendingTables(['table_campaign_timelines']);
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
    setCampaignTimelineSequencerIndex(i_campaign_id, i_campaign_timeline_id, i_sequenceIndex): void {
        var updatedSequence = false;
        $(this.databaseManager.table_campaign_timeline_sequences().getAllPrimaryKeys()).each((k, campaign_timeline_sequence_id) => {
            var recCampaignTimelineSequence = this.databaseManager.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            if (recCampaignTimelineSequence.campaign_timeline_id == i_campaign_timeline_id) {
                this.databaseManager.table_campaign_timeline_sequences().openForEdit(campaign_timeline_sequence_id);
                var recEditCampaignTimelineSequence = this.databaseManager.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
                recEditCampaignTimelineSequence.sequence_index = i_sequenceIndex;
                recEditCampaignTimelineSequence.sequence_count = 0;
                updatedSequence = true;
            }
        });

        // i_campaign_timeline_id was not found in the sequencer so create new record
        if (updatedSequence == false) {
            var table_campaign_timeline_sequences = this.databaseManager.table_campaign_timeline_sequences();
            var recCampaignTimelineSequence = table_campaign_timeline_sequences.createRecord();
            recCampaignTimelineSequence.sequence_index = i_sequenceIndex;
            recCampaignTimelineSequence.sequence_count = 0;
            recCampaignTimelineSequence.campaign_timeline_id = i_campaign_timeline_id;
            recCampaignTimelineSequence.campaign_id = i_campaign_id;
            table_campaign_timeline_sequences.addRecord(recCampaignTimelineSequence, undefined);
        }
        this.addPendingTables(['table_campaign_timeline_sequences']);
    }

    /**
     Assign viewers (screen divisions) on the timeline to channels, so we get one viewer per channel
     @method assignViewersToTimelineChannels
     @param {Number} i_campaign_timeline_board_template_id
     @param {Object} i_viewers a json object with all viewers
     @param {Array} i_channels a json object with all channels
     @return none
     **/
    assignViewersToTimelineChannels(i_campaign_timeline_board_template_id, i_viewers, i_channels): void {
        var viewerChanels = this.databaseManager.table_campaign_timeline_board_viewer_chanels();
        for (var i in i_viewers) {
            var viewerChanel = viewerChanels.createRecord();
            viewerChanel.campaign_timeline_board_template_id = i_campaign_timeline_board_template_id;
            viewerChanel.board_template_viewer_id = i_viewers[i];
            viewerChanel.campaign_timeline_chanel_id = i_channels.shift();
            viewerChanels.addRecord(viewerChanel, undefined);
        }
        this.addPendingTables(['table_campaign_timeline_board_viewer_chanels']);
    }

    /**
     Create a campaign timelime scheduler record for new timeline
     @method createCampaignTimelineScheduler
     @param {Number} i_campaign_id
     @param {Number} i_campaign_timeline_id
     @return none
     **/
    createCampaignTimelineScheduler(i_campaign_id, i_campaign_timeline_id): void {
        var startDate = new Date();
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        var dateStart = startDate.getMonth() + 1 + '/' + startDate.getDate() + '/' + startDate.getFullYear() + ' 12:00 AM';
        var dateEnd = endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear() + ' 12:00 AM';
        var table_campaign_timeline_schedules = this.databaseManager.table_campaign_timeline_schedules();
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
        this.addPendingTables(['table_campaign_timeline_schedules']);
    }

    /**
     Get a list of all campaigns per the account
     @method getCampaignIDs
     @return {Array} campaigns
     **/
    getCampaignIDs(): Array<number> {
        var campaignsIds = [];
        $(this.databaseManager.table_campaigns().getAllPrimaryKeys()).each((k, campaign_id) => {
            campaignsIds.push(campaign_id);
        });
        return campaignsIds;
    }

    /**
     Bind the template (screen division template)to the specified timeline (i_campaign_timeline_id).
     We need to also provide the board_template_id (screen template of the global board) as well as
     the campaign's board_id to complete the binding
     @method assignTemplateToTimeline
     @param {Number} i_campaign_timeline_id to assign to template
     @param {Number} i_board_template_id is the global board id (does not belong to campaign) to assign to the template
     @param {Number} i_campaign_board_id is the campaign specific board id that will be bound to the template
     @return {Number} campaign_timeline_board_template_id
     **/
    assignTemplateToTimeline(i_campaign_timeline_id, i_board_template_id, i_campaign_board_id): number {
        var timelineTemplate = this.databaseManager.table_campaign_timeline_board_templates();
        var timelineScreen = timelineTemplate.createRecord();
        timelineScreen.campaign_timeline_id = i_campaign_timeline_id;
        timelineScreen.board_template_id = i_board_template_id;
        timelineScreen.campaign_board_id = i_campaign_board_id;
        timelineTemplate.addRecord(timelineScreen, undefined);
        this.addPendingTables(['table_campaign_timeline_board_templates']);
        return timelineScreen['campaign_timeline_board_template_id'];
    }

    /**
     Create channels and assign these channels to the timeline
     @method createTimelineChannels
     @param {Number} i_campaign_timeline_id the timeline id to assign channel to
     @param {Object} i_viewers we use viewer as a reference count to know how many channels to create (i.e.: one per channel)
     @return {Array} createdChanels array of channel ids created
     **/
    createTimelineChannels(i_campaign_timeline_id, i_viewers): Array<any> {
        var createdChanels = [];
        var x = 0;
        for (var i in i_viewers) {
            x++;
            var chanels = this.databaseManager.table_campaign_timeline_chanels();
            var chanel = chanels.createRecord();
            chanel.chanel_name = "CH" + x;
            chanel.campaign_timeline_id = i_campaign_timeline_id;
            chanels.addRecord(chanel, undefined);
            createdChanels.push(chanel['campaign_timeline_chanel_id']);
        }
        this.addPendingTables(['table_campaign_timeline_chanels']);
        return createdChanels;
    }

    /**
     Set a timeline's total duration
     @method setTimelineTotalDuration
     @param {Number} i_campaign_timeline_id
     @param {Number} i_totalDuration
     **/
    setTimelineTotalDuration(i_campaign_timeline_id, i_totalDuration): void {
        this.databaseManager.table_campaign_timelines().openForEdit(i_campaign_timeline_id);
        var recCampaignTimeline = this.databaseManager.table_campaign_timelines().getRec(i_campaign_timeline_id);
        recCampaignTimeline['timeline_duration'] = i_totalDuration;
        this.addPendingTables(['table_campaign_timelines']);
    }

    removeCampaignEntirely(i_campaign_id): void {
        var timelineIDs = this.getCampaignTimelines(i_campaign_id);
        for (var i = 0; i < timelineIDs.length; i++) {
            var timelineID = timelineIDs[i];
            var boardTemplateID = this.getGlobalTemplateIdOfTimeline(timelineID);
            this.removeTimelineFromCampaign(timelineID);
            var campaignTimelineBoardTemplateID = this.removeBoardTemplateFromTimeline(timelineID);
            this.removeTimelineBoardViewerChannels(campaignTimelineBoardTemplateID);
            this.removeBoardTemplate(boardTemplateID);
            this.removeBoardTemplateViewers(boardTemplateID);
            this.removeTimelineFromSequences(timelineID);
            this.removeSchedulerFromTime(timelineID);

            var channelsIDs = this.getChannelsOfTimeline(timelineID);
            for (var n = 0; n < channelsIDs.length; n++) {
                var channelID = channelsIDs[n];
                this.removeChannelFromTimeline(channelID);

                var blockIDs = this.getChannelBlocks(channelID);
                for (var x = 0; x < blockIDs.length; x++) {
                    var blockID = blockIDs[x];
                    this.removeBlockFromTimelineChannel(blockID);
                }
            }
        }
        this.removeCampaign(i_campaign_id);
        this.removeCampaignBoard(i_campaign_id);

        // check to see if any other campaigns are left, do some clean house and remove all campaign > boards
        var campaignIDs = this.getCampaignIDs();
        if (campaignIDs.length == 0)
            this.removeAllBoards();
    }

    /**
     Remove a campaign record
     @method removeCampaign
     @param {Number} i_campaign_id
     @return none
     **/
    removeCampaign(i_campaign_id) {
        this.databaseManager.table_campaigns().openForDelete(i_campaign_id);
        this.addPendingTables(['table_campaigns']);
    }

    /**
     Get all timeline ids for specified campaign
     @method getCampaignTimelines
     @param {Number} i_campaign_id
     @return {Array} timeline ids
     **/
    getCampaignTimelines(i_campaign_id): Array<number> {
        var timelineIDs = [];
        $(this.databaseManager.table_campaign_timelines().getAllPrimaryKeys()).each((k, campaign_timeline_id) => {
            var recCampaignTimeline = this.databaseManager.table_campaign_timelines().getRec(campaign_timeline_id);
            if (recCampaignTimeline['campaign_id'] == i_campaign_id) {
                timelineIDs.push(campaign_timeline_id);
            }
        });
        this.addPendingTables(['table_campaign_timelines']);
        return timelineIDs;
    }

    /**
     Get all the global board template ids of a timeline
     @method getGlobalTemplateIdOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} foundGlobalBoardTemplatesIDs global board template ids
     **/
    getGlobalTemplateIdOfTimeline(i_campaign_timeline_id): number {
        var found = [];
        $(this.databaseManager.table_campaign_timeline_board_templates().getAllPrimaryKeys()).each((k, table_campaign_timeline_board_template_id) => {
            var recCampaignTimelineBoardTemplate = this.databaseManager.table_campaign_timeline_board_templates().getRec(table_campaign_timeline_board_template_id);
            if (recCampaignTimelineBoardTemplate['campaign_timeline_id'] == i_campaign_timeline_id) {
                found.push(recCampaignTimelineBoardTemplate['board_template_id']);
            }
        });
        this.addPendingTables(['table_campaign_timeline_board_templates']);
        return found[0];
    }

    /**
     Remove a timeline from a campaign.
     @method removeTimelineFromCampaign
     @param {Number} i_campaign_timeline_id
     @return none
     **/
    removeTimelineFromCampaign(i_campaign_timeline_id): void {
        this.databaseManager.table_campaign_timelines().openForDelete(i_campaign_timeline_id);
        this.addPendingTables(['table_campaign_timelines']);
    }

    /**
     Remove board template from timeline
     @method removeBoardTemplateFromTimeline
     @param {Number} i_timeline_id
     @return {Number} campaign_timeline_board_template_id
     **/
    removeBoardTemplateFromTimeline(i_timeline_id): number {
        var campaign_timeline_board_template_id = this.getTemplatesOfTimeline(i_timeline_id)[0];
        this.databaseManager.table_campaign_timeline_board_templates().openForDelete(campaign_timeline_board_template_id);
        this.addPendingTables(['table_campaign_timeline_board_templates']);
        return campaign_timeline_board_template_id;
    }

    /**
     Remove board template viewers
     @method removeTimelineBoardViewerChannels
     @param {Number} i_campaign_timeline_board_template_id
     @return none
     **/
    removeTimelineBoardViewerChannels(i_campaign_timeline_board_template_id) {
        $(this.databaseManager.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each((k, campaign_timeline_board_viewer_chanel_id) => {
            var recCampaignTimelineViewerChanels = this.databaseManager.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);
            if (recCampaignTimelineViewerChanels['campaign_timeline_board_template_id'] == i_campaign_timeline_board_template_id) {
                this.databaseManager.table_campaign_timeline_board_viewer_chanels().openForDelete(campaign_timeline_board_viewer_chanel_id);
            }
        });
        this.addPendingTables(['table_campaign_timeline_board_viewer_chanels']);
    }

    /**
     Remove board template
     @method removeBoardTemplate
     @param {Number} i_campaign_timeline_board_template_id
     **/
    removeBoardTemplate(i_board_template_id): number {
        this.databaseManager.table_board_templates().openForDelete(i_board_template_id);
        this.addPendingTables(['table_board_templates']);
        return i_board_template_id;
    }

    /**
     Remove board template viewers
     @method removeBoardTemplateViewers
     @param {Number} i_board_template_id
     @return {Array} boardTemplateViewerIDs
     **/
    removeBoardTemplateViewers(i_board_template_id): Array<number> {
        var boardTemplateViewerIDs = [];
        $(this.databaseManager.table_board_template_viewers().getAllPrimaryKeys()).each((k, board_template_viewer_id) => {
            var recBoardTemplateViewers = this.databaseManager.table_board_template_viewers().getRec(board_template_viewer_id);
            if (recBoardTemplateViewers['board_template_id'] == i_board_template_id) {
                var a = this.databaseManager.table_board_template_viewers().openForDelete(board_template_viewer_id);
                boardTemplateViewerIDs.push(board_template_viewer_id);
            }
        });
        this.addPendingTables(['table_board_template_viewers']);
        return boardTemplateViewerIDs;
    }

    /**
     Remove a timeline from sequences
     @method removeTimelineFromSequences
     @param {Number} i_timeline_id
     @return none
     **/
    removeTimelineFromSequences(i_campaign_timeline_id): void {
        $(this.databaseManager.table_campaign_timeline_sequences().getAllPrimaryKeys()).each((k, campaign_timeline_sequence_id) => {
            var recCampaignTimelineSequence = this.databaseManager.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            if (recCampaignTimelineSequence['campaign_timeline_id'] == i_campaign_timeline_id) {
                this.databaseManager.table_campaign_timeline_sequences().openForDelete(campaign_timeline_sequence_id);
            }
        });
        this.addPendingTables(['table_campaign_timeline_sequences']);
    }

    /**
     Remove a schedule from timeline
     @method removeSchedulerFromTime
     @param {Number} i_campaign_timeline_id
     @return none
     **/
    removeSchedulerFromTime(i_campaign_timeline_id): void {
        $(this.databaseManager.table_campaign_timeline_schedules().getAllPrimaryKeys()).each((k, campaign_timeline_schedule_id) => {
            var recCampaignTimelineSchedule = this.databaseManager.table_campaign_timeline_schedules().getRec(campaign_timeline_schedule_id);
            if (recCampaignTimelineSchedule.campaign_timeline_id == i_campaign_timeline_id) {
                this.databaseManager.table_campaign_timeline_schedules().openForDelete(campaign_timeline_schedule_id);
            }
        });
        this.addPendingTables(['table_campaign_timeline_schedules']);
    }

    /**
     Get all the campaign > timeline > channels ids of a timeline
     @method getChannelsOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} channel ids
     **/
    getChannelsOfTimeline(i_campaign_timeline_id): Array<number> {
        var foundChannelsIDs = [];
        $(this.databaseManager.table_campaign_timeline_chanels().getAllPrimaryKeys()).each((k, campaign_timeline_chanel_id) => {
            var recCampaignTimelineChannel = this.databaseManager.table_campaign_timeline_chanels().getRec(campaign_timeline_chanel_id);
            if (i_campaign_timeline_id == recCampaignTimelineChannel['campaign_timeline_id']) {
                foundChannelsIDs.push(campaign_timeline_chanel_id);
            }
        });
        this.addPendingTables(['table_campaign_timeline_chanels']);
        return foundChannelsIDs;
    }

    /**
     Remove a channel from a timeline
     @method removeChannelFromTimeline
     @param {Number} i_channel_id
     @return {Boolean} status
     **/
    removeChannelFromTimeline(i_channel_id): number {
        this.addPendingTables(['table_campaign_timeline_chanels']);
        return this.databaseManager.table_campaign_timeline_chanels().openForDelete(i_channel_id);
    }

    /**
     Get all the block IDs of a particular channel.
     Push them into an array so they are properly sorted by player offset time.
     @method getChannelBlocksIDs
     @param {Number} i_campaign_timeline_chanel_id
     @return {Array} foundBlocks
     **/
    getChannelBlocks(i_campaign_timeline_chanel_id): Array<number> {
        var foundBlocks = [];
        $(this.databaseManager.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each((k, campaign_timeline_chanel_player_id) => {
            var recCampaignTimelineChannelPlayer = this.databaseManager.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
            if (i_campaign_timeline_chanel_id == recCampaignTimelineChannelPlayer['campaign_timeline_chanel_id']) {
                foundBlocks.push(campaign_timeline_chanel_player_id);
            }
        });
        this.addPendingTables(['table_campaign_timeline_chanel_players']);
        return foundBlocks;
    }

    /**
     Remove a block (i.e.: player) from campaign > timeline > channel
     @method removeBlockFromTimelineChannel
     @param {Number} i_block_id
     @return none
     **/
    removeBlockFromTimelineChannel(i_block_id): void {
        var status = this.databaseManager.table_campaign_timeline_chanel_players().openForDelete(i_block_id);
        this.addPendingTables(['table_campaign_timeline_chanel_players']);
    }

    /**
     Remove campaign board_id
     @method removeCampaignBoard
     @param {Number} i_campaign_id
     @return none
     **/
    removeCampaignBoard(i_campaign_id): void {
        $(this.databaseManager.table_campaign_boards().getAllPrimaryKeys()).each((k, campaign_board_id) => {
            var recCampaignBoard = this.databaseManager.table_campaign_boards().getRec(campaign_board_id);
            if (recCampaignBoard['campaign_id'] == i_campaign_id) {
                this.databaseManager.table_campaign_boards().openForDelete(campaign_board_id);
            }
        });
        this.addPendingTables(['table_campaign_boards']);
    }

    /**
     Remove all boards in sdk
     @method removeAllBoards
     @return none
     **/
    removeAllBoards(): void {
        $(this.databaseManager.table_boards().getAllPrimaryKeys()).each((k, board_id) => {
            this.databaseManager.table_boards().openForDelete(board_id);
        });
        this.addPendingTables(['table_boards']);
    }

    /**
     Get all the campaign > timeline > board > template ids of a timeline
     @method getTemplatesOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} template ids
     **/
    getTemplatesOfTimeline(i_campaign_timeline_id): Array<number> {
        var foundTemplatesIDs = [];
        $(this.databaseManager.table_campaign_timeline_board_templates().getAllPrimaryKeys()).each((k, table_campaign_timeline_board_template_id) => {
            var recCampaignTimelineBoardTemplate = this.databaseManager.table_campaign_timeline_board_templates().getRec(table_campaign_timeline_board_template_id);
            if (recCampaignTimelineBoardTemplate['campaign_timeline_id'] == i_campaign_timeline_id) {
                foundTemplatesIDs.push(table_campaign_timeline_board_template_id);
            }
        });
        this.addPendingTables(['table_campaign_timeline_board_templates']);
        return foundTemplatesIDs;
    }
}