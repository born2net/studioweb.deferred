import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BlockService, IBlockData} from "./block-service";
import {Compbaser, NgmslibService} from "ng-mslib";
import {urlRegExp} from "../../Lib";
import * as _ from "lodash";

@Component({
    selector: 'block-prop-rss',
    host: {'(input-blur)': 'saveToStore($event)'},
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <small class="debug">{{me}}</small>
        <form novalidate autocomplete="off" class="inner5" [formGroup]="m_contGroup">
            <div class="row">
                <ul class="list-group">
                    <li class="list-group-item">
                        <select #sceneSelection class="default-prop-width" (change)="_onRssSelected($event)" formControlName="rssSelection">
                            <option [value]="rss.url" *ngFor="let rss of m_mrssLinksData">{{rss.label}}</option>
                        </select>
                    </li>
                    <li *ngIf="m_showCustomUrl" class="list-group-item">
                        <input class="default-prop-width" type="text" formControlName="url"/>
                    </li>
                </ul>
            </div>
        </form>
    `
})
export class BlockPropRss extends Compbaser implements AfterViewInit {
    m_formInputs = {};
    m_contGroup: FormGroup;
    m_blockData: IBlockData;
    m_showCustomUrl = false;
    m_mrssLinksData = [];
    m_mrssLinks = '<TextRss>' +
        '<Rss label="Top Stories" url="http://rss.news.yahoo.com/rss/topstories"/>' +
        '<Rss label="U.S. National" url="http://rss.news.yahoo.com/rss/us"/>' +
        '<Rss label="Elections" url="http://rss.news.yahoo.com/rss/elections"/>' +
        '<Rss label="Terrorism" url="http://rss.news.yahoo.com/rss/terrorism"/>' +
        '<Rss label="World" url="http://rss.news.yahoo.com/rss/world"/>' +
        '<Rss label="Mideast Conflict" url="http://rss.news.yahoo.com/rss/mideast"/>' +
        '<Rss label="Iraq" url="http://rss.news.yahoo.com/rss/iraq"/>' +
        '<Rss label="Politics" url="http://rss.news.yahoo.com/rss/politics"/>' +
        '<Rss label="Business" url="http://rss.news.yahoo.com/rss/business"/>' +
        '<Rss label="Technology" url="http://rss.news.yahoo.com/rss/tech"/>' +
        '<Rss label="Sports" url="http://rss.news.yahoo.com/rss/sports"/>' +
        '<Rss label="Entertainment" url="http://rss.news.yahoo.com/rss/entertainment"/>' +
        '<Rss label="Health" url="http://rss.news.yahoo.com/rss/health"/>' +
        '<Rss label="Odd News" url="http://rss.news.yahoo.com/rss/oddlyenough"/>' +
        '<Rss label="Science" url="http://rss.news.yahoo.com/rss/science"/>' +
        '<Rss label="Opinion/Editorial" url="http://rss.news.yahoo.com/rss/oped"/>' +
        '<Rss label="Obituaries" url="http://rss.news.yahoo.com/rss/obits"/>' +
        '<Rss label="Most Emailed" url="http://rss.news.yahoo.com/rss/mostemailed"/>' +
        '<Rss label="Most Viewed" url="http://rss.news.yahoo.com/rss/mostviewed"/>' +
        '<Rss label="Most Recommended" url="http://rss.news.yahoo.com/rss/highestrated"/>' +
        '<Rss label="Custom" url=""/>' +
        '</TextRss>'

    constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private bs: BlockService, private ngmslibService: NgmslibService) {
        super();
        this.m_contGroup = fb.group({
            'url': ['', [Validators.pattern(urlRegExp)]],
            'rssSelection': []
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.m_formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })
        var links = jQuery(jQuery.parseXML(this.m_mrssLinks)).find('Rss');
        _.forEach(links, (k, v) => {
            this.m_mrssLinksData.push({
                url: jQuery(k).attr('url'),
                label: jQuery(k).attr('label')
            })
        });
    }

    @Input()
    set setBlockData(i_blockData) {
        if (this.m_blockData && this.m_blockData.blockID != i_blockData.blockID) {
            this.m_blockData = i_blockData;
            this._render();
        } else {
            this.m_blockData = i_blockData;
        }
    }

    @Input() external: boolean = false;

    _isUrlCustom(i_url): boolean {
        var feed = this.m_mrssLinksData.find(o => o.url == i_url);
        if (feed && feed.label == 'Custom') return true;
        if (feed) return false;
        return true;
    }

    _onRssSelected(event) {
        this.m_showCustomUrl = this._isUrlCustom(event.target.value);
    }

    private _render() {
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom
        var xSnippet = $(domPlayerData).find('Rss');
        var url = xSnippet.attr('url');

        if (this._isUrlCustom(url)) {
            this.m_showCustomUrl = true;
            this.m_formInputs['rssSelection'].setValue('');
            this.m_formInputs['url'].setValue(url);
        } else {
            this.m_showCustomUrl = false;
            this.m_formInputs['rssSelection'].setValue(url);
        }
        this.cd.markForCheck();
    }

    ngAfterViewInit() {
        this._render();
    }

    private saveToStore() {
        // con(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        if (this.m_contGroup.status != 'VALID')
            return;
        var domPlayerData: XMLDocument = this.m_blockData.playerDataDom;
        var xSnippet = $(domPlayerData).find('Rss');
        if (this.m_contGroup.value.rssSelection == ''){
            $(xSnippet).attr('url', this.m_contGroup.value.url);
        } else {
            $(xSnippet).attr('url', this.m_contGroup.value.rssSelection);
        }
        this.bs.setBlockPlayerData(this.m_blockData, domPlayerData);
    }

    destroy() {
    }
}