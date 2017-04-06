import {AfterViewInit, Component, ElementRef, NgZone} from "@angular/core";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {ActivatedRoute} from "@angular/router";
import {FasterqLineModel} from "../../models/fasterq-line-model";
import {EFFECT_LOAD_FASTERQ_LINE} from "../../store/effects/appdb.effects";
import * as _ from 'lodash';
import {timeout} from "../../decorators/timeout-decorator";
import {Http, RequestMethod, RequestOptionsArgs, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Lib} from "../../Lib";

@Component({
    selector: 'fasterq-terminal',
    styles: [`
        .largeFont2em {
            font-size: 2em;
        }

        .lPad {
            padding-left: 20px;
        }

        .carousel-inner {
            height: 400px;
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
                            <a (click)="_onPrint($event)" id="fqPrintNumber" style="padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 20px" class="btn btn-large btn-danger" type="button" href="#">
                                <span class="largeFont2em" data-localize="printIt">PRINT IT</span>
                            </a>
                            <h1 id="fqDisplayPrintNumber">{{m_displayServiceId}}</h1>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>

                    <div class="item">
                        <div style="width: 100%; text-align: center">
                            <i style="font-size: 3em; padding-right: 40px" class="carouselLargeHeader fa fa-qrcode"></i>
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
                            <i style="font-size: 3em; padding-right: 40px" class="carouselLargeHeader fa fa-paper-plane"></i>
                            <span class="carouselLargeHeader" data-localize="notifyEmail" style="font-size: 3em">Notify via email</span>
                            <br/>
                            <br/>

                            <div style="text-align: center; width: 500px" class="centerElement">
                                <input id="fqEnterEmail" type="text" style="font-size: 3em; height: 2em; text-align: center" class="form-control" data-localize="enterEmail" placeholder="enter email">
                            </div>
                            <br/>
                            <a (click)="_onSend($event)" id="fqSenditButton" style="padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 20px" class="btn btn-large btn-danger" type="button" href="#">
                                <span class="largeFont2em" data-localize="printIt">SEND IT</span>
                            </a>
                            <br/>

                            <h1 id="fqDisplayEmailSent"></h1>
                            <br/>
                        </div>
                    </div>

                    <div class="item">
                        <div style="width: 100%; text-align: center">
                            <i style="font-size: 3em; padding-right: 40px" class="carouselLargeHeader fa fa-phone"></i>
                            <span class="carouselLargeHeader" style="font-size: 3em">Notify via Text Message</span>
                            <br/>
                            <br/>

                            <div style="text-align: center; width: 500px" class="centerElement">
                                <input id="fqEnterSMS" type="text" style="font-size: 3em; height: 2em; text-align: center" class="form-control" data-localize="enterSMS" placeholder="enter your phone number">
                            </div>
                            <br/>
                            <br/>
                            <a (click)="_onCall($event)" id="fqCallIt" style="padding-left: 40px; padding-right: 40px; padding-top: 20px; padding-bottom: 20px" class="btn btn-large btn-danger" type="button" href="#">
                                <span class="largeFont2em" data-localize="printIt">CALL IT</span>

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
                        <a href="#"><i class="largeFont2em fa fa-qrcode"></i><span class="lPad largeFont2em fasterQCarouselButtons">SCAN</span>
                        </a>
                    </li>
                    <li data-target="#terminalCarousel" data-slide-to="2">
                        <a href="#"><i class="largeFont2em fa fa-paper-plane"></i><span class="lPad largeFont2em fasterQCarouselButtons">E-MAIL</span>
                        </a>
                    </li>
                    <li data-target="#terminalCarousel" data-slide-to="3">
                        <a href="#"><i class="largeFont2em fa fa-phone"></i><span class="lPad largeFont2em fasterQCarouselButtons">Text Message</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!--<div id="printSectionId" style="display: none" >-->
        <!--<div>-->
        <!--<h1>AngularJS Print html templates</h1>-->
        <!--<form novalidate>-->
        <!--First Name:-->
        <!--<input type="text"  class="tb8">-->
        <!--<br>-->
        <!--<br> Last Name:-->
        <!--<input type="text"  class="tb8">-->
        <!--<br>-->
        <!--<br>-->
        <!--<button  class="button">Submit</button>-->
        <!--<button (click)="printToCart('printSectionId')" class="button">Print</button>-->
        <!--</form>-->
        <!--</div>-->
        <!--<div>-->
        <!--<br/>-->
        <!--</div>-->
        <!--</div>-->
    `,
})
export class FasterqTerminal extends Compbaser implements AfterViewInit {

    m_fasterqLineModel: FasterqLineModel;
    m_displayServiceId = '';
    appBaseUrlServices;

    constructor(private http: Http, private yp: YellowPepperService, private router: ActivatedRoute, private el: ElementRef, private zone: NgZone) {
        super();
        // this.preventRedirect(true);
        this.cancelOnDestroy(
            this.yp.ngrxStore.select(store => store.appDb.fasterq.terminal)
                .filter(v => !_.isNull(v))
                .take(1)
                .subscribe((i_fasterqLineModel: FasterqLineModel) => {
                    this.m_fasterqLineModel = i_fasterqLineModel;
                    this._createQRcode();
                }, (e) => console.error(e))
        )

        this.cancelOnDestroy(
            this.yp.ngrxStore.select(store => store.appDb.appBaseUrlServices)
                .subscribe((i_appBaseUrlServices) => {
                    this.appBaseUrlServices = i_appBaseUrlServices;
                })
        )
    }

    ngOnInit() {
        this.cancelOnDestroy(
            this.router.params.subscribe(params => {
                this._initTerminal(params['id'].split('=')[1] + '==');
            })
        )
    }

    ngAfterViewInit() {

    }

    /**
     Listen to custom selection on queue id creator via QR scan
     @method _createQRcode
     **/
    @timeout(1000)
    _createQRcode() {
        $('.carousel').carousel()
        var q: any = $("#qrcode", this.el.nativeElement);
        q = q[0];
        var qrcode = new QRCode(q, {width: 200, height: 200});
        var url = this._buildURL();
        qrcode.makeCode(url);
    }

    _onCall($event){
        event.stopImmediatePropagation();
        event.preventDefault();
    }

    _onSend($event){
        event.stopImmediatePropagation();
        event.preventDefault();
    }

    _onPrint(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        
        // this.printToCart('printSectionId');
        // urlRoot: BB.CONSTS.ROOT_URL + '/',
        //     idAttribute: 'queue_id'
        // var url = `${this.appBaseUrlServices}/`;

        var options: RequestOptionsArgs = this.createOptionArgs('/Queue', RequestMethod.Post, {line_id: this.m_fasterqLineModel.lineId, business_id: this.m_fasterqLineModel.businessId})
        return this.http.get(options.url, options)
            .catch((err) => {
                // return Observable.throw(err);
                return err;
            })
            .finally(() => {
            }).take(1)
            .subscribe((i_response: Response) => {
                var jData = i_response.json()
                this.m_displayServiceId = jData.service_id;
                this._printNumber(jData.service_id, jData.name);
            }, (e) => console.error(e));
    }


    /**
     Print current customer service id
     @method _printNumber
     @param {Number} i_service_id
     **/
    _printNumber(i_service_id, name) {
        this.zone.runOutsideAngular(() => {
            var $printDiag = $('#printDiag');
            //var div = document.getElementById("printerDiv");
            var p = function () {
                $('body').append('<h2></h2>')
            }
            var arg = Lib.Base64Encode(i_service_id + ':_:' + name)
            $printDiag.html('<iframe src="print.html?serviceId=' + arg + '" onload="this.contentWindow.print();"></iframe>');
        })

        // $printDiag.find('h1').text('your number is ' + i_service_id);
        // $printDiag.find('h3').text('created on ' + moment().format('MMMM Do YYYY, h:mm:ss a'));
        // var divContents = $(Elements.PRINT_DIAG).html();
        // var printWindow = window.open('', '', 'height=250,width=450');
        // printWindow.document.write('<html><head><title>' + self.model.get('name') + '</title>');
        // printWindow.document.write('</head><body><center>');
        // printWindow.document.write(divContents);
        // printWindow.document.write('</center></body></html>');
        // printWindow.document.close();
        // printWindow.print();
    }

    private createOptionArgs(i_urlEndPoint, i_method, i_body): RequestOptionsArgs {
        var url = `${this.appBaseUrlServices}${i_urlEndPoint}`;
        return {
            url: url,
            method: i_method,
            body: i_body
        };
    }

    /**
     Create URL string to load customer terminal UI for FasterQ queue generation
     @method _buildURL
     @return {String} URL
     **/
    _buildURL() {
        var data = {
            line_id: this.m_fasterqLineModel.lineId,
            business_id: this.m_fasterqLineModel.businessId,
            call_type: 'QR'
        };
        data = $.base64.encode(JSON.stringify(data));
        return `${this.appBaseUrlServices}?mode=remoteStatus&param=${data}`;
    }

    // _initTerminal(i_app: 'customerTerminal' | 'customerRemote') {
    _initTerminal(i_params) {
        var data: any = $.base64.decode(i_params);
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

        // switch (i_app) {
        //     case 'customerTerminal': {
        //         // self._loadCustomerTerminalApp();
        //         break;
        //     }
        //     case 'customerRemote': {
        //         // self._getLine();
        //         break;
        //     }
        // }
    }
}
