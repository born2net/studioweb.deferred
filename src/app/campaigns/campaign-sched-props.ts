import {ChangeDetectionStrategy, Component, ElementRef, Input, ViewContainerRef} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Compbaser, NgmslibService} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import {Observable} from "rxjs";
import {simpleRegExp} from "../../Lib";
import * as _ from "lodash";
import {Once} from "../../decorators/once-decorator";
import {CampaignTimelinesModel} from "../../store/imsdb.interfaces_auto";

@Component({
    selector: 'campaign-sched-props',
    //changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(input-blur)': 'saveToStore($event)'
    },
    templateUrl: './campaign-sched-props.html',
    styleUrls: ['./campaign-sched-props.css']
})
export class CampaignSchedProps extends Compbaser {

    private campaignModel: CampaignsModelExt;
    private campaignTimelineModel: CampaignTimelinesModel;
    private formInputs = {};
    private contGroup: FormGroup;
    // private campaignModel$: Observable<CampaignsModelExt>;

    constructor(private fb: FormBuilder, private el: ElementRef, private yp: YellowPepperService, private rp: RedPepperService) {
        super();


        this.contGroup = fb.group({
            'campaign_name': ['', [Validators.required, Validators.pattern(simpleRegExp)]],
            'campaign_playlist_mode': [0],
            'kiosk_mode': [0]
        });
        _.forEach(this.contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.contGroup.controls[key] as FormControl;
        })

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

    ngAfterViewInit() {
        jQueryAny('#timepickerDurationInput', this.el.nativeElement).timepicker({
            showSeconds: true,
            showMeridian: false,
            defaultTime: false,
            minuteStep: 1,
            secondStep: 1
        });
    }

    @Once()
    private renderScheduler() {
        // if (jQueryAny('#timepickerDurationInput',this.el.nativeElement).timepicker == undefined)
        //     return;
        return this.yp.getCampaignsSchedule(this.campaignTimelineModel.getCampaignTimelineId())
            .subscribe((recSchedule) => {
                console.log(recSchedule);
                jQueryAny('#schedulerRepeatMode',this.el.nativeElement).carousel(Number(recSchedule.getRepeatType()));
                // var duration = pepper.formatSecondsToObject(recSchedule.duration);
                // var startTime = pepper.formatSecondsToObject(recSchedule.start_time);
                // jQueryAny(Elements.TIME_PICKER_DURATION_INPUT).timepicker('setTime', duration.hours + ':' + duration.minutes + ':' + duration.seconds);
                // jQueryAny(Elements.TIME_PICKER_TIME_INPUT).timepicker('setTime', startTime.hours + ':' + startTime.minutes + ':' + startTime.seconds);
                //
                // if (recSchedule.priorty == self.m_PRIORITY_LOW) {
                //     jQueryAny(Elements.SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 0.5).end().eq(2).fadeTo('fast', 0.5);
                // } else if (recSchedule.priorty == self.m_PRIORITY_MEDIUM) {
                //     jQueryAny(Elements.SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 0.5);
                // } else {
                //     jQueryAny(Elements.SCHEDULE_PRIORITY).find('img').eq(1).fadeTo('fast', 1).end().eq(2).fadeTo('fast', 1);
                // }
                //
                // jQueryAny(Elements.SCHEDULE_PRIORITY)
                // switch (String(recSchedule.repeat_type)) {
                //     case self.m_ONCE: {
                //         var date = recSchedule.start_date.split(' ')[0];
                //         jQueryAny(Elements.DATE_PICKER_SCHEDULER_ONCE).datepicker('setDate', date);
                //         break;
                //     }
                //     case self.m_DAILY: {
                //         var startDate = recSchedule.start_date.split(' ')[0];
                //         var endDate = recSchedule.end_date.split(' ')[0];
                //         jQueryAny(Elements.DATE_PICKER_SCHEDULER_DAILY_START).datepicker('setDate', startDate);
                //         jQueryAny(Elements.DATE_PICKER_SCHEDULER_DAILY_END).datepicker('setDate', endDate);
                //         break;
                //     }
                //     case self.m_WEEKLY: {
                //         var startDate = recSchedule.start_date.split(' ')[0];
                //         var endDate = recSchedule.end_date.split(' ')[0];
                //         var weekDays = recSchedule.week_days;
                //         var elDays = jQueryAny(Elements.SCHEDUALED_DAYS);
                //         // use bitwise (bitwize) operator << >> to compute days selected
                //         self.m_WEEKDAYS.forEach(function (v, i) {
                //             var n = weekDays & v;
                //             if (n == v) {
                //                 jQueryAny(elDays).find('input').eq(i).prop('checked', true);
                //             } else {
                //                 jQueryAny(elDays).find('input').eq(i).prop('checked', false);
                //             }
                //         });
                //         jQueryAny(Elements.DATE_PICKER_SCHEDULER_WEEK_START).datepicker('setDate', startDate);
                //         jQueryAny(Elements.DATE_PICKER_SCHEDULER_WEEK_END).datepicker('setDate', endDate);
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




