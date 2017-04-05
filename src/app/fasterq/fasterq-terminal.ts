import {AfterViewInit, Component} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ActivatedRoute} from "@angular/router";
import {FasterqLineModel} from "../../models/fasterq-line-model";
import {EFFECT_LOAD_FASTERQ_LINE} from "../../store/effects/appdb.effects";

@Component({
    selector: 'fasterq-terminal',
    styles: [`
        .largeFont2em {
            font-size: 2em;
        }
        .lPad {
            padding-left: 20px;
        }
    `],
    template: `
        <small class="debug">{{me}}</small>
        <div id="fasterqCustomerTerminal">
            <div style="width: 100%">
                <h1 id="fqTakeNumberLineName" style="font-size: 10em; text-align: center" class="centerElement">{{m_fasterqLineModel?.lineName}}</h1>
            </div>

            <hr/>
            <h1 id="fasterQLineName"></h1>
            <hr/>

            <div id="printDiag" style="display: none">
                <h1>You number is 123</h1>

                <h3 id="printData">Oct 1 1973</h3>
            </div>

            <div id="terminalCarousel" class="carousel slide" data-interval="false" data-ride="carousel">
                <div class="carousel-inner">

                    <div class="item active">
                        <div style="width: 100%; text-align: center">
                            <i style="font-size: 3em; padding-right: 40px" class="carouselLargeHeader fa fa-print"></i>
                            <span class="carouselLargeHeader" style="font-size: 3em">Print your queue number</span>
                            <br/>
                            <br/>
                            <br/>
                            <a id="fqPrintNumber" style="padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 20px" class="btn btn-large btn-danger" type="button" href="#">
                                <span  class="carouselLargeHeader2 fa fa-download"></span>
                                <span class="largeFont2em" data-localize="printIt" >PRINT IT</span>
                            </a>
                            <h1 id="fqDisplayPrintNumber"></h1>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>

                    <div class="item">
                        <div style="width: 100%; text-align: center">
                            <i class="carouselLargeHeader fa fa-qrcode"></i>
                            <span class="carouselLargeHeader" data-localize="scanMobile" style="font-size: 3em">Scan with your mobile device</span>
                            <br/>

                            <div class="centerElement" id="qrcode" style="text-align: center; width: 200px; height: 200px; margin-top:15px;"></div>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>

                    <div class="item">
                        <div style="width: 100%; text-align: center">
                            <i class="carouselLargeHeader fa fa-paper-plane"></i>
                            <span class="carouselLargeHeader" data-localize="notifyEmail" style="font-size: 3em">Notify via email</span>
                            <br/>
                            <br/>

                            <div style="text-align: center; width: 500px" class="centerElement">
                                <input id="fqEnterEmail" type="text" style="font-size: 3em; height: 2em; text-align: center" class="form-control" data-localize="enterEmail" placeholder="enter email">
                            </div>
                            <br/>
                            <a id="fqSenditButton" style="padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 20px" class="btn btn-large btn-danger" type="button" href="#">
                                <span  class="carouselLargeHeader2 fa fa-download"></span>
                                <span data-localize="sendIt" >SEND IT</span>
                            </a>
                            <br/>

                            <h1 id="fqDisplayEmailSent"></h1>
                            <br/>
                        </div>
                    </div>

                    <div class="item">
                        <div style="width: 100%; text-align: center">
                            <i class="carouselLargeHeader fa fa-phone"></i>
                            <span class="carouselLargeHeader" style="font-size: 3em">Notify via Text Message</span>
                            <br/>
                            <br/>

                            <div style="text-align: center; width: 500px" class="centerElement">
                                <input id="fqEnterSMS" type="text" style="font-size: 3em; height: 2em; text-align: center" class="form-control" data-localize="enterSMS" placeholder="enter your phone number">
                            </div>
                            <br/>
                            <br/>
                            <a id="fqCallIt" style="padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 20px" class="btn btn-large btn-danger" type="button" href="#">
                                <span  class="carouselLargeHeader2 fa fa-download"></span>
                                <span >CALL IT</span>
                            </a>

                            <h1 id="fqDisplaySMSSent"></h1>
                            <br/>
                        </div>
                    </div>
                </div>             
                <ul id="carouselItems" class="nav nav-pills nav-justified" style="border: 1px solid #9c9c9c">
                    <li data-target="#terminalCarousel" data-slide-to="0">
                        <a href="#"><i class="largeFont2em fa fa-print"></i><span class="lPad largeFont2em fasterQCarouselButtons">PRINT</span>
                        </a>
                    </li>
                    <li data-target="#terminalCarousel" data-slide-to="1">
                        <a href="#"><i class="largeFont2em fa fa-qrcode"></i><span  class="lPad largeFont2em fasterQCarouselButtons">SCAN</span>
                        </a>
                    </li>
                    <li data-target="#terminalCarousel" data-slide-to="2">
                        <a href="#"><i class="largeFont2em fa fa-paper-plane"></i><span  class="lPad largeFont2em fasterQCarouselButtons">E-MAIL</span>
                        </a>
                    </li>
                    <li data-target="#terminalCarousel" data-slide-to="3">
                        <a href="#"><i class="largeFont2em fa fa-phone"></i><span  class="lPad largeFont2em fasterQCarouselButtons">Text Message</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `,
})
export class FasterqTerminal extends Compbaser implements AfterViewInit {

    m_fasterqLineModel: FasterqLineModel;

    constructor(private yp: YellowPepperService, private router: ActivatedRoute) {
        super();

        this.cancelOnDestroy(
            this.yp.ngrxStore.select(store => store.appDb.fasterq.terminal)
                .subscribe((i_fasterqLineModel:FasterqLineModel) => {
                    this.m_fasterqLineModel = i_fasterqLineModel;
            }, (e) => console.error(e))
        )
    }

    ngAfterViewInit() {
        this._initTerminal(this.router.snapshot.url["1"].path);
    }

    _initTerminal(i_app: 'customerTerminal' | 'customerRemote') {
        var data = $.base64.decode(this.router.snapshot.url["2"].path);
        data = JSON.parse(data);

        this.yp.ngrxStore.dispatch({type: EFFECT_LOAD_FASTERQ_LINE, payload: {lineId: data.line_id, businessId: data.business_id}})

        // this.m_fasterqLineModel = new FasterqLineModel(data)

        // self.m_lineModel = new LineModel({
        //     call_type: data.call_type,
        //     business_id: data.business_id,
        //     line_id: data.line_id,
        //     email: data.email,
        //     service_id: data.service_id,
        //     verification: data.verification,
        //     date: data.date,
        //     line_name: data.line_name
        // });
        // BB.comBroker.setService(BB.SERVICES.FQ_LINE_MODEL, self.m_lineModel);

        switch (i_app) {
            case 'customerTerminal': {
                // self._loadCustomerTerminalApp();
                break;
            }
            case 'customerRemote': {
                // self._getLine();
                break;
            }
        }
    }
}
