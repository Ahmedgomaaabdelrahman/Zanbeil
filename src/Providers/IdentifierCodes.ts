import {Injectable} from "@angular/core";
/**
 * Created by zaki on 4/13/17.
 */

@Injectable()
export class IdentifierCodes {

  PARAM_LOGIN_ADD_TO_CART = 1;

  //User types codes
  USER_TYPE_ADMIN = 0;
  USER_TYPE_CLIENT = 1;
  USER_TYPE_SELLER = 2;
  USER_TYPE_DELIVERY = 3;
  LOGIN_CHECKOUT = 1;

  iOS = 2;
  Android = 1;

  ORDER_DELIVERY_PENDING = 0;
  ORDER_DELIVERY_ACCEPTED = 1;
  ORDER_DELIVERY_FINALIZED = 2;

}
