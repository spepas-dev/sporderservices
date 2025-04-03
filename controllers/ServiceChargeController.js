const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');




exports.ADD_SERVICE_CHARGE = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;


    body.added_by =  user.User_ID;

  
    var loginUrl = process.env.DB_BASE_URL +"service-charge/details-by-charge-type/"+body.charge_type; 
 
    let newJob = await UtilityHelper.makeHttpRequest("GET",loginUrl);

    if(newJob)
        {
          
            if(newJob.status == RESPONSE_CODES.SUCCESS){
                //there is an existing charge type. update the status to 0 meaning its not active
                let oldData = newJob.data;
                oldData.status = 0;
                var updateUrlMain = process.env.DB_BASE_URL +"service-charge/update"; 
                let updateUser = await UtilityHelper.makeHttpRequest("POST",updateUrlMain, oldData);

                if(!updateUser)
                    {
                        var resp = {
                            status : RESPONSE_CODES.FAILED,
                            message : "Unable to update existing charge details"
                        };
                        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
                    }




       if(updateUser.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, updateUser.message, updateUser);
     }



             }


        }


   var updateURL = process.env.DB_BASE_URL +"service-charge/add"; 

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







   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Charge details added successfully",
    data: requestData
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})





exports.CALCULATE_CHARGES = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {user_id, aggeagate} = req.params;

    if(!user_id)
        {
            user_id = user.User_ID;
        }



  let resp = await UtilityHelper.UserCharges(user_id,aggeagate);



   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})
