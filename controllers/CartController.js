const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const PaymentHelper = require("../helper/paymentHelper");
const { REGISTRATION_STATUS, RESPONSE_CODES, INVOICE_STATUS } = require("../helper/vars");
const { v4: uuidv4 } = require('uuid');



exports.ADD_BID_TO_CART = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
     req.body.User_ID = user.User_ID;



  var loginUrl = process.env.DB_BASE_URL +"bidding/details/"+ req.body.bidding_ID; 
 
  let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);


  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }

    
   let bidDetails = newJob.data;

   if(bidDetails.status != 1)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Bid has not been accepted by seller"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp); 
    }





  var cartUrl = process.env.DB_BASE_URL +"cart/add"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  req.body);
  
  
  
  if(!cartResponse)
      {
          var resp = {
              status : RESPONSE_CODES.FAILED,
              message : "Failed to connect to database services"
          };
          return UtilityHelper.sendResponse(res, 200, resp.message, resp);
      }
  
  
  if(cartResponse.status != RESPONSE_CODES.SUCCESS){
  return UtilityHelper.sendResponse(res, 200, cartResponse.message, cartResponse);
  }
  
  






   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})





exports.USER_CARTS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {user_id} = req.params;

    if(!user_id)
        {
            user_id = user.User_ID;
        }

  var loginUrl = process.env.DB_BASE_URL +"cart/full-user-carts/"+user_id; 
 
  let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);


  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }

    

   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: newJob.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})







exports.REMOVE_BID_FROM_CART = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
     let {cart_ID} = req.body;



  var loginUrl = process.env.DB_BASE_URL +"cart/details/"+ cart_ID; 
 
  let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);


  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }

    








   let cartDetails = newJob.data;


   cartDetails.status = 10;



  var cartUrl = process.env.DB_BASE_URL +"cart/add"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  cartDetails);
  
  
  
  if(!cartResponse)
      {
          var resp = {
              status : RESPONSE_CODES.FAILED,
              message : "Failed to connect to database services"
          };
          return UtilityHelper.sendResponse(res, 200, resp.message, resp);
      }
  
  
  if(cartResponse.status != RESPONSE_CODES.SUCCESS){
  return UtilityHelper.sendResponse(res, 200, cartResponse.message, cartResponse);
  }
  
  






   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})





exports.CHECK_OUT_FROM_CART = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;



    if(!body.User_ID)
        {
            body.User_ID = user.User_ID;
        }
 




    if(!body.address_id){
        //new address details added. save address for future transaction

        var locObj = {
            type: "Point",
            coordinates: [body.address.longitude, body.address.latitude]
            }

 let addressReqBody = {
    User_ID: body.User_ID,
    title: body.address.title,
    location: locObj,
    addressDetails: body.address.addressDetails
 }

 var addressURL = process.env.DB_BASE_URL +"address/add"; 

 let newAddressResponse = await UtilityHelper.makeHttpRequest("POST",addressURL, addressReqBody);



 if(!newAddressResponse)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to address database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }
    


    if(newAddressResponse.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newAddressResponse.message, newAddressResponse);
     }

     body.address_id = newAddressResponse.data.address_id;
    }



    //get user invoice and its cart


    let respCharge = await UtilityHelper.UserCharges(body.User_ID,body.aggeagate);



    if(respCharge.status != RESPONSE_CODES.SUCCESS){

        return UtilityHelper.sendResponse(res, 200, respCharge.message, respCharge);
    }
   
  let chargeDetails = respCharge.data;



  //create incoice and invoice items and save it into the database
    let invoice = {
        total_items: chargeDetails.TOTAL_ITEMS,
        total_amount: chargeDetails.MAIN_AMOUNT +  chargeDetails.SERVICE_CHARGE + chargeDetails.DELIVERY_CHARGE + chargeDetails.TAX,
        amount: chargeDetails.MAIN_AMOUNT ,
        service_charge: chargeDetails.DELIVERY_CHARGE,
        delivery_charge:  chargeDetails.DELIVERY_CHARGE,
        tax:  chargeDetails.TAX,
        paymentResponseRefrence: "",
        paymentResponse: {},
        paymentMode: body.paymentDetails.paymentMode,
        paymentNumber:  body.paymentDetails.walletNumber,
        paymentProvider: body.paymentDetails.network,
        statusMessage: "PENDING",
        aggregate: body.aggeagate,
        qr_value: uuidv4(),
        User_ID: body.User_ID,
        address_id:  body.address_id 
    }


    const invoice_items = chargeDetails.CARTS.map(cart => ({
        
        total_items: cart.bid.orderRequest.quantity,
        total_amount: cart.bid.totalPrice,
        statusMessage: "PENDING",
        qr_value: uuidv4(),
        user_id: body.User_ID,
        aggregate: body.aggeagate,
        cart_ID: cart.cart_ID
    }));



     const invoice_body = {
        "invoice": invoice,
        "invoiceItems":invoice_items
     }



     var invoiceUrl = process.env.DB_BASE_URL +"invoice/add-with-items"; 

     let invoiceResponse = await UtilityHelper.makeHttpRequest("POST",invoiceUrl, invoice_body);
    
    
    
     if(!invoiceResponse)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to invoice database services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }
        
    

        if(invoiceResponse.status != RESPONSE_CODES.SUCCESS){

            return UtilityHelper.sendResponse(res, 200, resp.message, invoiceResponse);
        }
       

    const savedItems = invoiceResponse.data.items;
    var savedInvoice = invoiceResponse.data;
    delete savedInvoice.items;
    

     //submit payment request

     let {status, response} = await PaymentHelper.initiatePaymentRequest(savedInvoice);

     savedInvoice.paymentResponseRefrence = response.paymentReference;
     savedInvoice.paymentResponse = response;
     savedInvoice.paymentStatus = status == true ? 1 : INVOICE_STATUS.FAILED 
     savedInvoice.status = status == true ? 0 : INVOICE_STATUS.FAILED 
     savedInvoice.statusMessage = status == true ? "PENDING": "FAILED"

     

     //update invoice with payment details



     var invoiceUpdateURL = process.env.DB_BASE_URL +"invoice/update"; 

     let invoiceUpdateResponse = await UtilityHelper.makeHttpRequest("POST",invoiceUpdateURL, savedInvoice);
    
    
    
     if(!invoiceUpdateResponse)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to invoice update database services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }

        if(invoiceUpdateResponse.status != RESPONSE_CODES.SUCCESS){

            return UtilityHelper.sendResponse(res, 200, invoiceUpdateResponse.message, invoiceUpdateResponse);
        }


        //check if payment failed return failed response to use
        if(status == false){
            //payment failed
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message :response.message
            };
            return UtilityHelper.sendResponse(res, 200, response.message, resp);
        }


        //call background services to distribute transactions and update order request
        PaymentHelper.distributePaymentRevenue(savedInvoice,chargeDetails)


        var resp = {
            status : RESPONSE_CODES.SUCCESS,
            message : "Successful"
        };
        
        
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        
})
