import {AfterViewInit, ChangeDetectorRef, Component, ElementRef} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {CampaignTimelineSchedulesModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";


@Component({
    selector: 'campaign-sched-props',
    //changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'(input-blur)': 'saveToStore($event)'},
    templateUrl: './campaign-sched-props.html',
    styleUrls: ['./campaign-sched-props.css']
})
export class CampaignSchedProps extends Compbaser implements AfterViewInit {

    private m_campaignTimelinesModel: CampaignTimelinesModel;
    private m_campaignTimelineSchedulesModel: CampaignTimelineSchedulesModel;
    private m_days: Array<any> = [];
    private formInputs = {};
    private contGroup: FormGroup;
    private m_ONCE = '0';
    private m_DAILY = '1';
    private m_WEEKLY = '2';
    private m_PRIORITY_LOW = 2;
    private m_PRIORITY_MEDIUM = 1;
    private m_PRIORITY_HIGH = 0;
    private m_WEEKDAYS = [1, 2, 4, 8, 16, 32, 64];
    private m_WEEKDAYS_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // private campaignModel$: Observable<CampaignsModelExt>;

    constructor(private fb: FormBuilder, private el: ElementRef, private yp: YellowPepperService, private rp: RedPepperService, private cd: ChangeDetectorRef) {
        super();
        this.contGroup = this.fb.group({
            'once': [],
            'weekly_start': ['1/1/2020'],
            'weekly_end': ['1/1/2020'],
            'daily_start': ['1/1/2020'],
            'daily_end': ['1/1/2020'],
            'start_time': [],
            'duration': []
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })
    }

    ngAfterViewInit() {

        this.cancelOnDestroy(
            this.yp.listenTimelineSelected()
                .map((campaignTimelinesModel: CampaignTimelinesModel) => {
                    return this.yp.getCampaignsSchedule(campaignTimelinesModel.getCampaignTimelineId())
                        .map((campaignTimelineSchedulesModel: CampaignTimelineSchedulesModel) => {
                            return {campaignTimelinesModel, campaignTimelineSchedulesModel}
                        })
                }).flatMap(v => v)
                .subscribe(v => {
                    this.m_campaignTimelinesModel = v.campaignTimelinesModel;
                    this.m_campaignTimelineSchedulesModel = v.campaignTimelineSchedulesModel;
                    this._renderConflictPriority();
                    this._renderCarouselPosition();
                    this._initTimePicker();
                    this._initDays();
                    this._renderFormInputs();
                })
        )
    }

    private _renderCarouselPosition() {
        jQueryAny('#schedulerRepeatMode', this.el.nativeElement).carousel(Number(this.m_campaignTimelineSchedulesModel.getRepeatType()));
    }

    private _renderConflictPriority() {
        if (this.m_campaignTimelineSchedulesModel.getPriorty() == this.m_PRIORITY_LOW) {
            jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 0.5).end().eq(2).fadeTo('fast', 0.5);
        } else if (this.m_campaignTimelineSchedulesModel.getPriorty() == this.m_PRIORITY_MEDIUM) {
            jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 0.5);
        } else {
            jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 1);
        }
    }

    private _renderFormInputs() {
        _.forEach(this.formInputs, (value, key: string) => {
            switch (key) {
                case 'once': {
                    break;
                }
                case 'daily_start': {
                }
                case 'daily_end': {
                }
                case 'weekly_start': {
                }
                case 'weekly_end': {

                    var startDate = this.m_campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
                    var endDate = this.m_campaignTimelineSchedulesModel.getEndDate().split(' ')[0];
                    var xStart = new XDate(startDate).toString('yyyy-MM-dd');
                    var xEnd = new XDate(endDate).toString('yyyy-MM-dd');
                    this.formInputs['weekly_start'].setValue(xStart)
                    this.formInputs['weekly_end'].setValue(xEnd)
                    this.formInputs['daily_start'].setValue(xStart)
                    this.formInputs['daily_end'].setValue(xEnd)
                    this.formInputs['once'].setValue(xStart)
                    return;
                }
                case 'start_time': {
                    var startTime = this.rp.formatSecondsToObject(this.m_campaignTimelineSchedulesModel.getStartTime());
                    var startTimeFormatted = `${startTime.hours}:${startTime.minutes}:${startTime.seconds}`;
                    this.formInputs['start_time'].setValue(startTimeFormatted);
                    jQueryAny('#timepickerTimeInput', this.el.nativeElement).timepicker('setTime', startTimeFormatted);
                    return;
                }
                case 'duration': {
                    var duration = this.rp.formatSecondsToObject(this.m_campaignTimelineSchedulesModel.getDuration());
                    var durationFormatted = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
                    this.formInputs['duration'].setValue(durationFormatted);
                    jQueryAny('#timepickerDurationInput', this.el.nativeElement).timepicker('setTime', durationFormatted);
                    return;
                }
                default: {

                }
            }
            let data = this.m_campaignTimelineSchedulesModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    private _initDays() {
        this.m_days = [];
        var weekDays = this.m_campaignTimelineSchedulesModel.getWeekDays();
        this.m_WEEKDAYS.forEach((v, i) => {
            var n = weekDays & v;
            this.m_days.push({
                day: this.m_WEEKDAYS_NAME[i],
                checked: n == v ? true : false
            })
        });
        // this.cd.markForCheck();
        this.cd.detectChanges()
    }

    private _initTimePicker() {
        jQueryAny('#timepickerDurationInput', this.el.nativeElement).timepicker({
            showSeconds: true,
            showMeridian: false,
            defaultTime: false,
            minuteStep: 1,
            secondStep: 1
        });
        jQueryAny('#timepickerTimeInput', this.el.nativeElement).timepicker({
            showSeconds: true,
            showMeridian: false,
            defaultTime: false,
            minuteStep: 1,
            secondStep: 1
        });
    }

    @timeout()
    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.contGroup.value.campaign_name);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.contGroup.value.campaign_playlist_mode);
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        // this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.contGroup.value.kiosk_mode);
        // this.rp.reduxCommit()
    }


    destroy() {
    }
}


// var now = new Date();
// var day = ("0" + now.getDate()).slice(-2);
// var month = ("0" + (now.getMonth() + 1)).slice(-2);
// var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
// this.formInputs['weekly_start'].setValue(today)
// self.formInputs['weekly_start'].patchValue(today)
// this.renderScheduler();


// @Once()
// private renderScheduler() {
//     // if (jQueryAny('#timepickerDurationInput',this.el.nativeElement).timepicker == undefined)
//     //     return Observable.of('done');
//     var self = this;
//     return this.yp.getCampaignsSchedule(this.campaignTimelineModel.getCampaignTimelineId())
//         .subscribe((campaignTimelineSchedulesModel: CampaignTimelineSchedulesModel) => {
//             jQueryAny('#schedulerRepeatMode', this.el.nativeElement).carousel(Number(campaignTimelineSchedulesModel.getRepeatType()));
//
//             var duration = this.rp.formatSecondsToObject(campaignTimelineSchedulesModel.getDuration());
//             var startTime = this.rp.formatSecondsToObject(campaignTimelineSchedulesModel.getStartTime());
//
//             jQueryAny('#timepickerDurationInput', this.el.nativeElement).timepicker('setTime', duration.hours + ':' + duration.minutes + ':' + duration.seconds);
//             jQueryAny('#timepickerTimeInput', this.el.nativeElement).timepicker('setTime', startTime.hours + ':' + startTime.minutes + ':' + startTime.seconds);
//
//             if (campaignTimelineSchedulesModel.getPriorty() == this.m_PRIORITY_LOW) {
//                 jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 0.5).end().eq(2).fadeTo('fast', 0.5);
//             } else if (campaignTimelineSchedulesModel.getPriorty() == this.m_PRIORITY_MEDIUM) {
//                 jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 0.5);
//             } else {
//                 jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 1);
//             }
//
//             switch (String(campaignTimelineSchedulesModel.getRepeatType())) {
//                 case this.m_ONCE: {
//                     var date = campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
//                     // jQueryAny('#datepickerSchedulerOnce').datepicker('setDate', date);
//                     break;
//                 }
//                 case this.m_DAILY: {
//                     var startDate = campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
//                     var endDate = campaignTimelineSchedulesModel.getEndDate().split(' ')[0];
//                     // jQueryAny('#datepickerSchedulerDailyStart', this.el.nativeElement).datepicker('setDate', startDate);
//                     // jQueryAny('#datepickerSchedulerDailyEnd', this.el.nativeElement).datepicker('setDate', endDate);
//                     break;
//                 }
//                 case this.m_WEEKLY: {
//                     var startDate = campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
//                     var endDate = campaignTimelineSchedulesModel.getEndDate().split(' ')[0];
//                     var weekDays = campaignTimelineSchedulesModel.getWeekDays();
//                     var elDays = jQuery('#scheduledDays', this.el.nativeElement);
//                     // use bitwise (bitwize) operator << >> to compute days selected
//                     this.m_WEEKDAYS.forEach(function (v, i) {
//                         var n = weekDays & v;
//                         if (n == v) {
//                             $(elDays).find('input').eq(i).prop('checked', true);
//                         } else {
//                             $(elDays).find('input').eq(i).prop('checked', false);
//                         }
//                     });
//                     // self.someVal= startDate;
//                     // var now = new Date();
//                     //
//                     // var day = ("0" + now.getDate()).slice(-2);
//                     // var month = ("0" + (now.getMonth() + 1)).slice(-2);
//                     //
//                     // var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
//                     //
//                     // $('#datePicker').val(today);
//
//                     // self.formInputs['weekly_start'].setValue(today)
//                     // self.formInputs['weekly_start'].patchValue(today)
//                     // self.cd.markForCheck();
//                     // jQueryAny('#datepickerSchedulerWeekStart', this.el.nativeElement).datepicker('setDate', startDate);
//                     // jQueryAny('#datepickerSchedulerWeekEnd', this.el.nativeElement).datepicker('setDate', endDate);
//                     break;
//                 }
//             }
//         });
//
// }

//
// @ViewChild('datepickerSchedulerOnce')
// datepickerSchedulerOnce:HTMLInputElement;
//
// @ViewChild('datepickerSchedulerDailyStart')
// datepickerSchedulerDailyStart:HTMLInputElement;
//
// @ViewChild('datepickerSchedulerDailyEnd')
// datepickerSchedulerDailyEnd:HTMLInputElement;
//
// @ViewChild('datepickerSchedulerWeekStart')
// datepickerSchedulerWeekStart:HTMLInputElement;
//
// @ViewChild('datepickerSchedulerWeekEnd')
// datepickerSchedulerWeekEnd:HTMLInputElement;