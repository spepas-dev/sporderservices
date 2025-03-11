const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');





exports.ADD_WALLET = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;
    body.WalletNumber =  UtilityHelper.generateRandomString(20);

  


   var updateURL = process.env.DB_BASE_URL +"wallet/add"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, body);



   if(!newUserUpdate)
       {
           var resp = {
               status : RESPONSE_CODES.FAILED,
               message : "Failed to connect to database services"
           };
           return UtilityHelper.sendResponse(res, 200, resp.message, resp);
       }



       if(newUserUpdate.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, newUserUpdate.message, newUserUpdate);
        }

      let requestData = newUserUpdate.data;


      requestData.WalletNumber =  UtilityHelper.generateWalletNumber("S",requestData.id);


      var updateWalletURL = process.env.DB_BASE_URL +"wallet/update"; 

      let walletUpdate = await UtilityHelper.makeHttpRequest("POST",updateWalletURL, requestData);
   

      if(!walletUpdate)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to database services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }


        if(walletUpdate.status != RESPONSE_CODES.SUCCESS){
            return UtilityHelper.sendResponse(res, 200, walletUpdate.message, walletUpdate);
         }
 
 



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Wallet added successfully",
    data: walletUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})




exports.WALLET_DETAILS_BY_WALLET_ID = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {walletID} = req.params;

    /*
    if(!user_id)
        {
            user_id = user.User_ID;
        }
        */


        var loginUrl = process.env.DB_BASE_URL +"wallet/details-by-id/"+walletID; 
 
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






exports.WALLET_DETAILS_BY_WALLET_NUMBER = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {WalletNumber} = req.params;

    /*
    if(!user_id)
        {
            user_id = user.User_ID;
        }
        */


        var loginUrl = process.env.DB_BASE_URL +"wallet/details-by-wallet-number/"+WalletNumber; 
 
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



exports.WALLET_DETAILS_BY_USER_ID= asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {user_id} = req.params;

    
    if(!user_id)
        {
            user_id = user.User_ID;
        }
      


        var loginUrl = process.env.DB_BASE_URL +"wallet/details-by-user-id/"+user_id; 
 
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







exports.SYSTEM_WALLET = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

  

        var loginUrl = process.env.DB_BASE_URL +"wallet/system-wallets"; 
 
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


