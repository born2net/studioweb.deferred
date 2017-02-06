import {AfterViewInit, Component, ElementRef} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import {simpleRegExp} from "../../Lib";
import * as _ from "lodash";
import {Once} from "../../decorators/once-decorator";
import {CampaignTimelineSchedulesModel, CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";


@Component({
    selector: 'campaign-sched-props',
    //changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    templateUrl: './campaign-sched-props.html',
    styleUrls: ['./campaign-sched-props.css']
})
export class CampaignSchedProps extends Compbaser implements AfterViewInit {

    private campaignModel: CampaignsModelExt;
    private campaignTimelineModel: CampaignTimelinesModel;
    private formInputs = {};
    private contGroup: FormGroup;
    private m_ONCE = '0';
    private m_DAILY = '1';
    private m_WEEKLY = '2';
    private m_PRIORITY_LOW = 2;
    private m_PRIORITY_MEDIUM = 1;
    private m_PRIORITY_HIGH = 0;
    private m_WEEKDAYS = [1, 2, 4, 8, 16, 32, 64];
    // private campaignModel$: Observable<CampaignsModelExt>;

    constructor(private fb: FormBuilder, private el: ElementRef, private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.contGroup = this.fb.group({
            'campaign_name': ['', [Validators.required, Validators.pattern(simpleRegExp)]],
            'campaign_playlist_mode': [0],
            'cal': [new Date()],
            'kiosk_mode': [0]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })
    }

    ngAfterViewInit() {
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
        this.cancelOnDestroy(
            this.yp.listenCampaignSelected()
                .subscribe((campaign: CampaignsModelExt) => {
                    this.campaignModel = campaign;
                    this.renderFormInputs();
                })
        )
        this.cancelOnDestroy(
            this.yp.listenTimelineSelected()
                .subscribe((timeline: CampaignTimelinesModel) => {
                    this.campaignTimelineModel = timeline;
                    this.renderScheduler();
                })
        )
    }

    @Once()
    private renderScheduler() {
        // if (jQueryAny('#timepickerDurationInput',this.el.nativeElement).timepicker == undefined)
        //     return Observable.of('done');
        return this.yp.getCampaignsSchedule(this.campaignTimelineModel.getCampaignTimelineId())
            .subscribe((campaignTimelineSchedulesModel: CampaignTimelineSchedulesModel) => {
                jQueryAny('#schedulerRepeatMode', this.el.nativeElement).carousel(Number(campaignTimelineSchedulesModel.getRepeatType()));

                var duration = this.rp.formatSecondsToObject(campaignTimelineSchedulesModel.getDuration());
                var startTime = this.rp.formatSecondsToObject(campaignTimelineSchedulesModel.getStartTime());

                jQueryAny('#timepickerDurationInput', this.el.nativeElement).timepicker('setTime', duration.hours + ':' + duration.minutes + ':' + duration.seconds);
                jQueryAny('#timepickerTimeInput', this.el.nativeElement).timepicker('setTime', startTime.hours + ':' + startTime.minutes + ':' + startTime.seconds);

                if (campaignTimelineSchedulesModel.getPriorty() == this.m_PRIORITY_LOW) {
                    jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 0.5).end().eq(2).fadeTo('fast', 0.5);
                } else if (campaignTimelineSchedulesModel.getPriorty() == this.m_PRIORITY_MEDIUM) {
                    jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 0.5);
                } else {
                    jQuery('#schedulePriority', this.el.nativeElement).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 1);
                }
                // switch (String(campaignTimelineSchedulesModel.getRepeatType())) {
                //     case this.m_ONCE: {
                //         var date = campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
                //         jQueryAny('#datepickerSchedulerOnce').datepicker('setDate', date);
                //         break;
                //     }
                //     case this.m_DAILY: {
                //         var startDate = campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
                //         var endDate = campaignTimelineSchedulesModel.getEndDate().split(' ')[0];
                //         jQueryAny('#datepickerSchedulerDailyStart', this.el.nativeElement).datepicker('setDate', startDate);
                //         jQueryAny('#datepickerSchedulerDailyEnd', this.el.nativeElement).datepicker('setDate', endDate);
                //         break;
                //     }
                //     case this.m_WEEKLY: {
                //         var startDate = campaignTimelineSchedulesModel.getStartDate().split(' ')[0];
                //         var endDate = campaignTimelineSchedulesModel.getEndDate().split(' ')[0];
                //         var weekDays = campaignTimelineSchedulesModel.getWeekDays();
                //         var elDays = jQuery('#scheduledDays', this.el.nativeElement);
                //         // use bitwise (bitwize) operator << >> to compute days selected
                //         this.m_WEEKDAYS.forEach(function (v, i) {
                //             var n = weekDays & v;
                //             if (n == v) {
                //                 $(elDays).find('input').eq(i).prop('checked', true);
                //             } else {
                //                 $(elDays).find('input').eq(i).prop('checked', false);
                //             }
                //         });
                //         jQueryAny('#datepickerSchedulerWeekStart', this.el.nativeElement).datepicker('setDate', startDate);
                //         jQueryAny('#datepickerSchedulerWeekEnd', this.el.nativeElement).datepicker('setDate', endDate);
                //         break;
                //     }
                // }
            });

    }

    @timeout()
    private saveToStore() {
        // console.log(this.contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.contGroup.value)));
        if (this.contGroup.status != 'VALID')
            return;
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_name', this.contGroup.value.campaign_name);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'campaign_playlist_mode', this.contGroup.value.campaign_playlist_mode);
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_timeline_id', 0); //todo: you need to fix this as zero is arbitrary number right now
        this.rp.setCampaignRecord(this.campaignModel.getCampaignId(), 'kiosk_mode', this.contGroup.value.kiosk_mode);
        this.rp.reduxCommit()
    }

    private renderFormInputs() {
        if (!this.campaignModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data = this.campaignModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            this.formInputs[key].setValue(data)
        });
    };

    destroy() {
    }
}




