import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import {LangPage} from "../lang/lang";
import {HomePage} from "../home/home";
import {TranslateService} from "ng2-translate";
import {GlobalService} from "../../Providers/GlobalService";
import {LoginPage} from "../login/login";
import {About} from "../about/about";
import {Terms} from "../terms/terms";
import {Contact} from "../contact/contact";
import {HistoryPage} from "../history/history";
import {OrdersPage} from "../orders/orders";
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService, private alertCtrl: AlertController,
              private globalService: GlobalService, private viewCtrl: ViewController) {
  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  navLanguage() {
    this.navCtrl.push(LangPage);
  }
  navAbout() {
    this.navCtrl.push(About)
  }
  navTerms() {
    this.navCtrl.push(Terms)
  }
  navContactUs() {
    this.navCtrl.push(Contact)
  }
  logout() {
    this.globalService.logout();
    this.showLogoutAlert();
    this.navCtrl.setRoot(HomePage);
  }

  navLoginPage() {
    this.navCtrl.push(LoginPage)
  }

  showLogoutAlert() {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('Logged out'),
      subTitle: this.translate.instant('Logged out successfully!'),
      buttons: [this.translate.instant('OK')]
    });
    alert.present();
  }

  gohistory() {
    this.navCtrl.push(HistoryPage);
  }

  goorders() {
    this.navCtrl.push(OrdersPage);
  }
}
