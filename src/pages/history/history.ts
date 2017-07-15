import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {TranslateService} from "ng2-translate";
import {GlobalService} from "../../Providers/GlobalService";


@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public translate: TranslateService, public globalService: GlobalService,
              public alertCtrl: AlertController) {
    this.getFormersOrders();
    this.getRecentOrders();
  }

  public stars = [1, 2, 3, 4, 5];

  orderType = 'RecentOrders';
  formerOrders: any;
  recentOrders: any;


  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  deleteOrder(orderID) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('Are you sure deleting this order?'),
      buttons: [
        {
          text: this.translate.instant('Delete'),
          handler: data => {
            this.removeOrder(orderID);
          }
        },
        {
          text: this.translate.instant('Cancel'),
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  removeOrder(orderID) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.deleteOrder(orderID).subscribe(response => {
      loader.dismissAll();
      console.log(response);
      this.DisplayToast(this.translate.instant('Order deleted successfully.'));
      this.formerOrders = this.formerOrders.filter(function (obj) {
        return obj.id !== orderID;
      });
      this.recentOrders = this.recentOrders.filter(function (obj) {
        return obj.id !== orderID;
      });
    }, (err => {
      console.log(err);
      loader.dismissAll();
      let toast = this.toastCtrl.create({
        message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
        duration: 3000
      });
      toast.present();
    }));
  }


  rateOrder(order, index) {
    if (order.rate != index + 1) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.globalService.rateOrder(order.id, index + 1).subscribe((response => {
        console.log(response);
        loader.dismissAll();
        if (response != null) {
          if (response.error != null) {
            let toast = this.toastCtrl.create({
              message: response.error,
              duration: 4000,
            });
            toast.present();
          } else {
            order.rate = index + 1;
            console.log(index + 1)
          }
        }
      }), (err => {
        // console.log(err);
        loader.dismissAll();
        let toast = this.toastCtrl.create({
          message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
          duration: 3000
        });
        toast.present();
      }));
    }
  }

  getRecentOrders() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.getRecentOrders().subscribe((response => {
      console.log(response);
      loader.dismissAll();
      if (response != null) {
        if (response.error != null) {
          let toast = this.toastCtrl.create({
            message: response.error,
            duration: 4000,
          });
          toast.present();
        } else {
          this.recentOrders = response;
        }
      }
    }), (err => {
      // console.log(err);
      loader.dismissAll();
      let toast = this.toastCtrl.create({
        message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
        duration: 3000
      });
      toast.present();
    }));
  }

  getFormersOrders() {

    this.globalService.getPastOrders().subscribe((response => {
      console.log(response);
      if (response != null) {
        if (response.error != null) {
          let toast = this.toastCtrl.create({
            message: response.error,
            duration: 4000,
          });
          toast.present();
        } else {
          this.formerOrders = response;
        }
      }
    }), (err => {
      // console.log(err);
      let toast = this.toastCtrl.create({
        message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
        duration: 3000
      });
      toast.present();
    }));
  }

}
