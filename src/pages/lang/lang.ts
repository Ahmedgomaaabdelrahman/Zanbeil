import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import {HomePage} from "../home/home";
import {GlobalService} from "../../Providers/GlobalService";

@Component({
  selector: 'page-lang',
  templateUrl: 'lang.html'
})
export class LangPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private globalService:GlobalService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LangPage');
  }

  setLanguage(language){
    this.globalService.setDefaultLang(language);
    this.navCtrl.setRoot(HomePage);
  }

  setRoot(){
    this.navCtrl.setRoot(HomePage);
  }

   gotolog(){
    this.navCtrl.push(LoginPage);
  }

}
