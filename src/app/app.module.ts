import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {LocationPage} from '../pages/location/location';
import {PaymentPage} from '../pages/payment/payment';
import {AdditemPage} from '../pages/additem/additem';
import {LoginPage} from '../pages/login/login';
import {SettingsPage} from '../pages/settings/settings';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from "ng2-translate";
import {GlobalService} from "../Providers/GlobalService";
import {HttpModule, Http} from "@angular/http";
import {IonicStorageModule} from "@ionic/storage";
import {DetailsPage} from "../pages/details/details";
import {LangPage} from "../pages/lang/lang";
import {SignupPage} from "../pages/signup/signup";
import {IdentifierCodes} from "../Providers/IdentifierCodes";
import {AgmCoreModule} from "angular2-google-maps/core";
import {MapsPage} from "../pages/maps-page/mapspage";
import { Geolocation } from '@ionic-native/geolocation';
import {About} from "../pages/about/about";
import {Terms} from "../pages/terms/terms";
import {Contact} from "../pages/contact/contact";
import {Search} from "../pages/search/search";
import {Push} from "@ionic-native/push";
import {OrdersPage} from "../pages/orders/orders";
import {HistoryPage} from "../pages/history/history";
import {SMS} from "@ionic-native/sms";
import { LaunchNavigator } from '@ionic-native/launch-navigator';


export function TranslateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AdditemPage,
    LocationPage,
    PaymentPage,
    SettingsPage,
    DetailsPage,
    LangPage,
    SignupPage,
    MapsPage,
    About,
    Terms,
    Contact,
    Search,
    OrdersPage,
    HistoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: ''}),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: TranslateLoaderFactory,
      deps: [Http]
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCEESwYcn8OVFrRvfbjtxm0OTxXy1lNX1U'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AdditemPage,
    LocationPage,
    PaymentPage,
    SettingsPage,
    DetailsPage,
    LangPage,
    SignupPage,
    MapsPage,
    About,
    Terms,
    Contact,
    Search,
    OrdersPage,
    HistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalService,
    IdentifierCodes,
    Geolocation,
    Push,
    SMS,
    LaunchNavigator
  ]
})
export class AppModule {
}
