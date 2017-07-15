import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, LoadingController} from 'ionic-angular';
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";


@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class Terms {
   terms = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl:ToastController,
  private loadingCtrl:LoadingController, private globalService:GlobalService, private translate:TranslateService) {
    this.getTerms();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Terms');
  }


  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  getTerms(){
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.getTerms().subscribe(response => {
      loader.dismissAll();
      console.log(response);
      this.terms = this.globalService.language == 'en' ? response.body_en : response.body_ar;
    }, (err => {
      loader.dismissAll();
      this.DisplayToast(this.translate.instant("Something went wrong, please try again later.") + ' (' + err + ')');
    }));
  }

}
