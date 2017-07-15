import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class Contact {
  contactObject = {
    user_id: this.globalService.loggedIn ? this.globalService.user.id : 0,
    message: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private globalService: GlobalService,
              private toastCtrl: ToastController, private loadingCtrl: LoadingController, private translate: TranslateService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Contact');
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }
  contact() {
    console.log(this.contactObject);
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.contactUs(this.contactObject).subscribe(response => {
      loader.dismissAll();
      if (response.Error == null) {
        this.DisplayToast(this.translate.instant('Message sent successfully.'));
        this.contactObject.message = "";
      } else
        this.DisplayToast(response.Error);
      console.log(response);
    }, (err => {
      loader.dismissAll();
      this.DisplayToast(this.translate.instant("Something went wrong, please try again later.") + ' (' + err + ')');
    }));
  }
}
