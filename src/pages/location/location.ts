import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {PaymentPage} from '../payment/payment';
import {MapsPage} from "../maps-page/mapspage";
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";
import {LoginPage} from "../login/login";
import {IdentifierCodes} from "../../Providers/IdentifierCodes";

/*
 Generated class for the Location page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-location',
  templateUrl: 'location.html'
})
export class LocationPage {
  public deliveryDate = new Date().toISOString().substring(0, 10);
  public deliveryTime = "15:00";
  public minDate = new Date().toISOString().substring(0, 10);
  private orderDetails = {
    device_token: this.globalService.Token == null ?
      this.globalService.tempToken
      :
      this.globalService.Token.registrationId,
    address: "",
    lat: 0,
    lng: 0,
    delivery_date: '',
    payment_method: "",
    delivery_date_option: '',
    customer_id:""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private globalService: GlobalService,
              private toastCtrl: ToastController, private translate: TranslateService, private codes:IdentifierCodes) {
    console.log(this.orderDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
    this.orderDetails.delivery_date_option = 'Now';
  }

  checkout() {
    if (this.globalService.myMapsLat == 0) {
      this.DisplayToast(this.translate.instant('Please Enter your location.'));
      return;
    }
    this.orderDetails.lat = this.globalService.myMapsLat;
    this.orderDetails.lng = this.globalService.myMapsLng;
    // this.orderDetails.delivery_date_option == 'Now'?
    //   this.orderDetails.delivery_date ='Now' :
    this.orderDetails.delivery_date = this.deliveryDate + ' ' + this.deliveryTime;
    if (this.globalService.loggedIn)
      this.navCtrl.push(PaymentPage, {
        orderDetails: this.orderDetails
      });
    else {
      this.globalService.myOrder = this.orderDetails;
      this.navCtrl.push(LoginPage,{
        codes: this.codes.LOGIN_CHECKOUT
      });
    }
    console.log(this.orderDetails);
  }

  pickLocation() {
    this.navCtrl.push(MapsPage);
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }
}
