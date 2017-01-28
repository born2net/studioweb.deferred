import {Component, ChangeDetectionStrategy} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {CommBroker} from "../../services/CommBroker";
import {Consts} from "../../Conts";
import * as _ from 'lodash';
import {Timeline} from "./Timeline";
/**
 CampaignView module manages campaign related logic and UI
 @class CampaignView
 @constructor
 @return {Object} instantiated CampaignView
 **/
@Component({
    selector: 'campaign-editor',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './campaign-editors.html'
})
export class CampaignEditor extends Compbaser {

    private campaignModel: CampaignsModelExt;

    private m_timelines:any = {};
    private m_selected_timeline_id = -1;
    private m_selected_campaign_id = -1;
    private m_sequencerView;
    private m_xdate;

    /**
     Init the instance and listen to VIEW_CHANGED event so we know when it's time to act.
     If no campaign was selected, we launch the campaign wizard creator, otherwise we populate the campaign / timelines.
     We also use this method to wire the rest of the campaigns Consts.Elems().
     @method initialize
     @return none
     **/

    constructor(private yp: YellowPepperService, private pepper: RedPepperService, private comBroker: CommBroker) {
        super();

        this.cancelOnDestroy(
            this.yp.listenCampaignSelected().subscribe((campaign: CampaignsModelExt) => {
                if (!campaign)
                    return;
                this.campaignModel = campaign;
                this._render();
            })
        );

        var self = this;
        self.m_timelines = {}; // hold references to all created timeline instances
        // self.m_timelineViewStack = new StackView.Fader({el: Consts.Elems().SELECTED_TIMELINE, duration: 333});
        self.m_selected_timeline_id = -1;
        self.m_selected_campaign_id = -1;

        // self.m_property = this.comBroker.getService(BB.SERVICES['PROPERTIES_VIEW']);

        // self.m_blockFactory = this.comBroker.getService(BB.SERVICES['BLOCK_FACTORY']);
        // if (!self.m_blockFactory)
        //     self.m_blockFactory = new BlockFactory();

        // self.m_sequencerView = new SequencerView({
        //     el: Consts.Elems().SCREEN_LAYOUTS_UL
        // });
        //
        // self.m_storylineView = new StorylineView({
        //     el: Consts.Elems().STORYLINE_ELEM
        // });

        // this.comBroker.setService(BB.SERVICES['SEQUENCER_VIEW'], self.m_sequencerView);

        // self.m_channelListView = new ChannelListView({
        //     el: Consts.Elems().CHANNEL_LIST_ELEM_VIEW
        // });
        // this.comBroker.setService(BB.SERVICES.CHANNEL_LIST_VIEW, self.m_channelListView);
        //
        // self.m_property.initPanel(Consts.Elems().CHANNEL_PROPERTIES);
        // self.m_property.initPanel(Consts.Elems().TIMELINE_PROPERTIES);

        self._listenDelTimeline();
        self._listenTimelineViewSelected();
        self._listenBackToCampaigns();
        self._listenAddNewTimeline();
        self._listenCampaignPreview();
        self._listenSelectNextChannel();
        self._listenCampaignTimelinePreview();
        self._listenToggleTimelinesCollapsible();
        self._listenScreenTemplateEdit();
        self._listenTimelineLengthChanged();
        self._listenCampaignExpandedView();

    }


    /**
     Custom event fired when a timeline or channel or block within the timeline has changed
     it ignores the event.
     @event CAMPAIGN_TIMELINE_CHANGED
     @param {This} caller
     @param {Self} context caller
     @param {Event} timelineID of the timeline selected
     @static
     @final
     **/
    // BB.EVENTS.CAMPAIGN_TIMELINE_CHANGED = 'CAMPAIGN_TIMELINE_CHANGED';

    /**
     Custom event fired when a requesing an expanded view of the timelines and storyboard
     @event CAMPAIGN_EXPANDED_VIEW
     @param {This} caller
     @param {Self} context caller
     @static
     @final
     **/
    // BB.EVENTS.CAMPAIGN_EXPANDED_VIEW = 'CAMPAIGN_EXPANDED_VIEW';

    /**
     Custom event fired before changing to a new campaign
     @event CAMPAIGN_SELECTED
     @param {This} caller
     @param {Self} context caller
     @param {Event}
     @static
     @final
     **/
    // BB.EVENTS.CAMPAIGN_RESET = 'CAMPAIGN_RESET';

    // BB.SERVICES.CAMPAIGN_VIEW = 'CampaignView';



    /**
     If loading an existing campaign (i.e.: we are not creating a brand new one) we load
     all campaign data from msdb and populate UI
     @method _render
     **/
    _render() {
        this._loadTimelinesFromDB();
        //todo: fix
        // this._loadSequencerFirstTimeline();
        // this._updatedTimelinesLengthUI();
    }

    /**
     Load all of the campaign's timelines from msdb and populate the sequencer.
     @method _loadTimelinesFromDB
     @return none
     **/
    _loadTimelinesFromDB() {
        var self = this;
        var sequenceOrder: any = [];

        var timelineIDs = this.pepper.getCampaignTimelines(this.campaignModel.getCampaignId());
        for (var i = 0; i < timelineIDs.length; i++) {
            var campaign_timeline_id: any = timelineIDs[i];
            var sequenceIndex: any = this.pepper.getCampaignTimelineSequencerIndex(campaign_timeline_id);
            sequenceOrder[parseInt(sequenceIndex)] = parseInt(campaign_timeline_id);
        }

        jQueryAny(sequenceOrder).each((sequenceIndex, campaign_timeline_id) => {
            // this.m_timelines[campaign_timeline_id] = new Timeline().setcampaignTimelineID(campaign_timeline_id);
        });
    }

    /**
     Select the first timeline in the sequencer UI and if fails, select main Campaign > timeline.
     @method _loadSequencerFirstTimeline
     @return none
     **/
    _loadSequencerFirstTimeline() {
        var self = this;
        self.m_sequencerView.selectFirstTimeline();
        //var firstTimelineID = this.pepper.getCampaignTimelineIdOfSequencerIndex(self.m_selected_campaign_id, 0);
        //if (self.m_sequencerView.selectTimeline(firstTimelineID) == -1)
        //    self.m_timelineViewStack.selectView(self.m_noneSelectedTimelines);
    }

    /**
     This is a key method that we use to listen to fire event of ScreenLayoutSelectorView.ON_VIEWER_SELECTED.
     Upon the event we examine e.context.m_owner to find out who was the owner if the fired event (i.e.: instanceof)
     so we can select tha appropriate campaign or timeline in the UI. See further notes in code.
     @method _listenTimelineViewSelected
     @return none
     **/
    _listenTimelineViewSelected() {
        var self = this;

        this.comBroker.listen('ON_VIEWER_SELECTED', function (e) {
            var autoSelectFirstTimeline = true;
            var campaign_timeline_board_viewer_id = e.caller.campaign_timeline_board_viewer_id;
            var campaign_timeline_id = e.caller.campaign_timeline_id;
            self.m_selected_timeline_id = campaign_timeline_id;

            ////////////////////////////////////////////////
            //// Timeline selected from Sequencer class
            ////////////////////////////////////////////////

            // if (e.context.m_owner instanceof SequencerView) {
            if (e.context.m_owner == 'SequencerView') {
                //self.m_timelineViewStack.selectView(self.m_timelines[campaign_timeline_id].getStackViewID());
                this.comBroker.fire('CAMPAIGN_TIMELINE_SELECTED', this, null, campaign_timeline_id);
                self._updatedTimelinesLengthUI();
                return;
            }

            ////////////////////////////////////////////////
            //// Timeline selected from Timeline class
            ////////////////////////////////////////////////

            // if (e.context.m_owner instanceof Timeline) {
            if (e.context.m_owner == 'Timeline') {
                var recCampaignTimelineViewerChanels = this.pepper.getChannelIdFromCampaignTimelineBoardViewer(campaign_timeline_board_viewer_id, campaign_timeline_id);
                var campaign_timeline_channel_id = recCampaignTimelineViewerChanels['campaign_timeline_chanel_id']
                this.comBroker.fire('CAMPAIGN_TIMELINE_CHANNEL_SELECTED', this, null, campaign_timeline_channel_id);
                return;
            }

            ////////////////////////////////////////////////
            //// Timeline selected from TemplateWizard
            ////////////////////////////////////////////////

            var board_id = undefined;
            var campaign_board_id = undefined;

            // if (e.context.m_owner instanceof ScreenLayoutSelectorView) {
            if (e.context.m_owner == 'ScreenLayoutSelectorView') {
                if (self.m_selected_campaign_id == -1) {

                    ////////////////////////////////////////////////
                    // Created a brand new campaign and a new board
                    ////////////////////////////////////////////////

                    var width = this.comBroker.getService('RESOLUTION_SELECTOR_VIEW').getResolution().split('x')[0];
                    var height = this.comBroker.getService('RESOLUTION_SELECTOR_VIEW').getResolution().split('x')[1];
                    board_id = this.pepper.createBoard('board', width, height);

                    var newTemplateData = this.pepper.createNewTemplate(board_id, e.caller.screenTemplateData.screenProps);
                    var board_template_id = newTemplateData['board_template_id']
                    var viewers = newTemplateData['viewers'];

                    self.m_selected_campaign_id = this.pepper.createCampaign('campaign');
                    campaign_board_id = this.pepper.assignCampaignToBoard(self.m_selected_campaign_id, board_id);

                    // set campaign name
                    var campaignName = this.comBroker.getService('CAMPAIGN_NAME_SELECTOR_VIEW').getCampaignName();
                    this.pepper.setCampaignRecord(self.m_selected_campaign_id, 'campaign_name', campaignName);

                    this.comBroker.fire('LOAD_CAMPAIGN_LIST');

                } else {

                    ////////////////////////////////////////////////
                    // Add Timeline to an existing campaign
                    ////////////////////////////////////////////////

                    campaign_board_id = this.pepper.getFirstBoardIDofCampaign(self.m_selected_campaign_id);
                    board_id = this.pepper.getBoardFromCampaignBoard(campaign_board_id);
                    var newTemplateData = this.pepper.createNewTemplate(board_id, e.caller.screenTemplateData.screenProps);
                    var board_template_id = newTemplateData['board_template_id']
                    var viewers = newTemplateData['viewers'];
                    autoSelectFirstTimeline = false;
                }

                campaign_timeline_id = this.pepper.createNewTimeline(self.m_selected_campaign_id);
                this.pepper.setCampaignTimelineSequencerIndex(self.m_selected_campaign_id, campaign_timeline_id, 0);
                this.pepper.setTimelineTotalDuration(campaign_timeline_id, '0');
                this.pepper.createCampaignTimelineScheduler(self.m_selected_campaign_id, campaign_timeline_id);

                var campaign_timeline_board_template_id = this.pepper.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
                var channels = this.pepper.createTimelineChannels(campaign_timeline_id, viewers);
                this.pepper.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);

                //todo: fix add Timeline
                // self.m_timelines[campaign_timeline_id] = new Timeline({campaignTimelineID: campaign_timeline_id});
                this.comBroker.fire('CAMPAIGN_TIMELINE_SELECTED', this, null, campaign_timeline_id);
                this.comBroker.getService('SEQUENCER_VIEW').reSequenceTimelines();

                if (autoSelectFirstTimeline) {
                    self._loadSequencerFirstTimeline();
                } else {
                    self.m_sequencerView.selectTimeline(campaign_timeline_id);
                }
                return;
            }
        });
    }

    /**
     Go back to campaign selection screen
     @method _listenBackToCampaigns
     **/
    _listenBackToCampaigns() {
        var self = this;
        jQuery(Consts.Elems().BACK_TO_CAMPAIGNS).on('click', function () {
            this.comBroker.getService('CAMPAIGN_SELECTOR').setSelectedCampaign(-1);
            this.comBroker.getService('PROPERTIES_VIEW').resetPropertiesView();
            // self.options.stackView.slideToPage(Consts.Elems().CAMPAIGN_SELECTOR, 'left');
        });
    }

    /**
     Wire the UI for adding a new timeline
     @method _listenAddNewTimeline
     **/
    _listenAddNewTimeline() {
        var self = this;
        jQuery(Consts.Elems().ADD_NEW_TIMELINE_BUTTON).on('click', function () {
            this.comBroker.getService('SCREEN_LAYOUT_SELECTOR_VIEW').slideBackDirection('right');
            // self.options.stackView.slideToPage(Consts.Elems().SCREEN_LAYOUT_SELECTOR, 'left');
        });
    }

    /**
     Wire the UI for launching campaign preview
     @method _listenCampaignPreview
     **/
    _listenCampaignPreview() {
        var self = this;
        jQuery(Consts.Elems().CAMPAIGN_PREVIEW).on('click', function () {
            var livePreview = this.comBroker.getService('LIVEPREVIEW');
            livePreview.launchCampaign(self.m_selected_campaign_id);
        });
    }

    /**
     Listen to select next channel clicj
     @method _listenSelectNextChannel
     **/
    _listenSelectNextChannel() {
        var self = this;
        jQuery(Consts.Elems().SELECT_NEXT_CHANNEL).on('click', function () {
            this.comBroker.getService('STORYLINE').selectNextChannel();
        });
    }

    /**
     Wire the UI for launching specific timeline preview
     @method _listenCampaignTimelinePreview
     **/
    _listenCampaignTimelinePreview() {
        var self = this;
        jQuery(Consts.Elems().TIMELIME_PREVIEW).on('click', function () {
            var livePreview = this.comBroker.getService('LIVEPREVIEW');
            livePreview.launchTimeline(self.m_selected_campaign_id, self.m_selected_timeline_id);
        });
    }

    /**
     Wire the UI for timeline deletion.
     @method _listenDelTimeline
     @return none
     **/
    _listenDelTimeline() {
        var self = this;
        jQuery(Consts.Elems().REMOVE_TIMELINE_BUTTON).on('click', function (e) {
            var totalTimelines = this.pepper.getCampaignTimelines(self.m_selected_campaign_id).length;
            if (totalTimelines == 1) {
                bootbox.dialog({
                    message: jQuery(Consts.Elems().MSG_CANT_DELETE_TIMELINE).text(),
                    buttons: {
                        danger: {
                            label: jQuery(Consts.Elems().MSG_BOOTBOX_OK).text(),
                            className: "btn-danger"
                        }
                    }
                });
            } else {
                bootbox.confirm(jQuery(Consts.Elems().MSG_BOOTBOX_SURE_REMOVE_TIMELINE).text(), function (i_result) {
                    // if (i_result == true) {
                    //     $.proxy(self._deleteTimeline(), self);
                    // }
                });
            }
        });
    }

    /**
     Toggle the arrow of the collapsible timelines / sequencer UI widget
     @method _listenToggleTimelinesCollapsible
     **/
    _listenToggleTimelinesCollapsible() {
        jQuery(Consts.Elems().TOGGLE_TIMELINES_COLLAPSIBLE).on('click', function () {
            var toggle = jQuery(this).find('span')[0];
            if (jQuery(toggle).hasClass('glyphicon-chevron-down')) {
                jQuery(toggle).removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right')
            } else {
                jQuery(toggle).removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down')
            }
        });
    }

    /**
     Listen screen template edit button
     @method _listenScreenTemplateEdit
     **/
    _listenScreenTemplateEdit() {
        var self = this;
        jQuery(Consts.Elems().EDIT_SCREEN_LAYOUT).on('click', function (e) {
            var screenLayoutEditor = this.comBroker.getService('SCREEN_LAYOUT_EDITOR_VIEW');
            var boardTemplateIDs = this.pepper.getTemplatesOfTimeline(self.m_selected_timeline_id);
            screenLayoutEditor.selectView(self.m_selected_timeline_id, boardTemplateIDs[0]);
        });
    }

    /**
     When a timeline is deleted, remove it from the local timelines hash and notify sequencer.
     @method _deleteTimeline
     @param {Event} e
     @param {Object} i_caller
     @return none
     **/
    _deleteTimeline() {
        var self = this;
        self.m_timelines[self.m_selected_timeline_id].deleteTimeline();
        delete self.m_timelines[self.m_selected_timeline_id];
        self._loadSequencerFirstTimeline();
    }

    /**
     Listen for updates on changes in length of currently selected timeline through the pepper framework
     @method _listenTimelineLengthChanged
     **/
    _listenTimelineLengthChanged() {
        var self = this;
        //todo: fix
        // this.pepper.listen(Pepper.TIMELINE_LENGTH_CHANGED, $.proxy(self._updatedTimelinesLengthUI, self));
    }

    /**
     Listen to when we should expand the view of all collapsible bootstrap widgets in our campaign view moduke
     @method _listenCampaignExpandedView
     **/
    _listenCampaignExpandedView() {
        var self = this;
        // this.comBroker.listen(BB.EVENTS.CAMPAIGN_EXPANDED_VIEW, function (e) {
        //     if (!jQuery(Consts.Elems().SCREEN_SELECTOR_CONTAINER_COLLAPSE).hasClass('in'))
        //         jQuery(Consts.Elems().TOGGLE_TIMELINES_COLLAPSIBLE).trigger('click');
        //     if (!jQuery(Consts.Elems().STORYLINE_CONTAINER_COLLAPSE).hasClass('in'))
        //         jQuery(Consts.Elems().TOGGLE_STORYLINE_COLLAPSIBLE).trigger('click');
        //     jQuery(Consts.Elems().SELECT_NEXT_CHANNEL).trigger('click');
        // })
    }

    /**
     Update UI of total timelines length on length changed
     @method _updatedTimelinesLengthUI
     **/
    _updatedTimelinesLengthUI() {
        var self = this;
        var totalDuration = 0;
        self.m_xdate = this.comBroker.getService('XDATE');
        $.each(self.m_timelines, function (timelineID) {
            totalDuration = parseInt(this.pepper.getTimelineTotalDuration(timelineID)) + totalDuration;
        });
        var durationFormatted = self.m_xdate.clearTime().addSeconds(totalDuration).toString('HH:mm:ss');
        jQuery(Consts.Elems().TIMELINES_TOTAL_LENGTH).text(durationFormatted);
    }

    /**
     Reset the module and settings
     @method _restart
     **/
    _reset() {
        var self = this;
        self.m_timelines = {};
        self.m_selected_timeline_id = -1;
        self.m_selected_campaign_id = -1;
        // this.comBroker.fire('CAMPAIGN_RESET');
    }

    /**
     Get currently selected campaign, which we hold a reference to.
     @method getSelectedCampaign
     @return {Number} m_selected_campaign_id
     **/
    getSelectedCampaign() {
        var self = this;
        return self.m_selected_campaign_id;
    }

    /**
     Get currently selected timeline id for campaign
     @method getSelectedTimeline
     @return {Number} m_selected_timeline_id
     **/
    getSelectedTimeline() {
        var self = this;
        return self.m_selected_timeline_id;
    }

    /**
     Get selected timeline instance, which we hold a reference to, via it's timeline_id.
     @method getTimelineInstance
     @param {Number} i_campaign_timeline_id
     @return {Object} timeline instance
     **/
    getTimelineInstance(i_campaign_timeline_id) {
        var self = this;
        return self.m_timelines[i_campaign_timeline_id];
    }

    /**
     Get the timeline viewstack and provide to others.
     @method getTimelineViewStack
     @return {Object} timeline viewStack instance
     **/
    getTimelineViewStack() {
        var self = this;
        // return self.m_timelineViewStack;
    }

    /**
     recreate the UI for all timelines in the timelined sequence supplied
     @method populateTimelines
     @params {Array} order of timelines to create
     **/
    populateTimelines(i_ordered_timelines_ids) {
        var self = this;
        _.each(i_ordered_timelines_ids, function (timelineID) {
            self.m_timelines[timelineID].populateTimeline();
        });
    }

    /**
     Duplicate a campaign_timeline including it's screen layout, channels and blocks
     @method duplicateTimeline
     @param {Number} i_playerData
     @return {Number} Unique clientId.
     **/
    duplicateTimeline(i_campaign_timeline_id, i_screenProps) {
        return;
        // var self = this;
        // var campaign_board_id = this.pepper.getFirstBoardIDofCampaign(self.m_selected_campaign_id);
        // var board_id = this.pepper.getBoardFromCampaignBoard(campaign_board_id);
        // var newTemplateData = this.pepper.createNewTemplate(board_id, i_screenProps);
        // var board_template_id = newTemplateData['board_template_id']
        // var viewers = newTemplateData['viewers'];
        // var campaign_timeline_id = this.pepper.createNewTimeline(self.m_selected_campaign_id);
        // this.pepper.setCampaignTimelineSequencerIndex(self.m_selected_campaign_id, campaign_timeline_id, 0);
        // this.pepper.setTimelineTotalDuration(campaign_timeline_id, '0');
        //
        // var campaign_timeline_board_template_id = this.pepper.assignTemplateToTimeline(campaign_timeline_id, board_template_id, campaign_board_id);
        // var channels = this.pepper.createTimelineChannels(campaign_timeline_id, viewers);
        // this.pepper.assignViewersToTimelineChannels(campaign_timeline_board_template_id, viewers, channels);
        //
        // self.m_timelines[campaign_timeline_id] = new Timeline({campaignTimelineID: campaign_timeline_id});
        // this.comBroker.fire(BB.EVENTS.CAMPAIGN_TIMELINE_SELECTED, this, null, campaign_timeline_id);
        // this.comBroker.getService(BB.SERVICES['SEQUENCER_VIEW']).reSequenceTimelines();
        // self.m_sequencerView.selectTimeline(campaign_timeline_id);
    }


    ngOnInit() {
    }

    destroy() {
    }
}