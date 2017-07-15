import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";
import {IdentifierCodes} from "../../Providers/IdentifierCodes";
import {HomePage} from "../home/home";
import {SMS} from "@ionic-native/sms";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {


  @ViewChild('map') mapElement: ElementRef;
  // @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  orderID;
  orderInfo
    = {
    lat: 0.0,
    mobile: 0,
    name: "Loading..",
    lng: 0.0,
    rate: 0,
    total: 0,
    id: 0,
    delivery_date: "Loading..",
    items: 0,
    distance_in_km: 0.0
  };
  orderStatus = 0;
  origin = {lat: 25.295142, lang: 51.539365};

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
              public globalService: GlobalService, private toastCtrl: ToastController, public loadingCtrl: LoadingController,
              public translate: TranslateService, private codes: IdentifierCodes, private sms: SMS,
              private launchNavigator: LaunchNavigator) {
    this.orderID = this.navParams.get("orderID");
    console.log("Order id is: ", this.orderID);
  }

  ionViewDidLoad() {
    this.loadMap();
    this.getLocation();
    console.log('ionViewDidLoad OrdersPage');
  }

  getLocation() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.origin.lat = resp.coords.latitude;
      this.origin.lang = resp.coords.longitude;
      this.globalService.getOrderDetailsForDelivery(this.origin, this.orderID).subscribe(response => {
        console.log(response);
        if (response.error != null) {
          this.DisplayToast(response.error);
        } else {
          this.orderInfo = response[0];
          this.startNavigating(this.orderInfo.lat, this.orderInfo.lng);
          console.log(this.orderInfo);
        }
        loader.dismissAll();
      }, (err => {
        console.log(err);
        loader.dismissAll();
        this.translate.instant(this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').');
      }));

    }).catch((error) => {
      loader.dismissAll();
      console.log('Error getting location', error);
    });
  }
  navigate(destination){
    
      let options: LaunchNavigatorOptions = {
        start: '',
      };
      this.launchNavigator.navigate(destination, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    }
  acceptOrder() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.acceptOrderForDelivery(this.orderID).subscribe(response => {
      loader.dismissAll();
      console.log(response);
      if (response.error != null) {
        this.DisplayToast(response.error);
      } else {
        this.orderStatus = this.codes.ORDER_DELIVERY_ACCEPTED;
        console.log(response.data);
        this.navigate(response.data.lat+","+response.data.lng);
      }
      
    }, (err => {
      console.log(err);
      loader.dismissAll();
      this.translate.instant(this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').');
    }));
  }

  finalizeOrder() {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.finalizeOrderForDelivery(this.orderID).subscribe(response => {
      console.log(response);
      if (response.error != null) {
        this.DisplayToast(response.error);
      } else {
        this.orderStatus = this.codes.ORDER_DELIVERY_FINALIZED;
        this.navCtrl.setRoot(HomePage);
      }
      loader.dismissAll();
    }, (err => {
      console.log(err);
      loader.dismissAll();
      this.translate.instant(this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').');
    }));
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  textNumber() {
    let options = {
      replaceLineBreaks: true, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // Opens Default sms app
        //intent: '' // Sends sms without opening default sms app
      }
    };
    this.sms.send(String(this.orderInfo.mobile), '\nZanbeil', options);
  }

  whatsNumber() {
    window.open('whatsapp://send?text= \nZanbeil&phone=' + this.orderInfo.mobile);
  }

  loadMap() {
    let latLng = new google.maps.LatLng(25.295142, 51.539365);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  startNavigating(destinationLAT, destinationLNG) {
    let origin = new google.maps.LatLng(this.origin.lat, this.origin.lang);
    let destination = new google.maps.LatLng(destinationLAT, destinationLNG);
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);

    directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }

    });

  }
}
