const { logger } = require("../logs/winston");
const otpGenerator = require('otp-generator');
const {RESPONSE_CODES } = require("../helper/vars");
const {createHash} = require('crypto');
const crypto = require('crypto');
const ldap = require('ldapjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');

let ussd = {};



    ussd.sha256Encrypt = (textPhrase) => {

      //console.log("raw text here: "+ textPhrase)
        const hash = createHash('sha256');
        for (let i = 0; i < textPhrase.length; i++) {
          const rawText = textPhrase[i].trim(); // remove leading/trailing whitespace
          if (rawText === '') continue; // skip empty lines
          hash.write(rawText); // write a single line to the buffer
        }
      
        return hash.digest('base64'); 
     };



     ussd.generateOTP = (length) => {
      const OTP = otpGenerator.generate(length);
      console.log('otp here: ' + OTP);



      if(length == 4)
      {
         return '1234'
      }else{
         return '123456'
      }

     // return OTP;
    };





     ussd.formatPhone = (phone) => {

      console.log("++++++++= phone: "+ phone)
      if(phone.startsWith('0') && phone.length == 10)
      {
        phone = phone.substring(1);
        phone =  "233" + phone;
      }else if(!phone.startsWith('0') && phone.length == 9)
      {
         phone = phone.substring(2);
         phone =  "233" + phone;
      }else if(phone.startsWith('+233'))
      {
         phone = phone.substring(1);
      }else  if(phone.startsWith('2330') && phone.length == 13)
      {
        phone = phone.substring(4);
        phone =  "233" + phone;
      }else  if(phone.startsWith('00233') && phone.length == 14)
      {
        phone = phone.substring(5);
        phone =  "233" + phone;
      }else  if(phone.startsWith('0233') && phone.length == 13)
      {
        phone = phone.substring(4);
        phone =  "233" + phone;
      }else if(phone.startsWith('+'))
      {
         phone = phone.substring(1);
      }
     
      phone = phone.replace(/ /g, '');
        return phone; 
     };





    ussd.formateUser = (userReg) => {

      delete userReg["id"];
      delete userReg["user_id"];
      delete userReg["password"];
      delete userReg["cloudinary_data"];
       
        return userReg; 
     };


     ussd.authenticate  = async (username, password) =>{
      

      /*
      return new Promise((resolve, reject) => {
        // LDAP server details
        const domain = process.env.LDAPDOMAIN;
        const ldapUrl = process.env.LDAPURL;

        // Create the LDAP client
        const client = ldap.createClient({
            url: ldapUrl,
            timeout: 5000,           // 5 seconds timeout for operations
            connectTimeout: 10000    // 10 seconds timeout for connecting
        });

        // Handle client connection errors and timeouts
        client.on('error', (err) => {
            console.error('LDAP client error:', err.message);
            reject('Failed to connect to LDAP server');
        });

        client.on('timeout', () => {
            console.error('LDAP client connection timed out');
            reject('LDAP server connection timed out');
        });

        // Construct the DN (Distinguished Name) for the user
        const domainAndUsername = `${domain}\\${username}`;
        
        // Perform a simple bind (authentication)
        client.bind(domainAndUsername, password, (err) => {
            if (err) {
                console.error('LDAP bind failed:', err.message);
                client.unbind(() => reject('Authentication failed')); // Ensure client unbinds on failure
                return;
            }

            // If bind is successful, search for the user
            const searchOptions = {
                filter: `(SAMAccountName=${username})`,
                scope: 'sub'
            };
            
            client.search('CN=Users,DC=championgh,DC=com', searchOptions, (searchErr, searchRes) => {
                if (searchErr) {
                    console.error('LDAP search failed:', searchErr.message);
                    client.unbind(() => reject('Search failed')); // Ensure client unbinds on failure
                    return;
                }

                searchRes.on('searchEntry', (entry) => {
                    if (entry) {
                        // If user found
                        console.log('User found:', entry.object);
                        client.unbind(() => resolve(true)); // Resolve with true if user is found
                    } else {
                        // If user not found
                        client.unbind(() => resolve(false)); // Resolve with false if user is not found
                    }
                });

                searchRes.on('error', (err) => {
                    console.error('Search error:', err.message);
                    client.unbind(() => reject('Search error')); // Ensure client unbinds on failure
                });

                searchRes.on('end', () => {
                    console.log('Search completed');
                });
            });
        });
    });
*/






      return new Promise((resolve, reject) => {
        // Create the LDAP client with a timeout configuration
        const client = ldap.createClient({
            url: process.env.LDAPURL, // Your LDAP server URL
            timeout: 5000,                // 5 seconds timeout for operations
            connectTimeout: 10000         // 10 seconds timeout for connecting
        });

        // Handle client connection errors and timeouts
        client.on('error', (err) => {
            console.error('LDAP client error:', err.message);
            reject('Failed to connect to LDAP server');
        });

        client.on('timeout', () => {
            console.error('LDAP client connection timed out');
            reject('LDAP server connection timed out');
        });

        // Define the DN (Distinguished Name) for the user
        //const dn = `cn=${username},dc=${process.env.LDAPDOMAIN}`; // Adjust this format as per your LDAP structure

        console.log("client here")
        console.log(dn);
        const dn = `CN=${username},CN=Users,DC=${process.env.LDAPDOMAIN},DC=com`
        // Perform a simple bind (authentication)
        client.bind(dn, password, (err) => {
            if (err) {
                console.error('LDAP bind failed:', err.message);
                reject('Authentication failed');
            } else {
                console.log('LDAP bind successful');
                resolve('Authentication successful');
            }

            // Unbind the client after authentication to free up resources
            client.unbind((unbindErr) => {
                if (unbindErr) {
                    console.error('Failed to unbind client:', unbindErr.message);
                }
            });
        });
    });

  
  }






  ussd.AESEncrypt = (privateString, userkey) => {

    const GCM_IV_LENGTH = 12; // 96-bit IV
  const GCM_TAG_LENGTH = 16; // 128-bit authentication tag

  // Use your 16-byte key (AES-128)
  const key = Buffer.from('KPr42187Bar22999', 'utf-8'); // 16-byte key (128 bits)
  const iv = crypto.randomBytes(GCM_IV_LENGTH); // Generate IV
  
  const cipher = crypto.createCipheriv('aes-128-gcm', key, iv, { authTagLength: GCM_TAG_LENGTH });
  
  let encrypted = cipher.update(privateString, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const tag = cipher.getAuthTag(); // Get the authentication tag
  
  // Combine IV, encrypted message, and authentication tag into one buffer
  const result = Buffer.concat([iv, encrypted, tag]);

  // Convert to Base64 for readability
  return result.toString('base64');
   };








ussd.makeHttpRequest = async (method, url, data = null) => {
    
    try {
        const options = {
          method: method.toUpperCase(),
          url,
          ...(method.toUpperCase() === 'POST' && { data }),
        };
    
        const response = await axios(options);
        return response.data;
      } catch (error) {
        console.error(`Error in ${method} request to ${url}:`, error.message);
        throw error; // Propagate error for further handling
      }


};


ussd.getServiceObj = async (serviceType) => {
    
  try {
    var loginUrl = process.env.DB_BASE_URL +"service-charge/details-by-charge-type/"+serviceType; 
 
    let newJob = await ussd.makeHttpRequest("GET",loginUrl);


    if(!newJob){
      return null;
    }


    if(newJob.status != RESPONSE_CODES.SUCCESS){
      return null;
   }

      return newJob.data;
    } catch (error) {
      console.error(`Error in:`, error.message);
      throw error; // Propagate error for further handling
    }


};




ussd.calculateCharge = async (serviceObj, amountHolder) => {
  if(!serviceObj)
    {
      return null;
    }
  var amount = 0;
  if (serviceObj.flatAmount != 0)
    {
      amount = serviceObj.flatAmount;
    } else if(serviceObj.percentage != 0)
      {
        //there is a percentage calculate charge using percentage
        var baseAmount = amountHolder[serviceObj.percentage_base];

        if(!baseAmount)
          {
            let newServCharge = await ussd.getServiceObj(serviceObj.percentage_base);
            baseAmount = await ussd.calculateCharge(newServCharge,amountHolder) 
          }

          if(!baseAmount){
            return null;
          }
         
          let percDecimal = serviceObj.percentage / 100;

          amount = baseAmount * percDecimal;
      }

      if(serviceObj.minAmnt > 0)
        {
          amount = Math.max(amount, serviceObj.minAmnt)
        }

        if(serviceObj.maxAmount > 0)
          {
            amount =  Math.min(amount, serviceObj.maxAmount);
          }

          return parseFloat(amount.toFixed(2));
}






ussd.sendResponse = (res, code,message, data) => {

    /*
    if(session)
    {
     //there is a session update last update time of session
     let session_id = session.session_id;

     session.date_ended = new Date();
      sessionModel.update(session_id,session );
    }
if(log)
{
//update log here
log.date_ended = new Date();
sessionModel.addLog(log);
}
*/

   data?.status == RESPONSE_CODES.FAILED ? logger.error(message) : logger.info(message)
   res.status(code).json(data)
};








ussd.generateRandomString = (length) => {

  return crypto.randomBytes(length).toString("hex").slice(0, length);
};




ussd.generateWalletNumber = (prefix,id) => {
  return `${prefix}${String(id).padStart(6, "0")}`;
};






ussd.UserCharges = async (user_id, aggeagate) => {
    
  
  var loginUrl = process.env.DB_BASE_URL +"cart/full-user-carts/"+user_id; 
 
  let newJob = await ussd.makeHttpRequest("GET",loginUrl);


  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to database services"
        };
        return resp;
    }

    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return newJob;
     }

     let carts = newJob.data;

     //calculate total amount in cart
     const totalSum = carts.reduce((sum, item) => sum + (item.bid.totalPrice || 0), 0);
     //calculate total items in cart
     const totalCount = carts.reduce((sum, item) => sum + (item.bid.orderRequest.quantity || 0), 0);


     var amountHolder = {
        MAIN_AMOUNT: totalSum
     };

     //calculate service charge
     
     let serviceChargeObj = await ussd.getServiceObj("SERVICE_CHARGE");
     if(!serviceChargeObj)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to retrieve service charge details"
            };
            return resp;
        }

        let serviceCharge  = await ussd.calculateCharge(serviceChargeObj,amountHolder);

        if(!serviceCharge)
            {
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Failed to calculate service charge"
                };
                return resp;
            }

            amountHolder[serviceChargeObj.charge_type] = serviceCharge


     //calculate delivery charge
     let deliveryChargeObj = await ussd.getServiceObj("DELIVERY_CHARGE");
     if(!deliveryChargeObj)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to retrieve delivery charge details"
            };
            return resp;
        }

        let deliverCharge  = await ussd.calculateCharge(deliveryChargeObj,amountHolder);


        if(!deliverCharge)
            {
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Failed to calculate delivery charge"
                };
                return resp;
            }


            if(Number(aggeagate) != 1)
              {
                //calculate delivery charge per bid
                deliverCharge = carts.length * deliverCharge;
              }
            amountHolder[deliveryChargeObj.charge_type] = deliverCharge


     //calculate tax
     let taxChargeObj = await ussd.getServiceObj("TAX");
     if(!taxChargeObj)
        {
            var resp = {
                status : RESPONSE_CODES.FAILED,
                message : "Failed to retrieve tax details"
            };
            return resp;
        }

        let tax  = await ussd.calculateCharge(taxChargeObj,amountHolder);


        if(!tax)
            {
                var resp = {
                    status : RESPONSE_CODES.FAILED,
                    message : "Failed to calculate tax"
                };
                return resp;
            }

            amountHolder[taxChargeObj.charge_type] = tax



            amountHolder["TOTAL_ITEMS"] = totalCount;

            amountHolder["CARTS"] = carts;



   var resp = {
    status : RESPONSE_CODES.SUCCESS,
    message : "Successful",
    data: amountHolder
};

return resp;
};













ussd.verifyTokenRefresh = (token) => {

  try {
    if (!token) {
        throw new Error('No token provided.');
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_REFRESH); // Verifies the token
    return decoded; // Returns the decoded token payload
} catch (error) {
    throw new Error(error.message || 'Invalid or expired token.');
}


};

ussd.verifyToken = (token) => {

  try {
    if (!token) {
        throw new Error('No token provided.');
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Verifies the token
    return decoded; // Returns the decoded token payload
} catch (error) {
    throw new Error(error.message || 'Invalid or expired token.');
}


};





    
module.exports = ussd
