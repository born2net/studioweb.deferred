import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {Observable} from "rxjs";
import {SideProps} from "../../store/actions/appdb.actions";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {BlockService, IBlockData, ISceneData} from "../blocks/block-service";

@Component({
    selector: 'scene-props-manager',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        ul {
            padding: 0
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <ul [ngSwitch]="m_sideProps$ | async">
            <div *ngSwitchCase="m_sidePropsEnum.sceneEditor">
                <h5>scene editor</h5>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.sceneProps">
                <block-prop-scene [setBlockData]="m_blockData"></block-prop-scene>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.sceneBlock">
                <block-prop-position></block-prop-position>
                <block-prop-container></block-prop-container>
            </div>
            <div *ngSwitchCase="m_sidePropsEnum.miniDashboard">
                <h5>scene dashboard</h5>
            </div>
        </ul>
    `,
})
export class ScenePropsManager extends Compbaser {

    m_blockData: IBlockData;

    constructor(private yp: YellowPepperService, private bs: BlockService) {
        super();
        this.m_sideProps$ = this.yp.ngrxStore.select(store => store.appDb.uiState.uiSideProps);

        this.cancelOnDestroy(
            this.yp.listenSceneSelected(true)
                .mergeMap((i_sceneData: ISceneData) => {
                    return this.bs.getBlockDataInScene(i_sceneData);
                }).subscribe((i_blockData) => {
                this.m_blockData = i_blockData;
            }, (e) => console.error(e))
        )
    }

    m_sidePropsEnum = SideProps;
    m_sideProps$: Observable<SideProps>;

    ngOnInit() {
    }

    destroy() {
    }
}