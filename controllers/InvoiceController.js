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








exports.INVOICE__ITEM_DETAILS_QE = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;
    let {qr_value} = req.params;

    

  var loginUrl = process.env.DB_BASE_URL +"invoice/item-details-by-QR/"+qr_value; 
 
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







exports.PENDING_USER_INVOICE = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    let {user_id} = req.params;
    if(!user_id)
        {
            user_id = user.User_ID;
        }



  var loginUrl = process.env.DB_BASE_URL +"invoice/user-invoices/"+user_id+"/0"; 
 
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







exports.INVOICE_HISTORY = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    let {user_id} = req.params;
    if(!user_id)
        {
            user_id = user.User_ID;
        }



  var loginUrl = process.env.DB_BASE_URL +"invoice/user-invoices/"+user_id; 
 
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












exports.PENDING_SELLER_INVOICE = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    let {seller_id} = req.params;
   

  var loginUrl = process.env.DB_BASE_URL +"invoice/seller-invoices/"+seller_id+"/0"; 
 
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




exports.PENDING_RIDER_ACCEPTANCE = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    //let {seller_id} = req.params;
   

  var loginUrl = process.env.DB_BASE_URL +"invoice/invoice-for-rider-to-accept"; 
 
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



exports.SELLER_INVOICE_HISTORY = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    let {seller_id} = req.params;
    


  var loginUrl = process.env.DB_BASE_URL +"invoice/seller-invoices/"+seller_id; 
 
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










exports.SET_ITEMS_FOR_PICKUP = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

    if(!body.user_id){
        body.user_id = user.User_ID;
    }



    let itemIDs = body.items;

     



  var loginUrl = process.env.DB_BASE_URL +"invoice/item-list"; 
 
  let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,itemIDs);


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

    
   let invoice_items = newJob.data;

   const filteredItems = invoice_items.filter(item => item.readyForPickup !== 1);
 
   const updatedItems = filteredItems.map(item => ({
    ...item,
    status: INVOICE_STATUS.READY_TO_BE_PICKED,
    statusMessage: "READY_TO_BE_PICKED",
    readyForPickup: 1
}));


const trackerItems = filteredItems.map(item => ({
    item_id: item.item_id,
    action: "READY FOR PICK UP",
    description: "Item is ready for pickup by delivery agent",
    user_id:  body.user_id
}));









 


  var cartUrl = process.env.DB_BASE_URL +"invoice/bulk-update-item"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  updatedItems);
  
  
  
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
  
  


  var cartUrl = process.env.DB_BASE_URL +"invoice/add-invoice-tracker"; 

  let tracker_response = await UtilityHelper.makeHttpRequest("POST",cartUrl,  trackerItems);
  



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})














exports.SET_ITEMS_FOR_SHIPMENT = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

    if(!body.user_id){
        body.user_id = user.User_ID;
    }



    let itemIDs = body.items;

     



  var loginUrl = process.env.DB_BASE_URL +"invoice/item-list"; 
 
  let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,itemIDs);


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

    
   let invoice_items = newJob.data;

   const filteredItems = invoice_items.filter(item => item.status == INVOICE_STATUS.READY_TO_BE_SHIPPED);
 
   const updatedItems = filteredItems.map(item => ({
    ...item,
    status: INVOICE_STATUS.SHIPPED,
    statusMessage: "SHIPPED"
}));


const trackerItems = filteredItems.map(item => ({
    item_id: item.item_id,
    action: "SHIPPED",
    description: "Item has been shipped",
    user_id:  body.user_id
}));





  var cartUrl = process.env.DB_BASE_URL +"invoice/bulk-update-item"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  updatedItems);
  
  
  
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
  
  


  var cartUrl = process.env.DB_BASE_URL +"invoice/add-invoice-tracker"; 

  let tracker_response = await UtilityHelper.makeHttpRequest("POST",cartUrl,  trackerItems);
  



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})








exports.DELIVER_ITEM_TO_BUYER = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

    if(!body.user_id){
        body.user_id = user.User_ID;
    }



    let itemIDs = body.items;

     



  var loginUrl = process.env.DB_BASE_URL +"invoice/item-list"; 
 
  let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,itemIDs);


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

    
   let invoice_items = newJob.data;

   const filteredItems = invoice_items.filter(item => item.status == INVOICE_STATUS.SHIPPED);
 
   const updatedItems = filteredItems.map(item => ({
    ...item,
    status: INVOICE_STATUS.DELIVERED,
    statusMessage: "DELIVERED"
}));


const trackerItems = filteredItems.map(item => ({
    item_id: item.item_id,
    action: "DELIVERED",
    description: "Item delivered to buyer",
    user_id:  body.user_id
}));





  var cartUrl = process.env.DB_BASE_URL +"invoice/bulk-update-item"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  updatedItems);
  
  
  
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
  
  


  var cartUrl = process.env.DB_BASE_URL +"invoice/add-invoice-tracker"; 

/*
Update the main invoice status
updatedItems
  */

  let tracker_response = await UtilityHelper.makeHttpRequest("POST",cartUrl,  trackerItems);
  



  const uniqueInvoiceIds = [...new Set(updatedItems.map(item => item.invoice_id))];








  var invoice_list_url = process.env.DB_BASE_URL +"invoice/invoice-list-for-completion"; 
 
  let invoice_listResponse = await UtilityHelper.makeHttpRequest("POST",invoice_list_url,uniqueInvoiceIds);


  if(!invoice_listResponse)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }


    if(invoice_listResponse.status == RESPONSE_CODES.SUCCESS){
       
        let invoice_list = invoice_listResponse.data;

        var invUpdateUrl = process.env.DB_BASE_URL +"invoice/bulk-update-invoice"; 

        let invoice_update = await UtilityHelper.makeHttpRequest("POST",invUpdateUrl,  invoice_list);

        
     }



    //invoice_listResponse






   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})









exports.RIDER_ACCEPT_INVOICE = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

    if(!body.user_id){
        body.user_id = user.User_ID;
    }



    let itemIDs = body.items;

     



  var loginUrl = process.env.DB_BASE_URL +"invoice/item-list"; 
 
  let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,itemIDs);


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

    
   let invoice_items = newJob.data;

   const filteredItems = invoice_items.filter(item => item.riderAccepted == 0);
 
   const updatedItems = filteredItems.map(item => ({
    ...item,
    riderAccepted: 1,
    rider_user_id:  body.user_id,
    date_rider_accepted:  new Date()
}));


const trackerItems = filteredItems.map(item => ({
    item_id: item.item_id,
    action: "RIDER ACCEPTED",
    description: "Rider accepted to deliver item",
    user_id:  body.user_id
}));









 


  var cartUrl = process.env.DB_BASE_URL +"invoice/bulk-accept-invoice-item"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  updatedItems);
  
  
  
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
  
  


  var cartUrl = process.env.DB_BASE_URL +"invoice/add-invoice-tracker"; 

  let tracker_response = await UtilityHelper.makeHttpRequest("POST",cartUrl,  trackerItems);
  



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})








exports.RIDER_INVOICES_PINDING_PICKUP = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    let {rider_user_id} = req.params;
    if(!rider_user_id)
        {
            rider_user_id = user.User_ID;
        }



  var loginUrl = process.env.DB_BASE_URL +"invoice/rider-pending-pickup/"+rider_user_id; 
 
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








exports.RIDER_ITEM_TO_BE_SHIPPED = asynHandler(async (req, res, next) => {

  
   
    let {user} = req;

    let {rider_user_id} = req.params;
    if(!rider_user_id)
        {
            rider_user_id = user.User_ID;
        }



  var loginUrl = process.env.DB_BASE_URL +"invoice/rider_items_to_ship/"+rider_user_id; 
 
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









exports.PICK_UP_ITEMS = asynHandler(async (req, res, next) => {

  
   
    let {user, body} = req;

    if(!body.user_id){
        body.user_id = user.User_ID;
    }



    let itemIDs = body.items;

     



  var loginUrl = process.env.DB_BASE_URL +"invoice/item-list"; 
 
  let newJob = await UtilityHelper.makeHttpRequest("POST",loginUrl,itemIDs);


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

    
   let invoice_items = newJob.data;

   const filteredItems = invoice_items.filter(item => item.readyForPickup == 1 && item.riderAccepted == 1 );
 
   //INVOICE_STATUS.READY_TO_BE_SHIPPED

   const updatedItems = filteredItems.map(item => ({
    ...item,
    status: INVOICE_STATUS.READY_TO_BE_SHIPPED,
    statusMessage: "READY_TO_BE_SHIPPED",
    delivered_by:body.user_id ,
    date_delivered:new Date()
}));



const trackerItems = filteredItems.map(item => ({
    item_id: item.item_id,
    action: "PICKED UP ITEM",
    description: "Rider picked item from the seller",
    user_id:  body.user_id
}));









 


  var cartUrl = process.env.DB_BASE_URL +"invoice/bulk-update-item"; 

  let cartResponse = await UtilityHelper.makeHttpRequest("POST",cartUrl,  updatedItems);
  
  
  
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
  
  


  var cartUrl = process.env.DB_BASE_URL +"invoice/add-invoice-tracker"; 

  let tracker_response = await UtilityHelper.makeHttpRequest("POST",cartUrl,  trackerItems);
  



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: cartResponse.data
};


   return UtilityHelper.sendResponse(res, 200, resp.message, resp);

})
