const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.REQUEST_BIDDINGS = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { request_id } = req.params;

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/request-biddings/" + request_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.SELLER_ACTIVE_BIDDINGS = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { seller_id } = req.params;

  if (!seller_id) {
    if (!user.Seller_ID) {
      var resp = {
        status: RESPONSE_CODES.FAILED,
        message: "Provide seller ID",
      };
      return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    seller_id = user.Seller_ID;
  }

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/seller-active-biddings/" + seller_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.SELLER_BIDDINGS_HISTORY = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { seller_id } = req.params;

  if (!seller_id) {
    if (!user.Seller_ID) {
      var resp = {
        status: RESPONSE_CODES.FAILED,
        message: "Provide seller ID",
      };
      return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    seller_id = user.Seller_ID;
  }

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/seller-bidding-history/" + seller_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.GOPA_ACTIVE_ASSIGN_BIDDINGS = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { user_id } = req.params;

  if (!user_id) {
    user_id = user.User_ID;
  }

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/gopa-active-assign-bidding/" + user_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.GOPA_ASSIGN_BIDDING_HISTORY = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { user_id } = req.params;

  if (!user_id) {
    user_id = user.User_ID;
  }

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/gopa-assign-bidding-history/" + user_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.GOPA_ACTIVE_BIDDINGS = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { user_id } = req.params;

  if (!user_id) {
    user_id = user.User_ID;
  }

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/gopa-active-biddings/" + user_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.GOPA_BIDDING_HISTORY = asynHandler(async (req, res, next) => {
  let { user } = req;
  let { user_id } = req.params;

  if (!user_id) {
    user_id = user.User_ID;
  }

  var loginUrl =
    process.env.DB_BASE_URL + "bidding/gopa-biddings-history/" + user_id;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: newJob.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.ACCEPT_BID = asynHandler(async (req, res, next) => {
  let { user, body } = req;

  var loginUrl = process.env.DB_BASE_URL + "bidding/details/" + body.bidding_ID;

  let newJob = await UtilityHelper.makeHttpRequest("GET", loginUrl);

  if (!newJob) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (newJob.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
  }

  let bidDetails = newJob.data;

  bidDetails.price = body.price;
  bidDetails.accepted_by = user.User_ID;
  bidDetails.date_accepted = new Date();
  bidDetails.unitPrice = body.unitPrice;
  bidDetails.totalPrice = body.totalPrice;
  bidDetails.discount = body.discount;
  bidDetails.status = 1;

  var biddingUrl = process.env.DB_BASE_URL + "bidding/update";

  let biddingResponse = await UtilityHelper.makeHttpRequest(
    "POST",
    biddingUrl,
    bidDetails
  );

  if (!biddingResponse) {
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Failed to connect to database services",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }

  if (biddingResponse.status != RESPONSE_CODES.SUCCESS) {
    return UtilityHelper.sendResponse(
      res,
      200,
      biddingResponse.message,
      biddingResponse
    );
  }

  var ReqDetailsURL =
    process.env.DB_BASE_URL +
    "order-request/full-details/" +
    bidDetails.request_ID;

  let reqResp = await UtilityHelper.makeHttpRequest("GET", ReqDetailsURL);

  if (reqResp) {
    if (reqResp.status == RESPONSE_CODES.SUCCESS) {
      let orderReqDetails = reqResp.data;
      //TODO Generate notification message and send it to requester
      let requester = orderReqDetails.requester;
    }
  }

  var resp = {
    status: RESPONSE_CODES.SUCCESS,
    message: "Successful",
    data: biddingResponse.data,
  };

  return UtilityHelper.sendResponse(res, 200, resp.message, resp);
});

exports.UPLOAD_BIDDING_IMAGE = asynHandler(async (req, res, next) => {
  //TODO Add added by to gopa registration
  //TODO Validate file to only accept PDF

  let { user, body } = req;
  let bidding_ID = body.bidding_ID;

  try {
    let deliverDetails = {
      bidding_ID: bidding_ID,
      image_url: body.result.secure_url,
      image_ob: body.result,
    };

    var updateURL = process.env.DB_BASE_URL + "bidding/add-image";

    let sellerRespObj = await UtilityHelper.makeHttpRequest(
      "POST",
      updateURL,
      deliverDetails
    );

    if (!sellerRespObj) {
      var resp = {
        status: RESPONSE_CODES.FAILED,
        message: "Failed to connect to database services",
      };
      return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }

    if (sellerRespObj.status != RESPONSE_CODES.SUCCESS) {
      return UtilityHelper.sendResponse(
        res,
        200,
        sellerRespObj.message,
        sellerRespObj
      );
    }

    var resp = {
      status: RESPONSE_CODES.SUCCESS,
      message: "image uploaded",
      data: sellerRespObj.data,
    };

    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  } catch (error) {
    console.error(error);
    console.log(error);
    var resp = {
      status: RESPONSE_CODES.FAILED,
      message: "Unkown error",
    };
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
  }
});
