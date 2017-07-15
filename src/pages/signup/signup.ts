import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, Platform, ViewController} from 'ionic-angular';
import {IdentifierCodes} from "../../Providers/IdentifierCodes";
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";
import {HomePage} from "../home/home";
import {PaymentPage} from "../payment/payment";

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public register = true;
  LoginCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private codes: IdentifierCodes, public translate: TranslateService,
              public toastCtrl: ToastController, public globalService: GlobalService, public loadingCtrl: LoadingController,
              private platform: Platform, private viewCtrl: ViewController) {
    if (navParams.get('edit') != null) {
      this.register = false;
      this.registerCredentials = this.globalService.user;
      this.registerCredentials.password = "";
      console.log(this.registerCredentials);
    }
    this.LoginCode = this.navParams.get('codes');
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  public registerCredentials = {
    email: "",
    password: "",
    mobile: "",
    name: "",
    address: "",
    type: this.codes.USER_TYPE_CLIENT,
    divce_token: '',
    divce_type: 0
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  redirectPage() {
    console.log('Redirecting loging' + this.LoginCode);
    if (this.LoginCode !== 'undefined') {
      switch (this.LoginCode) {
        case this.codes.LOGIN_CHECKOUT:
          console.log('hitting Login checkout ' + this.LoginCode);

          this.navCtrl.push(PaymentPage, {
            orderDetails: this.globalService.myOrder
          });
          this.navCtrl.removeView(this.viewCtrl);
          break;

        default:
          console.log('hitting default ' + this.LoginCode);
          this.navCtrl.setRoot(HomePage);
          break;
      }
    } else {
      this.navCtrl.setRoot(HomePage);
      console.log("i've got else");
    }
  }

  registerUser() {

    let loader = this.loadingCtrl.create();
    loader.present();
    if (this.register) {
      this.registerCredentials.divce_token = this.globalService.Token == null ? this.globalService.tempToken
        :
        this.globalService.Token.registrationId;
      if (this.platform.is('ios')) {
        this.registerCredentials.divce_type = this.codes.iOS;
      } else {
        this.registerCredentials.divce_type = this.codes.Android;
      }
      this.globalService.Register(this.registerCredentials).subscribe(response => {
        loader.dismissAll();
        console.log(response);
        if (response.Error != null) {
          this.DisplayToast(response.Error);
        } else {
          this.globalService.setUser(response);
          this.redirectPage();
          this.DisplayToast(this.translate.instant('Registered successfully, welcome ') + this.registerCredentials.name);

        }
      }, (err => {
        // console.log(err);
        loader.dismissAll();
        this.translate.instant(this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').');
      }));
    } else {
      this.registerCredentials.address  = "";
      this.globalService.EditUser(this.registerCredentials).subscribe(response => {
        loader.dismissAll();
        console.log(response);
        if (response.error != null) {
          let toast = this.toastCtrl.create({
            message: response.error,
            duration: 4000,
          });
          toast.present();
        } else {
          this.globalService.setUser(this.registerCredentials);
          this.navCtrl.setRoot(HomePage);
          this.DisplayToast(this.translate.instant('Profile updated successfully, ') + this.registerCredentials.name);

        }
      }, (err => {
        // console.log(err);
        loader.dismissAll();
        this.translate.instant(this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').');
      }));
    }
  }


}
