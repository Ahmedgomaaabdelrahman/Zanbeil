import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {TranslateService} from "ng2-translate";
import {Storage} from '@ionic/storage'
import {Platform} from "ionic-angular";
import {BehaviorSubject} from "rxjs";
import {cache} from 'cordova-plugin-cache';

/**
 * Created by zaki on 3/4/17.
 */

@Injectable()
export class GlobalService {
  tempToken = "aadbH0EDLQzhA:APA91bGuwn_M9AlGF4eq7EPc6jN1o0lIhgfQIVOvhzrkBx6WQXFutbnYNr5ivhjkXRiuKSNDAfbeYVSmJCCzzb-QAb2NpBcKqcxGo8IFfHXZhQCSkvYfUSqjDGvMg8PBTeytz8Afe3cc";
  headers = new Headers({'Content-Type': 'application/json'});
  postOptions = new RequestOptions({headers: this.headers, method: "post"});
  deleteOptions = new RequestOptions({headers: this.headers, method: "delete"});
  getOptions = new RequestOptions({headers: this.headers, method: "get"});
  putOptions = new RequestOptions({headers: this.headers, method: "put"});
  public language = 'ar';
  public hypertext = 'http';
  public rootURL = this.hypertext + '://zanbeil.com/public/api/';
  public getProducts_URL = this.rootURL + 'category?lang=';
  public sortProductsAlpha_URL = this.rootURL + 'productSort/alpha?sort=';
  public sortProductsPrice_URL = this.rootURL + 'productSort/price?sort=';
  public addToCart_URL = this.rootURL + 'odetails/cart/add';
  public getCart_URL = this.rootURL + 'odetails/cart/';
  public RecentOrders_URL = "http://zanbeil.com/public/getResentOrders/";
  public PastOrders_URL = "http://zanbeil.com/public/getPastOrders/";
  public RateOrder_URL = "http://zanbeil.com/public/rateOrder/";
  public finalizeCart_URL = "http://zanbeil.com/api/order/cart/confirm";
  public ordersHistory_URL = this.rootURL + 'order/history/';
  public loginURL = this.rootURL + 'login/';
  public registerURL = this.rootURL + 'register/';
  public editURL = "http://zanbeil.com/api/customers/";
  public contactUS_URL = this.rootURL + 'contact/create/';
  public about_URL = this.rootURL + 'about/get?lang=';
  public terms_URL = this.rootURL + 'terms/get?lang=';
  public forgetPasswordURL = this.rootURL + 'forgetpassword/';
  public search_URL = "http://zanbeil.com/public/search?lang=";
  public deleteOrder_URL = "http://zanbeil.com/public/api/order/destroy";
  public getOrderForDelivery_URL = "http://zanbeil.com/api/OrderData/";
  public acceptOrderDelivery_URL = "http://zanbeil.com/api/acceptOrder/";//http://zanbeil.com/public/api/acceptOrder/{id}/{lang}
  public finalizeOrderDelivery_URL = "http://zanbeil.com/api/endOrder/";//http://zanbeil.com/public/api/endOrder/{id}/{lang}
  public logout_URL = "http://zanbeil.com/api/logout";
  public myOrder;


  public countriesURL_ar = this.rootURL + 'country';
  public countriesURL_en = this.rootURL + 'countryenglish';
 
  public addCommentURL_en = this.rootURL + 'comment';
  public getCommentsURL_en = this.rootURL + 'comment/';
  public contactUSURL_en = this.rootURL + 'contact';
  public addFavoritesURL_en = this.rootURL + 'favorite';
  public addFavoritesURL_ar = this.rootURL + 'favorite';
  public getFavoritesURL_en = this.rootURL + 'favoriteEnglish/';
  public getFavoritesURL_ar = this.rootURL + 'favorite/';
 
  public getContactsURL_en = this.rootURL + 'connect';
  public isFavoriteURL_en = this.rootURL + 'isfavourit';
 

  public user: any;
  public loggedIn;
  public OwnerType = '';
  public AqarTypeID = '';
  public PropertiesSequenceCompleted = false;
  public AddressSequenceCompleted = false;
  public DynamicCounter = 10;
  public Area = '';
  
  public PropertiesArray;
  public CountryID = '';
 
  public myAddress = '';
  public myMapsLng = 0;
  public myMapsLat = 0;
  public mySearchAddress = '';
  public mySearchLng = 0;
  public mySearchLat = 0;
  public privateData = new BehaviorSubject('');
  public search = false;
  public cameFrom = '';
  public Token: any = null;
  public Lat = '';
  public Lng = '';
  public pictureFrom = '';
  public SearchModel = {
    OwnerType: '',
    Lang: 0,
    Lat: 0,
    Currentpage: 1
  };


  // "AIzaSyBe5rz086llOyT1gX4LRBEku1JmRlUUlbE" MAPS API KEY
  constructor(private http: Http, public translate: TranslateService, public storage: Storage,
              public platform: Platform) {
    this.platform.ready().then(() => {
      this.getUser().then(data => {
        if (data != null) {
          this.user = JSON.parse(data);
          this.setUser(this.user);
        } else {
          this.privateData.next('loggedOUT');
        }
      })
    });
  }

  getTerms() {
    console.log(this.terms_URL + this.language);
    return this.http.get(this.terms_URL + this.language, this.getOptions)
      .map(res => res.json());
  }

  getAbout() {
    console.log(this.about_URL + this.language);
    return this.http.get(this.about_URL + this.language, this.getOptions)
      .map(res => res.json());
  }

  getProducts() {
    return this.http.get(this.getProducts_URL + this.language, this.getOptions)
      .map(res => res.json());
  }

  sortProductsByAlpha(ASCorDESC) {
    console.log(this.sortProductsAlpha_URL + ASCorDESC + '&lang=' + this.language);
    return this.http.get(this.sortProductsAlpha_URL + ASCorDESC + '&lang=' + this.language, this.getOptions)
      .map(res => res.json());
  }

  sortProductsByPrice(ASCorDESC) {
    console.log(this.sortProductsPrice_URL + ASCorDESC + '&lang=' + this.language);
    return this.http.get(this.sortProductsPrice_URL + ASCorDESC + '&lang=' + this.language, this.getOptions)
      .map(res => res.json());
  }

  getRecentOrders() {
    console.log(this.RecentOrders_URL + this.user.id);
    return this.http.get(this.RecentOrders_URL + this.user.id, this.getOptions)
      .map(res => res.json());
  }

  getPastOrders() {
    console.log(this.PastOrders_URL + this.user.id);
    return this.http.get(this.PastOrders_URL + this.user.id, this.getOptions)
      .map(res => res.json());
  }

  getOrderDetailsForDelivery(latlng, orderID) {
    console.log(latlng, this.getOrderForDelivery_URL + orderID);
    return this.http.post(this.getOrderForDelivery_URL + orderID, latlng, this.postOptions)
      .map(res => res.json());
  }

  acceptOrderForDelivery(orderID) {
    console.log(this.acceptOrderDelivery_URL + orderID + '/' + this.language);
    return this.http.put(this.acceptOrderDelivery_URL + orderID + '/' + this.language,
      JSON.stringify({rep_id: this.user.id}), this.putOptions)
      .map(res => res.json());
  }

  finalizeOrderForDelivery(orderID) {
    console.log(this.finalizeOrderDelivery_URL + orderID + '/' + this.language);
    return this.http.put(this.finalizeOrderDelivery_URL + orderID + '/' + this.language,
      JSON.stringify({rep_id: this.user.id}), this.putOptions)
      .map(res => res.json());
  }

  searchBy(keyword) {
    let keywordobject = {name: keyword, lang: this.language};
    console.log(keywordobject, this.search_URL + this.language);
    return this.http.post(this.search_URL + this.language, keywordobject, this.postOptions)
      .map(res => res.json());
  }

  addToCart(productObject) {
    console.log(this.addToCart_URL);
    return this.http.post(this.addToCart_URL, productObject, this.postOptions)
      .map(res => res.json());
  }

  contactUs(ContactUsModel) {
    return this.http.post(this.contactUS_URL, ContactUsModel, this.getOptions)
      .map(res => res.json());
  }

  deleteOrder(orderID) {
    return this.http.post(this.deleteOrder_URL, JSON.stringify({"id": orderID}), this.getOptions)
      .map(res => res.json());
  }

  rateOrder(orderID, rate) {
    console.log(rate);
    return this.http.put(this.RateOrder_URL + orderID, JSON.stringify({"rate": rate}), this.putOptions)
      .map(res => res.json());
  }


  finalizeCart(cartObject) {
    //   "customer_id": 1,
    //   "address": "Alexandria",
    //   "lat": 24.0154,
    //   "lng": 31.58468,
    //   "delivery_date": 2017,
    //   "payment_method": "visa"
    console.log(this.finalizeCart_URL);
    return this.http.post(this.finalizeCart_URL, cartObject, this.postOptions)
      .map(res => res.json());
  }

  getCart() {
    console.log(this.getCart_URL + ( (this.Token == null) ?
        (        this.tempToken
        )
        :
        (this.Token.registrationId)));


    return this.http.get(this.getCart_URL + ( (this.Token == null) ?
        (this.tempToken
        )
        :
        (this.Token.registrationId)), this.getOptions)
      .map(res => res.json());
  }

  getOrdersHistory() {
    console.log(this.ordersHistory_URL + this.user.id);
    return this.http.get(this.ordersHistory_URL + this.user.id, this.getOptions)
      .map(res => res.json());
  }
  isAqarFavorite(FavoriteModel) {
    return this.http.post(this.language == 'en' ? this.isFavoriteURL_en
      : this.isFavoriteURL_en, FavoriteModel, this.postOptions)
      .map(res => res.json());
  }

  removeFavorites(FavoriteID) {
    return this.http.delete(this.language == 'en' ? this.getFavoritesURL_en + FavoriteID
      : this.getFavoritesURL_en + FavoriteID, this.deleteOptions)
      .map(res => res.json());
  }

  getFavorites() {
    return this.http.get(this.language == 'en' ? this.getFavoritesURL_en + this.user.UserID
      : this.getFavoritesURL_ar + this.user.UserID, this.getOptions)
      .map(res => res.json());
  }

  addToFavorite(FavoriteModel) {
    return this.http.post(this.language == 'en' ? this.addFavoritesURL_en
      : this.addFavoritesURL_ar, FavoriteModel, this.postOptions)
      .map(res => res.json());
  }

  addComment(CommentModel) {
    return this.http.post(this.language == 'en' ? this.addCommentURL_en
      : this.addCommentURL_en, CommentModel, this.postOptions)
      .map(res => res.json());
  }


  forgetPassword(email) {
    return this.http.post(this.forgetPasswordURL + this.language, JSON.stringify({'email': email}), this.postOptions)
      .map(res => res.json());
  }


  getCountries() {
    return this.http.get(this.language == 'en' ? this.countriesURL_en : this.countriesURL_ar, this.getOptions)
      .map(res => res.json());
  }

  EditUser(userObject) {
    console.log(userObject);
    return this.http.put(this.editURL + userObject.id, userObject, this.putOptions)
      .map(res => res.json());
  }

  Register(registerObject) {
    console.log(registerObject);
    return this.http.post(this.registerURL + this.language, registerObject, this.postOptions)
      .map(res => res.json());
  }


  Login(loginObject) {
    console.log(loginObject);
    return this.http.post(this.loginURL + this.language, loginObject, this.postOptions)
      .map(res => res.json());
  }


  postFunctionExample(username: string, email: string, password: string, phone: string, image: string): any {
    let body = JSON.stringify({
      "userid": 1,
      "email": email,
      "password": password,
      "image": image,
      "username": username,
      "phone": phone
    });
    // console.log(body);
    // console.log(image);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, method: "post"});
    return this.http.post("www.google.com/APIcallLINK", body, options)
      .map(res => res.json());
  }


  setUser(user: any) {
    this.loggedIn = true;
    // console.log('Saved logged in!' + this.loggedIn);
    this.storage.set("USERKey", JSON.stringify(user));
    this.user = user;
    this.privateData.next('loggedIN');

  }

  getUser() {
    return this.storage.get("USERKey");
  }

  logout() {
    this.loggedIn = false;
    this.storage.set("USERKey", null);
    this.logoutApi().subscribe(()=>{
        this.user = null;
       });
    this.privateData.next('loggedOUT');
    window.localStorage.clear();
  }
  logoutApi()
  {
    return this.http.post(this.logout_URL, {id:this.user.id,type:this.user.type}, this.postOptions)
      .map(res => res.json());
  }

  setDefaultLang(language) {
    this.language = language;
    this.storage.set("LANGKey", language);
    language == 'en' ? this.english() : this.arabic();
  }

  english() {
    this.language = 'en';
    this.translate.use('en');
    this.platform.setDir('ltr', true);
  }

  arabic() {
    this.language = 'ar';
    this.translate.use('ar');
    // this.platform.setDir('rtl', true);
  }

  getDefaultLang() {
    return this.storage.get("LANGKey");
  }

}
