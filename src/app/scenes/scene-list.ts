import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {CampaignsModelExt} from "../../store/model/msdb-models-extended";
import {List} from "immutable";
import {IUiState} from "../../store/store.data";
import {SideProps} from "../../store/actions/appdb.actions";
import {ISceneData} from "../../services/yellowpepper.service";

@Component({
    selector: 'scene-list',
    template: `
        <small class="debug">{{me}}</small>
        <ul (click)="$event.preventDefault()" class="appList list-group">

            <a *ngFor="let scene of m_scenes; let i = index" (click)="_onCampaignSelected($event, campaign, i)"
               [ngClass]="{'selectedItem': selectedIdx == i}" href="#" class="list-group-item">
                <h4>{{scene?.playerDataModel.getSceneName()}}</h4>
                <!--<p class="list-group-item-text">play list mode: {{scene?.getCampaignPlaylistModeName()}} </p>-->
                <!--<div class="openProps">-->
                    <!--<button type="button" class="props btn btn-default btn-sm"><i style="font-size: 1.5em" class="props fa fa-gear"></i></button>-->
                <!--</div>-->
            </a>
        </ul>
    `,
})
export class SceneList extends Compbaser {
    selectedIdx = -1;
    m_scenes: Array<ISceneData>;
    m_selectedCampaign: CampaignsModelExt;

    constructor() {
        super();
    }

    @Input()
    set scenes(i_scenes: Array<ISceneData>) {
        this.m_scenes = i_scenes;
    }

    @Output()
    slideToCampaignEditor: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    slideToCampaignName: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCampaignSelected: EventEmitter<any> = new EventEmitter<any>();

    _onCampaignSelected(event: MouseEvent, campaign: CampaignsModelExt, index) {
        // event.stopPropagation();
        // event.preventDefault();
        this.selectedIdx = index;
        let uiState: IUiState;
        if (jQuery(event.target).hasClass('props')) {
            uiState = {
                uiSideProps: SideProps.campaignProps,
                campaign: {
                    campaignSelected: campaign.getCampaignId()
                }
            }
            this.onCampaignSelected.emit(uiState)
        } else {
            uiState = {
                uiSideProps: SideProps.campaignEditor,
                campaign: {
                    campaignSelected: campaign.getCampaignId()
                }
            }
            this.slideToCampaignEditor.emit();
            this.onCampaignSelected.emit(uiState)
        }
        this.m_selectedCampaign = campaign;
    }

    ngOnInit() {
    }

    destroy() {
    }
}