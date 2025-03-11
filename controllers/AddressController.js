const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');




exports.ADD_ADDRESS = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;

    if(!body.User_ID)
        {
            body.User_ID = user.User_ID;
        }
 

  

        var locObj = {
            type: "Point",
            coordinates: [body.longitude, body.latitude]
    }

 let reqBody = {
    User_ID: body.User_ID,
    title: body.title,
    location: locObj,
    addressDetails: body.addressDetails
 }



   var updateURL = process.env.DB_BASE_URL +"address/add"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, reqBody);



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





   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Address added successfully",
    data: requestData
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})





exports.ADDRESS_DETAILS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {address_id} = req.params;

    /*
    if(!user_id)
        {
            user_id = user.User_ID;
        }
        */

  var loginUrl = process.env.DB_BASE_URL +"address/details/"+address_id; 
 
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







exports.USER_ADDRESSES = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {user_id} = req.params;

 
    if(!user_id)
        {
            user_id = user.User_ID;
        }
  

  var loginUrl = process.env.DB_BASE_URL +"address/user-address/"+user_id; 
 
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

