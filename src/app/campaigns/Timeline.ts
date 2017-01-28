import {ElementRef} from "@angular/core";
import {CommBroker} from "../../services/CommBroker";
import * as _ from "lodash";
import {Consts} from "../../Conts";
import {Lib} from "../../Lib";
import {RedPepperService} from "../../services/redpepper.service";

export class Timeline {

    m_ONCE = '0';
    m_DAILY = '1';
    m_WEEKLY = '2';
    m_PRIORITY_LOW = 2;
    m_PRIORITY_MEDIUM = 1;
    m_PRIORITY_HIGH = 0;
    m_WEEKDAYS = [1, 2, 4, 8, 16, 32, 64];
    m_channels = {}; // hold references to all created channel instances
    m_screenTemplate = undefined;
    m_campaign_timeline_id;// = options.campaignTimelineID;
    m_timing = 'sequencer';
    m_stackViewID = undefined;
    m_property = this.comBroker.getService('PROPERTIES_VIEW');
    m_sequences = this.comBroker.getService('SEQUENCER_VIEW');
    m_selected = false;
    m_campaignTimelineSelectedHandler;
    m_inputChangeHandler
    m_listenDatePickerHandler
    m_schedWeekdayHandler
    m_schedChangeDurationHandler
    m_schedChangeRepeatHandler
    m_schedChangeStartTimeHandler
    m_schedChangePriorityHandler
    listenWithNamespace

    constructor(private el: ElementRef, private comBroker: CommBroker, private pepper: RedPepperService) {
        var self = this;

        self._populateChannels();
        self.populateTimeline();
        self._listenInputChange();
        self._listenReset();
        self._listenViewerRemoved();
        self._onTimelineSelected();
        // this.pepper.listenWithNamespace('TEMPLATE_VIEWER_EDITED', self, $.proxy(self._templateViewerEdited, self));
        // this.pepper.listenWithNamespace('NEW_CHANNEL_ADDED', self, $.proxy(self._channelAdded, self));

        var campaignPlayMode = this.pepper.getCampaignPlayModeFromTimeline(self.m_campaign_timeline_id);
        if (campaignPlayMode == 'SCHEDULER_MODE') {
            self._listenSchedDurationChange();
            self._listenSchedPriorityChange();
            self._listenSchedStartTimeChange();
            self._listenSchedRepeatChange();
            self._listenDatePicker();
            self._listenWeekdayChange();
        }
    }

    setcampaignTimelineID(campaignTimelineID){
        this.m_campaign_timeline_id = campaignTimelineID;
    }

    /**
     Listen to reset of when switching to different campaign so we forget current state
     @method _listenReset
     **/
    _listenReset() {
        var self = this;
        // this.comBroker.listenWithNamespace(BB.EVENTS.CAMPAIGN_RESET, self, function () {
        //     self._reset();
        // });
    }


    /**
     Listen to timeline selection events and populate the properties panel accordingly.
     @method _onTimelineSelected
     @return none
     **/
    _onTimelineSelected() {
        var self = this;
        self.m_campaignTimelineSelectedHandler = function (e) {
            var timelineID = e.edata;
            if (self.m_campaign_timeline_id != timelineID) {
                self.m_selected = false;
                return;
            }
            self.m_selected = true;
            self._propLoadTimeline();
            // log('timeline selected ' + self.m_campaign_timeline_id);
        };
        // this.comBroker.listenWithNamespace(BB.EVENTS.CAMPAIGN_TIMELINE_SELECTED, self, self.m_campaignTimelineSelectedHandler);
    }

    /**
     Update msdb when the timeline title has changed.
     @method _listenInputChange
     @return none
     **/
    _listenInputChange() {
        var self = this;
        self.m_inputChangeHandler = _.debounce(function (e) {
            if (!self.m_selected)
                return;
            var text = jQuery(Consts.Elems().TIME_LINE_PROP_TITLE_ID).val();
            if (_.isEmpty(text))
                return;
            // todo: fix
            // text = BB.lib.cleanProbCharacters(text, 1);
            this.pepper.setCampaignTimelineRecord(self.m_campaign_timeline_id, 'timeline_name', text);
        }, 150, false);
        jQuery(Consts.Elems().TIME_LINE_PROP_TITLE_ID).on("input", self.m_inputChangeHandler);
    }


    /**
     Listen to changes in timeline duration changes with respect to the scheduler
     @method _listenDatePicker
     @return none
     **/
    _listenDatePicker() {
        var self = this;
        self.m_listenDatePickerHandler = function (e) {
            if (!self.m_selected)
                return;
            if (_.isUndefined(e.date))
                return;
            var field = jQuery(e.target).attr('name');
            // todo: fix
            // var xd = new XDate(e.date);
            // var date = xd.toString('MM/dd/yyyy');
            // this.pepper.setCampaignsSchedule(self.m_campaign_timeline_id, field, date);
        };
        jQueryAny(Consts.Elems().CLASS_TIME_PICKER_SCHEDULER).datepicker().on("hide", self.m_listenDatePickerHandler);

    }

    /**
     Listen weekdays change in scheduler
     @method _listenWeekdayChange
     @param {Number} i_playerData
     @return {Number} Unique clientId.
     **/
    _listenWeekdayChange() {
        var self = this;
        self.m_schedWeekdayHandler = function (e) {
            if (!self.m_selected)
                return;
            var weekBits = 0;
            // bitwize operator
            jQuery(Consts.Elems().SCHEDUALED_DAYS).find('input').each(function (i, el) {
                if (jQuery(el).prop('checked'))
                    weekBits = weekBits + self.m_WEEKDAYS[i];
            });
            this.pepper.setCampaignsSchedule(self.m_campaign_timeline_id, 'week_days', weekBits);
        };
        jQuery(Consts.Elems().CLASS_SCEDULE_DAY).on("change", self.m_schedWeekdayHandler);
    }

    /**
     Listen to changes in timeline duration changes with respect to the scheduler
     @method _listenSchedDurationChange
     @return none
     **/
    _listenSchedDurationChange() {
        var self = this;
        self.m_schedChangeDurationHandler = function (e) {
            if (!self.m_selected)
                return;
            var totalSeconds = this.pepper.formatObjectToSeconds({
                hours: e.time.hours,
                minutes: e.time.minutes,
                seconds: e.time.seconds
            });
            this.pepper.setCampaignsSchedule(self.m_campaign_timeline_id, 'duration', totalSeconds);
        };
        jQuery(Consts.Elems().TIME_PICKER_DURATION_INPUT).on("hide.timepicker", self.m_schedChangeDurationHandler);
    }

    /**
     Listen to when sched repeat on the carousel changed
     @method _listenSchedRepeatChange
     **/
    _listenSchedRepeatChange() {
        var self = this;
        self.m_schedChangeRepeatHandler = _.debounce(function (e) {
            if (!self.m_selected)
                return;
            var carouselIndex = jQuery(Consts.Elems().SCHEDULER_REPEAT_MODE + ' .active').index(Consts.Elems().SCHEDULER_REPEAT_MODE + ' .item');
            this.pepper.setCampaignsSchedule(self.m_campaign_timeline_id, 'repeat_type', carouselIndex);
        }, 500, false);
        jQuery(Consts.Elems().SCHEDULER_REPEAT_MODE).on('slid.bs.carousel', self.m_schedChangeRepeatHandler);
    }

    /**
     Listen to changes in scheduler start time playback values
     @method _listenSchedStartTimeChange
     **/
    _listenSchedStartTimeChange() {
        var self = this;
        self.m_schedChangeStartTimeHandler = function (e) {
            if (!self.m_selected)
                return;
            var totalSeconds = this.pepper.formatObjectToSeconds({
                hours: e.time.hours,
                minutes: e.time.minutes,
                seconds: e.time.seconds
            });
            this.pepper.setCampaignsSchedule(self.m_campaign_timeline_id, 'start_time', totalSeconds);
        };
        jQuery(Consts.Elems().TIME_PICKER_TIME_INPUT).on('hide.timepicker', self.m_schedChangeStartTimeHandler);
    }

    /**
     Listen to changes in scheduler priority values
     @method _listenSchedPriorityChange
     **/
    _listenSchedPriorityChange() {
        var self = this;
        self.m_schedChangePriorityHandler = function (e) {
            if (!self.m_selected)
                return;
            var priority = jQuery(e.target).attr('name');
            this.pepper.setCampaignsSchedule(self.m_campaign_timeline_id, 'priorty', priority);
            if (Number(priority) == self.m_PRIORITY_LOW) {
                jQuery(Consts.Elems().SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 0.5).end().eq(2).fadeTo('fast', 0.5);
            } else if (Number(priority) == self.m_PRIORITY_MEDIUM) {
                jQuery(Consts.Elems().SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 0.5);
            } else {
                jQuery(Consts.Elems().SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 1);
            }
        };
        jQuery(Consts.Elems().CLASS_SCHEDULE_PRIORITIES).on('click', self.m_schedChangePriorityHandler);
    }

    /**
     When a campaign_timeline_board_template is edited, modify its related UI (inside sequencer)
     @method campaign_timeline_board_template_id
     @param {event} e template viewer ids
     **/
    _templateViewerEdited(e) {
        var self = this;
        if (!self.m_selected)
            return;
        var campaign_timeline_board_template_id = e.edata;
        self._populateBoardTemplate(campaign_timeline_board_template_id);
    }

    /**
     New channel was added to an existing timeline (most likely through the addition of a viewer (screen division) template editor)
     @method _channelAdded
     @param {event} e
     **/
    _channelAdded(e) {
        var self = this;
        if (!self.m_selected)
            return;
        // todo: fix channel
        // self.m_channels[e.edata.chanel] = new Channel({campaignTimelineChanelID: e.edata.chanel});
    }

    /**
     Populate the timeline property
     @method _listenInputChange
     **/
    _propLoadTimeline() {
        var self = this;
        self.m_property.viewPanel(Consts.Elems().TIMELINE_PROPERTIES);
        var recTimeline = this.pepper.getCampaignTimelineRecord(self.m_campaign_timeline_id);
        jQuery(Consts.Elems().TIME_LINE_PROP_TITLE_ID).val(recTimeline['timeline_name']);
        self._populateTimelineLength();
        self._populateTimelinePlayMode();
    }

    /**
     Populate the Scheduler UI
     @method _populateScheduler
     @params {Number} i_timeline_id
     **/
    _populateScheduler() {
        var self = this;
        if (jQueryAny(Consts.Elems().TIME_PICKER_DURATION_INPUT).timepicker == undefined)
            return;
        var recSchedule: any = this.pepper.getCampaignsSchedule(self.m_campaign_timeline_id);
        jQueryAny(Consts.Elems().SCHEDULER_REPEAT_MODE).carousel(Number(recSchedule.repeat_type));
        var duration = this.pepper.formatSecondsToObject(recSchedule.duration);
        var startTime = this.pepper.formatSecondsToObject(recSchedule.start_time);
        jQueryAny(Consts.Elems().TIME_PICKER_DURATION_INPUT).timepicker('setTime', duration.hours + ':' + duration.minutes + ':' + duration.seconds);
        jQueryAny(Consts.Elems().TIME_PICKER_TIME_INPUT).timepicker('setTime', startTime.hours + ':' + startTime.minutes + ':' + startTime.seconds);

        if (recSchedule.priorty == self.m_PRIORITY_LOW) {
            jQuery(Consts.Elems().SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 0.5).end().eq(2).fadeTo('fast', 0.5);
        } else if (recSchedule.priorty == self.m_PRIORITY_MEDIUM) {
            jQuery(Consts.Elems().SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 0.5);
        } else {
            jQuery(Consts.Elems().SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 1);
        }

        jQuery(Consts.Elems().SCHEDULE_PRIORITY)
        switch (String(recSchedule.repeat_type)) {
            case self.m_ONCE: {
                var date = recSchedule.start_date.split(' ')[0];
                jQueryAny(Consts.Elems().DATE_PICKER_SCHEDULER_ONCE).datepicker('setDate', date);
                break;
            }
            case self.m_DAILY: {
                var startDate = recSchedule.start_date.split(' ')[0];
                var endDate = recSchedule.end_date.split(' ')[0];
                jQueryAny(Consts.Elems().DATE_PICKER_SCHEDULER_DAILY_START).datepicker('setDate', startDate);
                jQueryAny(Consts.Elems().DATE_PICKER_SCHEDULER_DAILY_END).datepicker('setDate', endDate);
                break;
            }
            case self.m_WEEKLY: {
                var startDate = recSchedule.start_date.split(' ')[0];
                var endDate = recSchedule.end_date.split(' ')[0];
                var weekDays = recSchedule.week_days;
                var elDays = jQuery(Consts.Elems().SCHEDUALED_DAYS);
                // use bitwise (bitwize) operator << >> to compute days selected
                self.m_WEEKDAYS.forEach(function (v, i) {
                    var n = weekDays & v;
                    if (n == v) {
                        jQuery(elDays).find('input').eq(i).prop('checked', true);
                    } else {
                        jQuery(elDays).find('input').eq(i).prop('checked', false);
                    }
                });
                jQueryAny(Consts.Elems().DATE_PICKER_SCHEDULER_WEEK_START).datepicker('setDate', startDate);
                jQueryAny(Consts.Elems().DATE_PICKER_SCHEDULER_WEEK_END).datepicker('setDate', endDate);
                break;
            }
        }
    }

    /**
     Populate the timeline depending if running with sequencer or scheduler
     @method _populateTimelinePlayMode
     **/
    _populateTimelinePlayMode() {
        var self = this;
        var campaignMode = this.pepper.getCampaignPlayModeFromTimeline(self.m_campaign_timeline_id);
        switch (campaignMode) {
            case 'CONSTS.SEQUENCER_MODE': {
                jQuery(Consts.Elems().TIMELINE_WRAP).show();
                jQuery(Consts.Elems().TIMELINE_PLAYMODE_LABEL).find('aside').eq(0).show().end().eq(1).hide();
                jQuery(Consts.Elems().CLASS_SCHEDULER_CLASS).hide();
                jQuery(Consts.Elems().CLASS_SEQUENCE_CLASS).show();
                break;
            }
            case 'BB.CONSTS.SCHEDULER_MODE': {
                jQuery(Consts.Elems().TIMELINE_WRAP).hide();
                jQuery(Consts.Elems().TIMELINE_PLAYMODE_LABEL).find('aside').eq(1).show().end().eq(0).hide();
                jQuery(Consts.Elems().CLASS_SCHEDULER_CLASS).show();
                jQuery(Consts.Elems().CLASS_SEQUENCE_CLASS).hide();
                self._populateScheduler();
                break;
            }
        }
    }

    /**
     Populate the timeline length in its properties box
     @method _populateTimelineLength
     **/
    _populateTimelineLength() {
        var self = this;
        // todo: fix
        // self.m_xdate = this.comBroker.getService('XDATE');
        // var totalDuration = parseInt(this.pepper.getTimelineTotalDuration(self.m_campaign_timeline_id));
        // totalDuration = self.m_xdate.clearTime().addSeconds(totalDuration).toString('HH:mm:ss');
        // jQuery(Consts.Elems().TIMELINE_LENGTH).text(totalDuration);
    }

    /**
     Create a channel instance for every channel this timeline hosts
     @method _populateChannels
     @return none
     **/
    _populateChannels() {
        var self = this;
        var channelIDs = this.pepper.getChannelsOfTimeline(self.m_campaign_timeline_id);
        for (var i = 0; i < channelIDs.length; i++) {
            // todo: fix
            // self.m_channels[channelIDs[i]] = new Channel({campaignTimelineChanelID: channelIDs[i]});
        }
    }

    /**
     Load up the board template (screen divisions) for this timeline instance.
     In case sequencer is used, we push it to the sequencer, thus creating the thumbnail template
     inside the sequencer so this timeline can be selected.
     Scheduler future support.
     @method _populateBoardTemplate
     @param {Number} i_campaign_timeline_board_template_id
     @return none
     **/
    _populateBoardTemplate(i_campaign_timeline_board_template_id) {
        var self = this;
        var recBoard = this.pepper.getGlobalBoardRecFromTemplate(i_campaign_timeline_board_template_id);
        var width = parseInt(recBoard['board_pixel_width']);
        var height = parseInt(recBoard['board_pixel_height']);

        this.comBroker.getService('RESOLUTION_SELECTOR_VIEW').setResolution(width + 'x' + height);
        if (width > height) {
            this.comBroker.getService('ORIENTATION_SELECTOR_VIEW').setOrientation('HORIZONTAL');
        } else {
            this.comBroker.getService('ORIENTATION_SELECTOR_VIEW').setOrientation('VERTICAL');
        }
        var screenProps = this.pepper.getTemplateViewersScreenProps(self.m_campaign_timeline_id, i_campaign_timeline_board_template_id)
        self.m_sequences.createTimelineThumbnailUI(screenProps);
    }

    /**
     Listen when a screen division / viewer inside a screen layout was deleted and if the channel
     is equal to my channel, dispose of self
     @method _listenViewerRemoved
     **/
    _listenViewerRemoved() {
        var self = this;
        //todo: fix
        // this.comBroker.listenWithNamespace('VIEWER_REMOVED', self, function (e) {
        //     for (var channel in self.m_channels) {
        //         if (e.edata.campaign_timeline_chanel_id == channel) {
        //             self.m_channels[channel].deleteChannel();
        //             delete self.m_channels[channel];
        //             break;
        //         }
        //     }
        // });
    }

    /**
     Create the actual UI for this timeline instance. We use the ScreenTemplateFactory for SVG creation
     and insert the snippet onto timelineViewStack so the timeline UI can be presented when selected.
     @method _createTimelineUI
     @param {Object} i_screenProps template properties object
     @return none
     _createTimelineUI(i_screenProps) {
            var self = this;

            var screenTemplateData = {
                orientation: this.comBroker.getService(BB.SERVICES.ORIENTATION_SELECTOR_VIEW).getOrientation(),
                resolution: this.comBroker.getService(BB.SERVICES.RESOLUTION_SELECTOR_VIEW).getResolution(),
                screenProps: i_screenProps,
                scale: '7'
            };

            var screenTemplate = new ScreenTemplateFactory({
                i_screenTemplateData: screenTemplateData,
                i_type: ScreenTemplateFactory.VIEWER_SELECTABLE,
                i_owner: this});

            var snippet = screenTemplate.create();
            // var elemID = jQuery(snippet).attr('id');
            var divID1 = 'selectableScreenCollections' + _.uniqueId();
            var divID2 = 'selectableScreenCollections' + _.uniqueId();

            var snippetWrapper = '<div id="' + divID1 + '" style="display: none">' +
                '<div align="center" >' +
                '<div id="' + divID2 + '" align="center">' +
                '</div>' +
                '</div>' +
                '</div>';

            jQuery(Consts.Elems().SELECTED_TIMELINE).append(snippetWrapper);

            var timelineViewStack = this.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).getTimelineViewStack();
            jQuery('#' + divID2).append(jQuery(snippet));
            screenTemplate.selectablelDivision();
            var view = new BB.View({el: '#' + divID1});

            // if we are updating layout from ScreenLayoutEditorView (but actually creating a new Template layout)
            // we remove the previous Template Layout from DOM as well as its matching ScreenTemplateFactory instance
            if (self.m_stackViewID) {
                jQuery('#' + self.m_stackViewID).remove();
                self.m_screenTemplate.destroy();
            }
            ;

            self.m_screenTemplate = screenTemplate;
            self.m_stackViewID = timelineViewStack.addView(view);
            screenTemplate.activate();
        },
     **/

    /**
     Return the view stack index this timeline occupies in the timelineViewStack manager.
     @method getStackViewID
     @return {Number} m_stackViewID
     getStackViewID() {
            var self = this;
            return self.m_stackViewID;
        },
     **/

    /**
     Reset current state
     @method _reset
     **/
    _reset() {
        var self = this;
        // this.pepper.stopListenWithNamespace(this.pepper.TEMPLATE_VIEWER_EDITED, self);
        // this.pepper.stopListenWithNamespace(this.pepper.NEW_CHANNEL_ADDED, self);
        // this.comBroker.stopListenWithNamespace(BB.EVENTS.CAMPAIGN_RESET, self);
        // this.comBroker.stopListenWithNamespace(BB.EVENTS.CAMPAIGN_TIMELINE_SELECTED, self);
        jQuery(Consts.Elems().TIME_LINE_PROP_TITLE_ID).off("input", self.m_inputChangeHandler);
        jQuery(Consts.Elems().TIME_PICKER_DURATION_INPUT).off("hide.timepicker", self.m_schedChangeDurationHandler);
        jQuery(Consts.Elems().TIME_PICKER_TIME_INPUT).off('hide.timepicker', self.m_schedChangeStartTimeHandler);
        jQuery(Consts.Elems().CLASS_SCHEDULE_PRIORITIES).off('click', self.m_schedChangePriorityHandler);
        jQuery(Consts.Elems().CLASS_SCEDULE_DAY).off("change", self.m_schedWeekdayHandler);
        jQuery(Consts.Elems().SCHEDULER_REPEAT_MODE).off('slid.bs.carousel', self.m_schedChangeRepeatHandler);
        jQueryAny(Consts.Elems().CLASS_TIME_PICKER_SCHEDULER).datepicker().off("hide", self.m_listenDatePickerHandler);

        $.each(self, function (k) {
            self[k] = undefined;
        });
    }

    /**
     Create the timeline and load up its template (screen divisions) UI
     @method populateTimeline
     @return none
     **/
    populateTimeline() {
        var self = this;
        var boardTemplateIDs = this.pepper.getTemplatesOfTimeline(self.m_campaign_timeline_id);
        for (var i = 0; i < boardTemplateIDs.length; i++) {
            self._populateBoardTemplate(boardTemplateIDs[i]);
        }
    }

    /**
     The timeline hold references to all of the channels it creates that exist within it.
     The getChannelInstance returns a specific channel instance for a channel_id.
     @method getChannelInstance
     @param {Number} i_campaign_timeline_chanel_id
     @return {Object} Channel
     **/
    getChannelInstance(i_campaign_timeline_chanel_id) {
        var self = this;
        return self.m_channels[i_campaign_timeline_chanel_id];
    }

    /**
     Delete this timeline thus also need to delete all of its related channels
     @method deleteTimeline
     @return none
     **/
    deleteTimeline() {
        var self = this;
        var boardTemplateID = this.pepper.getGlobalTemplateIdOfTimeline(self.m_campaign_timeline_id);
        this.pepper.removeTimelineFromCampaign(self.m_campaign_timeline_id);
        this.pepper.removeSchedulerFromTime(self.m_campaign_timeline_id);
        var campaignTimelineBoardTemplateID = this.pepper.removeBoardTemplateFromTimeline(self.m_campaign_timeline_id);
        this.pepper.removeBoardTemplate(boardTemplateID);
        this.pepper.removeTimelineBoardViewerChannels(campaignTimelineBoardTemplateID);
        // this.comBroker.stopListenWithNamespace('EVENTS.VIEWER_REMOVED', self);
        this.pepper.removeBoardTemplateViewers(boardTemplateID);
        for (var channel in self.m_channels) {
            self.m_channels[channel].deleteChannel();
            delete self.m_channels[channel];
        }
        self._reset();
    }
}