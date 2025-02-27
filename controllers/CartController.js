const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");



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
