const express = require("express");
const validator = require("./middleware/validation-middleware");
const TransactionServices = require('../services/transaction');
const querystring = require("querystring");
const UpdateResponse = require("./../utils/updateResponse");
const json_encoding = require("./../utils/response-encoding");
const client = require('../redis/redis');
const logger = require('../logger/logger');
const {v4 : uuid} = require('uuid');

const router = express.Router();

const failure = 'failure';
const success = 'success';

router.post("/initiate", validator.nbValidationRules(), validator.nbValidation, (req, res) =>{
    
    // generate transcation id 
    /*
    const transactionID = TransactionServices.generateTransactionID();
    transactionInfo['transactionID'] = transactionID;
    */
    const transactionInfo = req.body;
    const transactionID = transactionInfo.BID;
    
    //add request
    //TransactionServices.setRequestJSON(transactionID, transactionInfo);

    //logger.log('info', JSON.stringify(transactionInfo));

    //Add response...
    const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
    
    //const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
    //TransactionServices.setFailedResponseJSON(transactionID, responseFailureJSON);
    
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(200).render('confirm', {
        transactionID: transactionID
    });
});

router.post("/authenticate", (req, res)=> {
    const { transactionID, authenticate, failure }  = req.body;
    // const transactionInfo = TransactionServices.getFailedResponseJSON(transactionID);
    // const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
    // res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    // if(failure === "failure") {
    //     const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
    //     const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);
    //     return res.redirect(303, transactionInfo['RU']+"?data="+encodedJSON);
    // }

    // const responseSuccessJSON = UpdateResponse.populateResponse(transactionInfo, mode, success);

    // const encodedJSON = json_encoding.encodeJSON(responseSuccessJSON);
    // return res.redirect(303, transactionInfo['RU']+"?data="+encodedJSON);
    //const transactionInfo = TransactionServices.getFailedResponseJSON(transactionID);
    
    client.exists(transactionID, (error, reply) => {
        logger.log('info', reply);
    })
    let transactionInfo = {};
    client.get(transactionID, (error, value) => {
        const request_string = Buffer.from(value, 'base64').toString('ascii');
        transactionInfo = JSON.parse(request_string);

        const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        if(failure === "failure") {
            const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
            //const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);
        
            logger.log('info', JSON.stringify(responseFailureJSON));
            const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);
            return res.redirect(303, transactionInfo['RU']+"?data="+encodedJSON);
        }

        // const responseSuccessJSON = UpdateResponse.populateResponse(transactionInfo, mode, success);
        //TransactionServices.setSuccessResponseJSON(responseSuccessJSON['transactionID'], responseSuccessJSON);
        const responseSuccessJSON = transactionInfo;
        responseSuccessJSON['BID'] = transactionID;
        responseSuccessJSON['status'] = '000';
        logger.log('info', JSON.stringify(responseSuccessJSON));

        const encodedJSON = json_encoding.encodeJSON(responseSuccessJSON);
        return res.redirect(303, transactionInfo['RU']+"?data="+encodedJSON);
    })
    
})

module.exports = router;