import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {LoginPage} from "../login/login";
import {TranslateService} from "ng2-translate";
import {GlobalService} from "../../Providers/GlobalService";


@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
  product;
  imageURL = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private globalService: GlobalService, public translate: TranslateService,
              public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.product = navParams.get('product');
    this.imageURL = this.product.product_image[0].name;
    console.log(this.product)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

  showRadio(product) {
    let alertOption = {
      cssClass: 'fixdir'
    };
    let alert = this.alertCtrl.create(alertOption);
    alert.setTitle(this.translate.instant('Choose unit'));
    for (let i = 0; i < product.measure_uint.length; i++) {
      alert.addInput({
        type: 'radio',
        label: product.measure_uint[i].name_ar,
        value: product.measure_uint[i],
        checked: i == 0
      });
    }
    alert.addButton(this.translate.instant('Cancel'));
    alert.addButton({
      text: this.translate.instant('OK'),
      handler: pickedUnit => {
        this.reArrangeArray(product, pickedUnit);
      }
    });
    alert.present();
  }

  reArrangeArray(product, pickedUnit) {
    if (product.measure_uint.length > 1) { //Preserve processing power
      let pickedUnitIndex = 0;
      let tempUnitIndex = 0;
      product.measure_uint.forEach((object, index) => {
        if (object.id == pickedUnit.id) {
          pickedUnitIndex = index;
        }
      });
      let tmp = product.measure_uint[tempUnitIndex];
      product.measure_uint[tempUnitIndex] = product.measure_uint[pickedUnitIndex];
      product.measure_uint[pickedUnitIndex] = tmp;
    }
  }

  reArrangePictures(URL) {
    this.imageURL = URL;
  }

  addToCart(product) {
    console.log(this.globalService.user);
    // if (this.globalService.loggedIn) {
      let loader = this.loadingCtrl.create();
      loader.present();
      let productObject = {
        device_token: this.globalService.Token == null ?
          this.globalService.tempToken
          :
          this.globalService.Token.registrationId,
        product_id: product.id,
        quantity: 1,
        measure_id: product.measure_uint[0].id
      };
      console.log(productObject);
      this.globalService.addToCart(productObject).subscribe(response => {
        loader.dismissAll();
        console.log(response);
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
