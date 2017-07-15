import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {

  private orderDetails = {
    customer_id: "",
    address: "",
    lat: 0,
    lng: 0,
    delivery_date: '',
    payment_method: "",
    delivery_date_option: '',
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
              private globalService: GlobalService, private toastCtrl: ToastController, private translate: TranslateService,
              private alertCtrl: AlertController) {
    this.orderDetails = this.navParams.get('orderDetails');
    console.log(this.orderDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    this.orderDetails.payment_method = 'cash';
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  finalizeOrder() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.orderDetails.customer_id = this.globalService.user.id;
    console.log(this.orderDetails);
    this.globalService.finalizeCart(this.orderDetails).subscribe((response => {
      loader.dismissAll();
      console.log(response);
      let alert = this.alertCtrl.create({
        title: this.translate.instant('Order completed'),
        subTitle: this.translate.instant('Order completed successfully, Order Number: ') + response.id,
        buttons: [this.translate.instant('OK')]
      });
      alert.present();
      this.navCtrl.setRoot(HomePage);

    }), (err => {
      console.log(err);
      loader.dismissAll();
      this.DisplayToast(this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').');
    }));
  }
}
