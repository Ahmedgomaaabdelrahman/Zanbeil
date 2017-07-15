import {Component} from '@angular/core';
import {
  NavController, NavParams, AlertController, LoadingController, ToastController, Platform,
  ViewController
} from 'ionic-angular';
import {AdditemPage} from '../additem/additem';
import {IdentifierCodes} from "../../Providers/IdentifierCodes";
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";
import {SignupPage} from "../signup/signup";
import {HomePage} from "../home/home"
import {PaymentPage} from "../payment/payment";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {


  public loginCredentials = {
    mobile: "",
    password: "",
    type: this.codes.USER_TYPE_CLIENT,
    lang: this.globalService.language,
    device_token: '',
    DeviceTypeID: 0
  };
  LoginCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private codes: IdentifierCodes,
              public toastCtrl: ToastController, private viewCtrl: ViewController,
              public globalService: GlobalService, public translate: TranslateService,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController, private  platform: Platform) {
    this.LoginCode = this.navParams.get('codes');

  }

  ionViewDidLoad() {

  }
  forgetPassword() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('Forget password'),
      inputs: [
        {
          name: 'email',
          placeholder: this.translate.instant('E-Mail')
        }
      ],
      buttons: [
        {
          text: this.translate.instant('Cancel'),
          role: 'cancel',
          handler: data => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant('Send'),
          role: 'cancel',
          handler: data => {
            // console.log(data.email);
            this.doForget(data.email);
          }
        }
      ]
    });
    alert.present();
  }
  doForget(email: string) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.forgetPassword(email)
      .subscribe((data) => {
        loader.dismissAll();
        console.log(data);
        if (data != null) {
          if (data.Erorr != null) {
            let toast = this.toastCtrl.create({
              message: data.Erorr,
              duration: 4000,
            });
            toast.present();
          } else {
            let toast = this.toastCtrl.create({
              message: this.translate.instant('Password reset successfully, Please check your E-Mail.'),
              duration: 4000,
            });
            toast.present();
          }
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
  redirectPage() {
    console.log('Redirecting loging' + this.LoginCode);
    if (this.LoginCode !== 'undefined') {
      switch (this.LoginCode) {
        case this.codes.LOGIN_CHECKOUT:
          this.navCtrl.push(PaymentPage, {
            orderDetails: this.globalService.myOrder
          });
          this.navCtrl.removeView(this.viewCtrl);
          break;

        default:
          this.navCtrl.setRoot(HomePage);
          break;
      }
    } else {
      console.log("i've got else");
    }
  }
  login() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.loginCredentials.device_token = this.globalService.Token == null ?this.globalService.tempToken:this.globalService.Token.registrationId;
    if (this.platform.is('ios')) {
      this.loginCredentials.DeviceTypeID = this.codes.iOS;
    } else {
      this.loginCredentials.DeviceTypeID = this.codes.Android;
    }
    console.log(this.loginCredentials);
    this.globalService.Login(this.loginCredentials).subscribe((response => {
      loader.dismissAll();
      console.log(response);
      if (response != null) {
        if (response.Error != null) {
          let toast = this.toastCtrl.create({
            message: response.Error,
            duration: 4000,
          });
          toast.present();
        } else {
          this.globalService.setUser(response[0]);
          this.redirectPage();
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

  navSingup() {
    if (this.LoginCode > 0) {
      console.log('going to sign up page with direct code');
      this.navCtrl.push(SignupPage,{
        codes:this.LoginCode
      });
      this.navCtrl.removeView(this.viewCtrl);
    } else
      this.navCtrl.push(SignupPage);
  }
  gotoLogin() {
    this.navCtrl.push(AdditemPage);
  }
  gotomain() {
    this.navCtrl.push(HomePage);
  }

}
