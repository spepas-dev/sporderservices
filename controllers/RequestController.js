const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");





exports.ADD_REQUEST = asynHandler(async (req, res, next) => {


   
    let {body,user} = req;


    //check if sparePart_ID exist
    if(!body.SparePart_ID){
        //there is no spare part ID create a temporary Spare part for the request
        if(!body.sparePartDetail)
            {
                //there is no spare part ID and there is no spare part details. Fail request
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Spare part details missing"
                };
                return UtilityHelper.sendResponse(res, 200, resp.message, resp);
            }


       var singleSparePartObj =  {
        status : 0, //these shows is a temporal spare part added by users and its only usable for request unless it has been verified
        name: body.sparePartDetail.name,
        carModel_ID:  body.sparePartDetail.carModel_ID,
        description: body.sparePartDetail.description
       }



   var sparePartURL = process.env.DB_BASE_URL +"product/add-spare-part_single"; 

   let sparePartResponse = await UtilityHelper.makeHttpRequest("POST",sparePartURL, singleSparePartObj);

   if(!sparePartResponse)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }





       if(sparePartResponse.status != RESPONSE_CODES.SUCCESS){
           return UtilityHelper.sendResponse(res, 200, sparePartResponse.message, sparePartResponse);
        }

        body.SparePart_ID = sparePartResponse.data.SparePart_ID;


    }else{
        //get spare part details

        var SpDetailsURL = process.env.DB_BASE_URL +"product/spare-part-details/"+body.SparePart_ID; 

        let sparePartDetResp = await UtilityHelper.makeHttpRequest("GET",SpDetailsURL);

        if(!sparePartDetResp)
            {
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Failed to connect to database services"
                };
                return UtilityHelper.sendResponse(res, 200, resp.message, resp);
            }


       if(sparePartDetResp.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, sparePartDetResp.message, sparePartDetResp);
     }
     body.sparePartDetail = sparePartDetResp.data;


    }


    body.added_by =  user.User_ID;

    if(!body.User_ID){
        body.User_ID =  user.User_ID;
    }

    var requestBody = {
        SparePart_ID: body.SparePart_ID,
        User_ID: body.User_ID,
        require_image: body.require_image,
        added_by: body.added_by,
        quantity: body.quantity
    }






   var updateURL = process.env.DB_BASE_URL +"order-request/add"; 

   let newUserUpdate = await UtilityHelper.makeHttpRequest("POST",updateURL, requestBody);



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

   //request has been created
   //Pull all Gopa and Sellers from the system


   var gopaMopaUrl = process.env.DB_BASE_URL +"/user/gopa_sellers"; 

   let userListResponse = await UtilityHelper.makeHttpRequest("GET",gopaMopaUrl);

   if(userListResponse)
    {
        if(userListResponse.status == RESPONSE_CODES.SUCCESS){
            //process the user list
            userList = userListResponse.data;
            const messages = [];
            const biddings = [];

            // Loop through the JSON list
       userList.forEach((user) => {
    // Add to messages
   // messages.push(`Name: ${user.name}, User Type: ${user.user_type}`);

   var notificationObj = {
        message : "Hello "+user.name+" Kindly find below details of request to for bidding\nName: " +body.sparePartDetail.name+"\nQuantity: "+body.quantity+"\n Kindly log in into spare part application to bid",
        subjectL: "New Request for bidding",
        phoneNum: user.phoneNumber
   }
   messages.push(notificationObj);
         if(user.sellerDetails)
            {
                //notification should go to a seller direct
                var bidObj = {
                    request_ID: requestData.request_ID,
                    Seller_ID: user.sellerDetails.Seller_ID
                }
                biddings.push(bidObj);

               

            }else if(user.gopa){
                //send notification to gopa for their items to be added
                var bidObj = {
                    request_ID: requestData.request_ID,
                    gopa_user_ID: user.User_ID
                }
                biddings.push(bidObj);

            }

  });



  //biddings

    //TODO Send generated message via SMS and email

      
   var biddingUrl = process.env.DB_BASE_URL +"bidding/add"; 

   let biddingResponse = await UtilityHelper.makeHttpRequest("POST",biddingUrl, biddings);

        }


    }







   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Request created successfully",
    data: newUserUpdate.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})





exports.ORDER_DETAILS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {request_id} = req.params;



  var loginUrl = process.env.DB_BASE_URL +"order-request/full-details/"+request_id; 
 
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






exports.USER_ACTIVE_REQUEST = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    //let {request_id} = req.params;



  var loginUrl = process.env.DB_BASE_URL +"order-request/user-active-requests/"+user.User_ID; 
 
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





exports.USER_REQUEST_HISTORY = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    //let {request_id} = req.params;



  var loginUrl = process.env.DB_BASE_URL +"order-request/user-requests-history/"+user.User_ID; 
 
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




exports.GOPA_SELLERS_FOR_BIDDING = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {gopa_id,request_id} = req.params;



  var loginUrl = process.env.DB_BASE_URL +"order-request/gopa-sellers-for-bidding/"+gopa_id+"/"+request_id; 
 
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









exports.ASSIGN_TO_SELLERS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {sellerIDs,request_id} = req.body;




    //retrieve list of users based on selected seller ids
  var sellerUrl = process.env.DB_BASE_URL +"user/users-by-sellers"; 
 
  let sellerObj = await UtilityHelper.makeHttpRequest("POST",sellerUrl, sellerIDs);


  if(!sellerObj)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if(sellerObj.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, sellerObj.message, sellerObj);
     }


    let userList = sellerObj.data
   
    



    //retrieve details of request

    var ReqDetailsURL = process.env.DB_BASE_URL +"order-request/full-details/"+request_id; 

    let reqResp = await UtilityHelper.makeHttpRequest("GET",ReqDetailsURL);

    if(!reqResp)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to connect to database services"
            };
            return UtilityHelper.sendResponse(res, 200, resp.message, resp);
        }


   if(reqResp.status != RESPONSE_CODES.SUCCESS){
    return UtilityHelper.sendResponse(res, 200, reqResp.message, reqResp);
 }
 let orderReqDetails = reqResp.data;



//genrate Binding list
const biddings = [];
const messages = [];

// Loop through the JSON list
userList.forEach((oneUser) => {
// Add to messages
// messages.push(`Name: ${user.name}, User Type: ${user.user_type}`);

var notificationObj = {
message : "Hello "+oneUser.name+" Kindly find below details of request to for bidding\nName: " +orderReqDetails.sparePart.name+"\nQuantity: "+orderReqDetails.quantity+"\n Kindly log in into spare part application to bid",
subjectL: "New Request for bidding",
phoneNum: oneUser.phoneNumber
}
messages.push(notificationObj);

//TODO Add condition which will filter out duplicate Seller ID. For sellers with multiple users same request can be created multiple times by seller
var bidObj = {
    request_ID: orderReqDetails.request_ID,
    Seller_ID: oneUser.sellerDetails.Seller_ID,
    assigned_by: user.User_ID,
    date_assigned: new Date()
}
biddings.push(bidObj);



});



//biddings

//TODO Send generated message via SMS and email


var biddingUrl = process.env.DB_BASE_URL +"bidding/add"; 

let biddingResponse = await UtilityHelper.makeHttpRequest("POST",biddingUrl, biddings);



if(!biddingResponse)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }


if(biddingResponse.status != RESPONSE_CODES.SUCCESS){
return UtilityHelper.sendResponse(res, 200, biddingResponse.message, biddingResponse);
}




   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: ""
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})






exports.USER_OFFERS = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {user_id} = req.params;

    if(!user_id)
        {
            user_id = user.User_ID;
        }



  var loginUrl = process.env.DB_BASE_URL +"order-request/user-request-offers/"+user_id; 
 
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
