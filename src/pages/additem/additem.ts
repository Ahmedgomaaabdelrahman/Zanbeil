import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {LocationPage} from '../location/location';
import {GlobalService} from "../../Providers/GlobalService";
import {LoginPage} from "../login/login";
import {TranslateService} from "ng2-translate";



@Component({
  selector: 'page-additem',
  templateUrl: 'additem.html'
})
export class AdditemPage {
  public products;

  constructor(public navCtrl: NavController, public navParams: NavParams, private globalService: GlobalService, private translate: TranslateService,
              private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    this.getCart();
    // this.getHistory();
  }

  proceedOrder() {
    if (this.products != null && this.products.length > 0) {
      this.navCtrl.push(LocationPage);
    } else {
      this.DisplayToast(this.translate.instant('There are no products in your shopping cart.'));
    }
  }

  subProduct(product) {
    console.log(product);
    let loader = this.loadingCtrl.create();
    loader.present();
    let productObject = {
      device_token: this.globalService.Token == null ?
        this.globalService.tempToken
        :
        this.globalService.Token.registrationId,
      product_id: product.product.id,
      quantity: product.quantity == 1 ? 0 : 1,
      measure_id: product.measure_id,
      decrement_flag: product.quantity != 1
    };
    console.log(productObject);
    this.globalService.addToCart(productObject).subscribe(response => {
      loader.dismissAll();
      product.quantity--;
      if (product.quantity == 0) {
        this.products = this.products.filter(function (obj) {
          return obj.quantity !== product.quantity;
        });
      }
      console.log(response);
    }, (err => {
      console.log(err);
      loader.dismissAll();
      let toast = this.toastCtrl.create({
        message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
        duration: 3000
      });
      toast.present();
    }));
    console.log(product)
  }

  addProduct(product) {
    console.log(product);
    let loader = this.loadingCtrl.create();
    loader.present();

    let productObject = {
      device_token: this.globalService.Token == null ?
        this.globalService.tempToken
        :
        this.globalService.Token.registrationId,
      product_id: product.product.id,
      quantity: product.quantity == -1 ? 0 : 1,
      measure_id: product.measure_id
    };
    console.log(productObject);
    this.globalService.addToCart(productObject).subscribe(response => {
      loader.dismissAll();
      product.quantity++;
      console.log(response);
    }, (err => {
      console.log(err);
      loader.dismissAll();
      let toast = this.toastCtrl.create({
        message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
        duration: 3000
      });
      toast.present();
    }));
    console.log(product)
  }

  getCart() {
    // if (this.globalService.loggedIn) {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.globalService.getCart().subscribe(response => {
        console.log(response);
        loader.dismissAll();
        if (response.length > 0) {
          this.products = response;
        } else {
          this.DisplayToast(this.translate.instant('There are no products in your shopping cart.'));
        }
      }, (err => {
        // console.log(err);
        loader.dismissAll();
        let toast = this.toastCtrl.create({
          message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
          duration: 3000
        });
        toast.present();
      }));
  }
  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }
}
