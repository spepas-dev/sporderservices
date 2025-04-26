const { logger } = require("../logs/winston");
const {RESPONSE_CODES } = require("../helper/vars");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const UtilityHelper = require("../helper/utilfunc");

let ussd = {};



ussd.initiatePaymentRequest = async (invoice) => {
    
 
    let pResponse = {
        paymentReference:  uuidv4(),
        paymentStatus: "SUCCESS",
        message: "Payment request successful"
    }

    return {staus: true, response: pResponse}
  };
  

  
ussd.bulkUpdateRequest = async (requests) => {
    console.log("XXXXXXXXX Bulk update request")
 var orderRequestUpdate = process.env.DB_BASE_URL +"order-request/update"; 
 requests.forEach(item => {
     UtilityHelper.makeHttpRequest("POST",orderRequestUpdate, item);
  });
  };


    
ussd.bulkUpdateCarts = async (carts) => {
    console.log("XXXXXXXXX Bulk update request")
 var orderRequestUpdate = process.env.DB_BASE_URL +"cart/add"; 
 carts.forEach(item => {
     let cartObj = item;
     delete cartObj.user;
     delete cartObj.bid;
     cartObj.status = 1;
     UtilityHelper.makeHttpRequest("POST",orderRequestUpdate, cartObj);
  });
  };


ussd.distributePaymentRevenue = async (invoice, chargeObj) => {
    const orderRequest = chargeObj.CARTS.map(cart => ({
        id: cart.bid.orderRequest.id,
        request_ID: cart.bid.orderRequest.request_ID,
        SparePart_ID: cart.bid.orderRequest.SparePart_ID,
        User_ID: cart.bid.orderRequest.User_ID,
        added_by: cart.bid.orderRequest.added_by,
        status: 1,
        require_image: cart.bid.orderRequest.require_image,
        quantity: cart.bid.orderRequest.quantity,
        createdAt : cart.bid.orderRequest.createdAt
    }));

    ussd.bulkUpdateRequest(orderRequest);
    ussd.bulkUpdateCarts( chargeObj.CARTS);



    

    let  pAccountholder =   process.env.PAYMENT_SUSPENSE_ACCOUNT;
    let  walletPoolAccount =   process.env.WALLET_POOL_ACCOUNT;
    
    let pAccountHolderObj = await UtilityHelper.walletDetailsByAccount(pAccountholder);

    let walletPoolAccountObj = await UtilityHelper.walletDetailsByAccount(walletPoolAccount);
 let base_id = uuidv4();

    // credit payment holder suspense by invoice total Amount
    //debit wallet pool account by  invoice total Amount

    pAccountHolderBalBef = pAccountHolderObj.balance;
    walletPoolAccountObjBalBef = walletPoolAccountObj.balance;

    pAccountHolderObj.balance = pAccountHolderObj.balance + invoice.total_amount;
    walletPoolAccountObj.balance = walletPoolAccountObj.balance - invoice.total_amount;

    let transObj = []

    let debitObj = {
        wallet_number: walletPoolAccount,
        is_debit: 1,
        is_credit: 0,
        amount: invoice.total_amount,
        balance_before: walletPoolAccountObjBalBef,
        balance_after:  walletPoolAccountObj.balance,
        base_id: base_id,
        narration: "invoice payment",
        externalRef: invoice.paymentResponseRefrence
    }

    let creditObj = {
        wallet_number: pAccountholder,
        is_debit: 0,
        is_credit: 1,
        amount: invoice.total_amount,
        balance_before: pAccountHolderBalBef,
        balance_after: pAccountHolderObj.balance,
        base_id: base_id,
        narration: "invoice payment",
        externalRef: invoice.paymentResponseRefrence
    }

    transObj.push(debitObj, creditObj)

    var transUrl = process.env.DB_BASE_URL +"transactions/add-many"; 
    let newJob = await UtilityHelper.makeHttpRequest("POST",transUrl, transObj);

    if(newJob)
        {
            //transaction has been saved success fully update respective wallet
            var walletUrl = process.env.DB_BASE_URL +"wallet/update"; 
            UtilityHelper.makeHttpRequest("POST",walletUrl, pAccountHolderObj);
            UtilityHelper.makeHttpRequest("POST",walletUrl, walletPoolAccountObj);  
        }

       

        if(invoice.aggregate == 1)
            {
                //braod cast invoice details to gopa
                //TODO implement gopa broad cast
            }else {
                //broadcast item details to delivers
                //TODO implement broad cast to delivers
            }


  };
  


    
module.exports = ussd