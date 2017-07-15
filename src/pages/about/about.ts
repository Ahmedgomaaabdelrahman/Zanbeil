import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";


@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class About {
  about = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private globalService: GlobalService,
              private loadingCtrl: LoadingController, private translate: TranslateService, private toastCtrl: ToastController) {
    this.getAbout();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad About');
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  getAbout() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.getAbout().subscribe(response => {
      loader.dismissAll();
      console.log(response);
      this.about = this.globalService.language == 'en' ? response.body_en : response.body_ar;
    }, (err => {
      loader.dismissAll();
      this.DisplayToast(this.translate.instant("Something went wrong, please try again later.") + ' (' + err + ')');
    }));
  }
}
