const express = require("express");
const router = express.Router();
const upload = require("../middleware/fileMiddleware");

//middleware
const { NoneUserCheck } = require("../middleware/NoneUserMiddleware");
const { VALIDATE_TOKEN } = require("../middleware/UserMiddleware");

//TEST CONTROLLER
const { TestController } = require("../controllers/test");

const {
  ADD_REQUEST,
  ORDER_DETAILS,
  USER_ACTIVE_REQUEST,
  USER_REQUEST_HISTORY,
  GOPA_SELLERS_FOR_BIDDING,
  ASSIGN_TO_SELLERS,
  USER_OFFERS,
} = require("../controllers/RequestController");

const {
  REQUEST_BIDDINGS,
  SELLER_ACTIVE_BIDDINGS,
  SELLER_BIDDINGS_HISTORY,
  GOPA_ACTIVE_ASSIGN_BIDDINGS,
  GOPA_ASSIGN_BIDDING_HISTORY,
  GOPA_ACTIVE_BIDDINGS,
  GOPA_BIDDING_HISTORY,
  ACCEPT_BID,
  UPLOAD_BIDDING_IMAGE,
} = require("../controllers/BiddingController");

const {
  ADD_BID_TO_CART,
  USER_CARTS,
  REMOVE_BID_FROM_CART,
  CHECK_OUT_FROM_CART,
} = require("../controllers/CartController");

const {
  ADD_SERVICE_CHARGE,
  CALCULATE_CHARGES,
} = require("../controllers/ServiceChargeController");

const {
  ADD_WALLET,
  WALLET_DETAILS_BY_WALLET_ID,
  WALLET_DETAILS_BY_WALLET_NUMBER,
  WALLET_DETAILS_BY_USER_ID,
  SYSTEM_WALLET,
} = require("../controllers/WalletController");

const {
  ADD_ADDRESS,
  ADDRESS_DETAILS,
  USER_ADDRESSES,
} = require("../controllers/AddressController");

const {
  GOPA_INVOICE_TO_ACCEPT,
  ACCEPT_INVOICE,
  GOPA_ACCEPTED_INVOICE,
  INVOICE_DETAILS,
  INVOICE__ITEM_DETAILS,
  PENDING_USER_INVOICE,
  INVOICE_HISTORY,
  PENDING_SELLER_INVOICE,
 SELLER_INVOICE_HISTORY,
 SET_ITEMS_FOR_PICKUP,
 PENDING_RIDER_ACCEPTANCE,
 RIDER_ACCEPT_INVOICE,
 PICK_UP_ITEMS,
 RIDER_INVOICES_PINDING_PICKUP,
 INVOICE__ITEM_DETAILS_QE,
 RIDER_ITEM_TO_BE_SHIPPED
} = require("../controllers/InvoiceController");

//test routes link
router.route("/testapi").get(TestController);

//request
router.route("/request/add").post(NoneUserCheck, VALIDATE_TOKEN, ADD_REQUEST);
router
  .route("/request/details/:request_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, ORDER_DETAILS);
router
  .route("/request/user-active-requests")
  .get(NoneUserCheck, VALIDATE_TOKEN, USER_ACTIVE_REQUEST);
router
  .route("/request/user-request-history")
  .get(NoneUserCheck, VALIDATE_TOKEN, USER_REQUEST_HISTORY);
router
  .route("/request/gopa-sellers-for-bidding/:gopa_id/:request_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_SELLERS_FOR_BIDDING);
router
  .route("/request/assign-to-sellers")
  .post(NoneUserCheck, VALIDATE_TOKEN, ASSIGN_TO_SELLERS);
router
  .route("/request/user-offers/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, USER_OFFERS);

//Bidding
router
  .route("/bidding/request-biddings/:request_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, REQUEST_BIDDINGS);
router
  .route("/bidding/seller-active-biddings/:seller_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, SELLER_ACTIVE_BIDDINGS);
router
  .route("/bidding/seller-bidding-history/:seller_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, SELLER_BIDDINGS_HISTORY);
router
  .route("/bidding/gopa-active-assign-bidding/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_ACTIVE_ASSIGN_BIDDINGS);
router
  .route("/bidding/gopa-assign-bidding-history/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_ASSIGN_BIDDING_HISTORY);
router
  .route("/bidding/gopa-active-biddings/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_ACTIVE_BIDDINGS);
router
  .route("/bidding/gopa-bidding-history/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_BIDDING_HISTORY);
router.route("/bidding/accept").post(NoneUserCheck, VALIDATE_TOKEN, ACCEPT_BID);
router
  .route("/bidding/upload-image")
  .post(NoneUserCheck, VALIDATE_TOKEN, UPLOAD_BIDDING_IMAGE);

//cart
router
  .route("/cart/add-bid")
  .post(NoneUserCheck, VALIDATE_TOKEN, ADD_BID_TO_CART);
router
  .route("/cart/check-out")
  .post(NoneUserCheck, VALIDATE_TOKEN, CHECK_OUT_FROM_CART);
router
  .route("/cart/user-carts/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, USER_CARTS);
router
  .route("/cart/remove-bid")
  .post(NoneUserCheck, VALIDATE_TOKEN, REMOVE_BID_FROM_CART);

//Service charge
router
  .route("/service-charge/add")
  .post(NoneUserCheck, VALIDATE_TOKEN, ADD_SERVICE_CHARGE);
router
  .route("/service-charge/user-charges/:aggeagate/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, CALCULATE_CHARGES);

//Wallet services
router.route("/wallet/add").post(NoneUserCheck, VALIDATE_TOKEN, ADD_WALLET);
router
  .route("/wallet/details-by-wallet-id/:walletID")
  .get(NoneUserCheck, VALIDATE_TOKEN, WALLET_DETAILS_BY_WALLET_ID);
router
  .route("/wallet/details-by-wallet-number/:WalletNumber")
  .get(NoneUserCheck, VALIDATE_TOKEN, WALLET_DETAILS_BY_WALLET_NUMBER);
router
  .route("/wallet/details-by-user-id/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, WALLET_DETAILS_BY_USER_ID);
router
  .route("/wallet/system-wallets")
  .get(NoneUserCheck, VALIDATE_TOKEN, SYSTEM_WALLET);

//address services
router.route("/address/add").post(NoneUserCheck, VALIDATE_TOKEN, ADD_ADDRESS);
router
  .route("/address/details-by-id/:address_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, ADDRESS_DETAILS);
router
  .route("/address/user-addresses/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, USER_ADDRESSES);

//Invoice
router
  .route("/invoice/for-gopa-to-accept")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_INVOICE_TO_ACCEPT);
router
  .route("/invoice/accept-invoice")
  .post(NoneUserCheck, VALIDATE_TOKEN, ACCEPT_INVOICE);
router
  .route("/invoice/gopa-accepted-invoice/:gopa_user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, GOPA_ACCEPTED_INVOICE);
router
  .route("/invoice/details/:invoice_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, INVOICE_DETAILS);
router
  .route("/invoice/item-details/:item_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, INVOICE__ITEM_DETAILS);


  router
  .route("/invoice/item-details-by-qr/:qr_value")
  .get(NoneUserCheck, VALIDATE_TOKEN, INVOICE__ITEM_DETAILS_QE);
  
  router
  .route("/invoice/pending-invoice/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, PENDING_USER_INVOICE);

  router
  .route("/invoice/history/:user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, INVOICE_HISTORY);


  router
  .route("/invoice/pending-seller-invoice/:seller_id")
  .get(NoneUserCheck, VALIDATE_TOKEN, PENDING_SELLER_INVOICE);

  router
  .route("/invoice/seller-history/:seller_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, SELLER_INVOICE_HISTORY);

  router
  .route("/invoice/set-item-for-pickup")
  .post(NoneUserCheck, VALIDATE_TOKEN, SET_ITEMS_FOR_PICKUP);


  router
  .route("/invoice/pending-rider-acceptance")
  .get(NoneUserCheck, VALIDATE_TOKEN, PENDING_RIDER_ACCEPTANCE);
  

  router
  .route("/invoice/rider-accept-invoice")
  .post(NoneUserCheck, VALIDATE_TOKEN, RIDER_ACCEPT_INVOICE);

  router
  .route("/invoice/deliver-items-to-rider")
  .post(NoneUserCheck, VALIDATE_TOKEN, PICK_UP_ITEMS);

  


  router
  .route("/invoice/rider-pending-pickup/:rider_user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, RIDER_INVOICES_PINDING_PICKUP);

  
  router
  .route("/invoice/rider_items_to_ship/:rider_user_id?")
  .get(NoneUserCheck, VALIDATE_TOKEN, RIDER_ITEM_TO_BE_SHIPPED);
  
  
module.exports = router;

