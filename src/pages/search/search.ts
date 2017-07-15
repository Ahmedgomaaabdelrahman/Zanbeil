import {Component, ViewChild} from '@angular/core';
import {AlertController, Slides, Platform, NavParams, ViewController} from 'ionic-angular';
import {NavController, LoadingController, ToastController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {SettingsPage} from '../settings/settings';
import {DetailsPage} from "../details/details";
import {AdditemPage} from "../additem/additem";
import {GlobalService} from "../../Providers/GlobalService";
import {TranslateService} from "ng2-translate";
import {SignupPage} from "../signup/signup";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'

})
export class Search {
  Categories;
  grid = true;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private globalService: GlobalService,
              public translate: TranslateService, public loadingCtrl: LoadingController, private toastCtrl: ToastController,
              private plt: Platform, private navParam: NavParams, private viewCtrl:ViewController) {

    this.productsResponse = navParam.get('search');
    this.Categories = this.productsResponse[0].name_ar;

  }
  ionViewWillEnter(){
    this.viewCtrl.showBackButton(true);

  }
  productsResponse;
  @ViewChild(Slides) slides: Slides;

  debugThis(product) {
    console.log(product);
  }

  switchView() {
    this.grid = !this.grid;
    console.log(this.grid);
  }

  firstime = true;

  getProducts() {
    let loader = this.loadingCtrl.create();
    loader.present();
    if (this.firstime)
      this.globalService.getDefaultLang()
        .then(
          data => {
            if (data == "ar") {
              this.globalService.arabic();
            } else if (data == "en") {
              this.globalService.english();
            } else {
              this.globalService.setDefaultLang('ar');
            }
            this.firstime = false;
            this.globalService.getProducts().subscribe((response => {
              console.log(response);
              loader.dismissAll();
              if (response != null) {
                if (response.error != null) {
                  let toast = this.toastCtrl.create({
                    message: response.error,
                    duration: 4000,
                  });
                  toast.present();
                } else {
                  if (response.length > 0) {
                    this.productsResponse = response;
                    this.Categories = response[0].name_ar;
                  }
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
        );
    else {
      this.globalService.getProducts().subscribe((response => {
        console.log(response);
        loader.dismissAll();
        if (response != null) {
          if (response.error != null) {
            let toast = this.toastCtrl.create({
              message: response.error,
              duration: 4000,
            });
            toast.present();
          } else {
            if (response.length > 0) {
              this.productsResponse = response;
              this.Categories = response[0].name_ar;
            }
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
  }


  addToCart(event, product) {
    event.stopPropagation();
    console.log(this.globalService.user);
    if (this.globalService.loggedIn) {
      let loader = this.loadingCtrl.create();
      loader.present();
      let productObject = {
        customer_id: this.globalService.user.id,
        product_id: product.id,
        quantity: 1,
        measure_id: product.measure_uint[0].id
      };
      console.log(productObject);
      this.globalService.addToCart(productObject).subscribe(response => {
        loader.dismissAll();

        console.log(response);
      }, (err => {
        // console.log(err);
        loader.dismissAll();
        let toast = this.toastCtrl.create({
          message: this.translate.instant('Something went wrong, please try again later.') + ' (' + err.status + ').',
          duration: 3000
        });
        toast.present();
      }));
    } else {
      this.DisplayToast(this.translate.instant("Please log in first!"));
      this.navCtrl.setRoot(LoginPage);
    }

  }

  searchDialog() {
    let optionz = {
      cssClass: 'fixdir'
    };
    let alert = this.alertCtrl.create(optionz);
    alert.setTitle(this.translate.instant('Search'));
    alert.addInput({
      type: 'text',
      label: this.translate.instant('Search'),
      placeholder: this.translate.instant('Search keyword'),
    });

    alert.addButton(this.translate.instant('Cancel'));
    alert.addButton({
      text: this.translate.instant('Search'),
      handler: data => {
        console.log(data[0]);
        this.search(data[0]);
      }
    });
    alert.present();
  }

  search(keyword) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.searchBy(keyword).subscribe((response => {
      console.log(response);
      loader.dismissAll();
      if (response != null) {
        if (response.error != null) {
          let toast = this.toastCtrl.create({
            message: response.error,
            duration: 4000,
          });
          toast.present();
        } else {
          if (response.length > 0) {
            this.productsResponse = response;
            this.Categories = response[0].name_ar;
          } else {
            this.DisplayToast(this.translate.instant('No results were found matching your search criteria'));
          }
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

  sortDialog() {
    let optionz = {
      cssClass: 'fixdir'
    };
    let alert = this.alertCtrl.create(optionz);
    alert.setTitle(this.translate.instant('Sort By'));
    alert.addInput({
      type: 'radio',
      label: this.translate.instant('Lowest price first'),
      value: 'cheap',
    });
    alert.addInput({
      type: 'radio',
      label: this.translate.instant('Highest price first'),
      value: 'expensive',
    });
    alert.addInput({
      type: 'radio',
      label: this.translate.instant('Alphabetically A-Z'),
      value: 'az',
    });
    alert.addInput({
      type: 'radio',
      label: this.translate.instant('Alphabetically Z-A'),
      value: 'za',
    });

    alert.addButton(this.translate.instant('Cancel'));
    alert.addButton({
      text: this.translate.instant('Sort'),
      handler: data => {
        this.sortResult(data);
      }
    });
    alert.present();
  }

  sortByPrice(ASCorDESC) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.sortProductsByPrice(ASCorDESC).subscribe((response => {
      console.log(response);
      loader.dismissAll();
      if (response != null) {
        if (response.error != null) {
          let toast = this.toastCtrl.create({
            message: response.error,
            duration: 4000,
          });
          toast.present();
        } else {
          if (response.length > 0) {
            this.productsResponse = response;
            this.Categories = response[0].name_ar;
          }
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


  sortByAlpha(ASCorDESC) {
    let loader = this.loadingCtrl.create();
    loader.present();
    this.globalService.sortProductsByPrice(ASCorDESC).subscribe((response => {
      console.log(response);
      loader.dismissAll();
      if (response != null) {
        if (response.error != null) {
          let toast = this.toastCtrl.create({
            message: response.error,
            duration: 4000,
          });
          toast.present();
        } else {
          if (response.length > 0) {
            this.productsResponse = response;
            this.Categories = response[0].name_ar;
          }
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

  sortResult(sortBy) {
    if (sortBy == 'cheap') {
      //asc
      this.sortByPrice('asc');
    } else if (sortBy == 'expensive') {
      //desc
      this.sortByPrice('desc');
    } else if (sortBy == 'az') {
      //asc
      this.sortByAlpha('asc');
    } else if (sortBy == 'za') {
      //desc
      this.sortByAlpha('desc');
    }
  }

  DisplayToast(ErrorMessage) {
    let toast = this.toastCtrl.create({
      message: ErrorMessage,
      duration: 3000
    });
    toast.present();
  }

  gotoLogin(event) {
    event.stopPropagation();
    this.navCtrl.push(LoginPage);
  }

  navItemDetails(product) {
    this.navCtrl.push(DetailsPage, {
      product: product
    });
  }

  gotosettings() {
    this.navCtrl.push(SettingsPage);
  }

  slideChanged() {
    if (this.slides.getActiveIndex() < this.productsResponse.length)
      this.Categories = this.productsResponse[this.slides.getActiveIndex()].name_ar;
  }

  showRadio(product) {

    console.log(this.productsResponse);
    console.log(product);
    let alertOption = {
      cssClass: 'fixdir'
    };
    let alert = this.alertCtrl.create(alertOption);
    alert.setTitle('Enter Quantity');
    for (let i = 0; i < product.measure_uint.length; i++) {
      alert.addInput({
        type: 'radio',
        label: product.measure_uint[i].name_ar,
        value: product.measure_uint[i],
        checked: i == 0
      });
    }
    alert.addButton(this.translate.instant('Cancel'));
    alert.addButton({
      text: this.translate.instant('OK'),
      handler: pickedUnit => {
        this.reArrangeArray(product, pickedUnit);
      }
    });
    alert.present();
  }

  reArrangeArray(product, pickedUnit) {
    if (product.measure_uint.length > 1) { //Preserve processing power
      let pickedUnitIndex = 0;
      let tempUnitIndex = 0;
      product.measure_uint.forEach((object, index) => {
        if (object.id == pickedUnit.id) {
          pickedUnitIndex = index;
        }
      });
      let tmp = product.measure_uint[tempUnitIndex];
      product.measure_uint[tempUnitIndex] = product.measure_uint[pickedUnitIndex];
      product.measure_uint[pickedUnitIndex] = tmp;
      console.log(this.productsResponse);
    }
  }

  gotolog() {
    if (!this.globalService.loggedIn)
      this.navCtrl.push(LoginPage);
    else
      this.navCtrl.push(SignupPage, {
        edit: true
      })

  }

  gotodetails() {
    this.navCtrl.push(DetailsPage);
  }

  gotocart() {
    this.navCtrl.push(AdditemPage);
  }

}

