const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES, INVOICE_STATUS } = require("../helper/vars");




exports.GOPA_INVOICE_TO_ACCEPT = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    /*
    let {user_id} = req.params;

    if(!user_id)
        {
            user_id = user.User_ID;
        }
*/
  var loginUrl = process.env.DB_BASE_URL +"invoice/for-gopa-acceptance"; 
 
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




exports.ACCEPT_INVOICE = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

    if(!body.gopa_user_id){
        body.gopa_user_id = user.User_ID;
    }



     



  var loginUrl = process.env.DB_BASE_URL +"invoice/details/"+ body.invoice_id; 
 
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

    
   let invoiceDetails = newJob.data;

   if(invoiceDetails.gopa_user_id)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Invoice has already been assigned to GOPA"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp); 
    }


    invoiceDetails.gopa_user_id = body.gopa_user_id;
    invoiceDetails.dateGopaAccepted = new Date();


  var cartUrl = process.env.DB_BASE_URL +"invoice/update"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  invoiceDetails);
  
  
  
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






exports.GOPA_ACCEPTED_INVOICE = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {gopa_user_id} = req.params;

    if(!gopa_user_id)
        {
            gopa_user_id = user.User_ID;
        }

  var loginUrl = process.env.DB_BASE_URL +"invoice/gopa-accepted-invoices/"+gopa_user_id; 
 
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








exports.INVOICE_DETAILS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {invoice_id} = req.params;

    

  var loginUrl = process.env.DB_BASE_URL +"invoice/details-full/"+invoice_id; 
 
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







exports.INVOICE__ITEM_DETAILS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {item_id} = req.params;

    

  var loginUrl = process.env.DB_BASE_URL +"invoice/item-details-full/"+item_id; 
 
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







exports.RECEIVE_ITEM_FROM_SELLER = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

  



     



  var loginUrl = process.env.DB_BASE_URL +"invoice/item-details/"+ body.item_id; 
 
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

    
   let invoiceDetails = newJob.data;

   if(invoiceDetails.status != 0)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Item status is not pending receival"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp); 
    }


    invoiceDetails.received_by = user.User_ID;
    invoiceDetails.date_received = new Date();
    invoiceDetails.status = INVOICE_STATUS.RECEIVED
    invoiceDetails.statusMessage = "RECEIVED";

  var cartUrl = process.env.DB_BASE_URL +"invoice/update"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  invoiceDetails);
  
  
  
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
