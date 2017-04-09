import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[@routeAnimation]': 'true',
        '[style.display]': "'block'"
    },
    animations: [
        trigger('routeAnimation', [
            state('*', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate(333)
            ]),
            transition('* => void', animate(333, style({opacity: 0})))
        ])
    ],
    template: `
        <small class="release">help
            <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
        </small>
        <div id="helpPanel">
            <!-- video tutorials -->
            <h3 data-localize="videoTutorial">Video tutorial</h3>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/StudioLite.mp4">
                <span data-localize="basicIntroductionVideo">basic introduction</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/SceneComponentsLite.mp4">
                <span data-localize="sceneAndComponents">Scenes and components</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/StudioLiteAdv.mp4">
                <span data-localize="advancedConfigurationVideo">advanced configuration</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/LiteSeqVsSched.mp4">
                <span data-localize="seqVsSchedVideo2">sequencer vs scheduler</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/LiteCollection.mp4">
                <span data-localize="collectionComponent">collection component</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/LocationBased.mp4">
                <span data-localize="locationBasedComponent">location based component</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/LiteGoogleCalendar.mp4">
                <span data-localize="googleCalendarComponent">Google Calendar</span>
            </button>
            <button class="videos btn btn-primary btn-lg" name="http://s3.signage.me/business1000/resources/FasterQv2.mp4">
                <span>FasterQue line management</span>
            </button>

            <hr/>
            <div class="reshid">
                <h3 data-localize="additionalLinks">Additional links</h3>
                <ul>
                    <li>
                        <a class="helpLinks" href="http://lite.digitalsignage.com" data-localize="studioLitePage">StudioLite page</a>
                    </li>
                    <li>
                        <a class="helpLinks" href="http://script.digitalsignage.com/forum/index.php" data-localize="supportForum">Support forum</a>
                    </li>

                    <li>
                        <a class="helpLinks" href="http://git.digitalsignage.com" data-localize="openSource">Open source</a>
                    </li>
                    <li>
                        <a class="helpLinks" href="http://script.digitalsignage.com/cgi-bin/webinar.cgi" data-localize="webinar">Webinar</a>
                    </li>
                    <li>
                        <a class="helpLinks" href="http://www.digitalsignage.com/_html/faqs.html" data-localize="faq">FAQs</a>
                    </li>
                    <li>
                        <a class="helpLinks" href="http://www.digitalsignage.com/support/upload/index.php?/Knowledgebase/List" data-localize="knowledgeBase">Knowledge base</a>
                    </li>
                </ul>
            </div>
            <hr/>
        </div>


    `,
})
export class HelpNavigation extends Compbaser {

    constructor() {
        super();
    }

    destroy() {
    }
}