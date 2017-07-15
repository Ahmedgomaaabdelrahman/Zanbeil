import {Component, ViewChild} from '@angular/core';
import {Platform, Config, AlertController, Nav} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "ng2-translate";
import {HomePage} from '../pages/home/home';
import {LangPage} from '../pages/lang/lang';
import {GlobalService} from "../Providers/GlobalService";
import {Push, PushOptions, PushObject} from "@ionic-native/push";
import {OrdersPage} from "../pages/orders/orders";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  //Push informations!
  //Server key:  AAAAQqddOqw:AP, A91bG6xUNV_q-ZTAEyg6xvwpLWizCv7WheYIi7C5x_GQFIpDPw7EDQzxsLdUVbhvqZovOxce8p1ZpKaJBNGJP-T0xHLEnqYr6sIJec0x-rkWXMnK3N9lIN4YTOECTunJtGBuJkdrKHOPva-wy_l78xTMXjRdgXtg
  //Legacy server key: AIzaSyAlByjZ7QeH9pGT2h6V50dHE0HqJuhx3xY
  //Sender ID:  286275746476
  //Google Maps API key: AIzaSyCEESwYcn8OVFrRvfbjtxm0OTxXy1lNX1U

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private globalService: GlobalService,
              private translate: TranslateService, private config: Config, private push: Push, private alertCtrl: AlertController) {
    // this.defLanguage();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.preparePush();
      this.splashScreen.hide();
    });
  }
  preparePush() {
    const options: PushOptions = {
      android: {
        senderID: '286275746476',
        sound: 'true',
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe(notification => {
        console.log('Received a notification', notification);
        let notificationData: any;
        notificationData = notification;
        //if user using app and push notification comes
        if (notificationData.additionalData.foreground) {
          this.showCommentDialog(notificationData);
        } else {
          console.log(notificationData.additionalData.data);
          this.nav.push(OrdersPage, {
            orderID: notificationData.additionalData.data
          })
        }
      }
    );
    pushObject.on('registration').subscribe(registration => {
      console.log('Device registered', registration);
      this.globalService.Token = registration;
    });
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
      console.error(error);
    });
  }

  showCommentDialog(notificationData) {
    let self = this;
    let optionz = {
      cssClass: 'fixdir'
    };
    let alert = this.alertCtrl.create(optionz);
    alert.setTitle(this.translate.instant('New Order'));
    alert.setMessage(this.translate.instant('You have a new order'));
    alert.addButton(this.translate.instant('Cancel'));
    alert.addButton({
      text: this.translate.instant('View'),
      handler: data => {
        console.log(notificationData);
        console.log(notificationData.additionalData.data);
        this.nav.push(OrdersPage, {
          orderID: notificationData.additionalData.data
        })
      }
    });
    alert.present();
  }
}
