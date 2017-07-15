import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController, NavParams, MenuController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Observable} from "rxjs";
import { Geolocation } from '@ionic-native/geolocation';
import {GlobalService} from "../../Providers/GlobalService";
import {EditHotel} from "../edithotel/edithotel";
import {AddHotel} from "../addhotel/addhotel";
import {Search} from "../search/search";
import {EditBuilding} from "../editbuilding/editbuilding";
import {AddBuilding} from "../addbuilding/addbuilding";
import {TranslateService} from "ng2-translate";
declare var google: any;

@Component({
  selector: 'maps-page',
  templateUrl: 'mapspage.html'
})


export class MapsPage implements OnInit {

  // public destination: string = "";
  public lat;
  public lng;
  public isMapIdle: boolean;
  // public map: google.maps.Map;
  public buildingLocation;
  public LATR: number = 25.295142;
  public LNGR: number = 51.539365;
  public building;
  public PIN_LATR = 25.295142;
  public PIN_LNGR = 51.539365;
  public zoom: number = 17;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController,
              public globalService: GlobalService, public navParams: NavParams, public translate: TranslateService,
              public menuCtrl:MenuController, private geolocation: Geolocation) {
    // this.menuCtrl.enable(false);


  }

  mapClicked(event) {
    this.PIN_LATR = event.coords.lat;
    this.PIN_LNGR = event.coords.lng;
  }


  //
  ngOnInit() {
    // console.log(this.navParams.get('buildingLocation'));
    // this.building = this.navParams.get('buildingLocation');
    // if (this.navParams.get('buildingLocation') == null) {
    //   if (this.globalService.mySearchLat == 0) {
        this.getCurrentLocation();
    //   } else {
    //     this.PIN_LATR = this.globalService.mySearchLat;
    //     this.PIN_LNGR = this.globalService.mySearchLng;
    //     this.LATR = this.globalService.mySearchLat;
    //     this.LNGR = this.globalService.mySearchLng;
    //   }
    // } else {
    //   this.LATR = this.building.Lat;
    //   this.LNGR = this.building.Lang;
    //   this.PIN_LATR = this.building.Lat;
    //   this.PIN_LNGR = this.building.Lang;
    // }
  }

  //
  saveAddress() {
    let confirm = this.alertCtrl.create({
      title: this.translate.instant('Confirmation'),
      message: this.translate.instant('Use this location?'),
      buttons: [
        {
          text: this.translate.instant('No'),
          handler: () => {
          }
        },
        {
          text: this.translate.instant('Yes'),
          handler: () => {
            this.globalService.myMapsLat = this.PIN_LATR;
            this.globalService.myMapsLng = this.PIN_LNGR;
            this.navCtrl.pop();
           
          }
        }
      ]
    });
    confirm.present();
  }


  getCurrentLocation(): any {
    let options = {timeout: 10000, enableHighAccuracy: true};
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('Locating...')
    });
    loading.present();
    this.geolocation.getCurrentPosition(options).then(resp => {
      this.PIN_LATR = resp.coords.latitude;
      this.PIN_LNGR = resp.coords.longitude;
      this.LATR = resp.coords.latitude;
      this.LNGR = resp.coords.longitude;
      loading.dismiss();
      return location;
    }, (err) => {
      loading.dismiss();
      return '';
    })
  }


}
