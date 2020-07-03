const express = require("express");
const validator = require("./middleware/validation-middleware");
const TransactionServices = require('../services/transaction');
const querystring = require("querystring");
const UpdateResponse = require("./../utils/updateResponse");
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
    //transactionInfo['BID'] = transactionID;
    console.log(transactionID);
    
    //add request
    //TransactionServices.setRequestJSON(transactionID, transactionInfo);

    //logger.log('info', JSON.stringify(transactionInfo));

    //Add response...
    const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
    console.log(mode);
    
    //const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
    //TransactionServices.setFailedResponseJSON(transactionID, responseFailureJSON);
    
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(200).render('confirm', {
        transactionID: transactionID
    });
});

router.post("/authenticate", (req, res)=> {
    const { transactionID, authenticate, failure }  = req.body;
    //const transactionInfo = TransactionServices.getFailedResponseJSON(transactionID);
    console.log(transactionID);
    
    client.exists(transactionID, (error, reply) => {
        logger.log('info', reply);
    })
    let transactionInfo = {};
    client.hgetall(transactionID, (error, value) => {
        //const request_string = Buffer.from(value, 'base64').toString('ascii');
        transactionInfo = JSON.parse(value);
        //const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        if(failure === "failure") {
            const responseFailureJSON = transactionInfo;
            responseFailureJSON['BID'] = transactionID;
            responseFailureJSON['status'] = '001';
            responseFailureJSON['errorDesc'] = 'user declined';
            
            return res.redirect(303, transactionInfo['RU']+"?"+querystring.stringify(responseFailureJSON));
        }

        //const responseSuccessJSON = UpdateResponse.populateResponse(transactionInfo, mode, success);
        //TransactionServices.setSuccessResponseJSON(responseSuccessJSON['transactionID'], responseSuccessJSON);
        const responseSuccessJSON = transactionInfo;
        responseSuccessJSON['BID'] = transactionID;
        responseSuccessJSON['status'] = '000';

        return res.redirect(303, transactionInfo['RU']+"?"+querystring.stringify(responseSuccessJSON));
    })
    
})

module.exports = router;