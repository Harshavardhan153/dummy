const express = require("express");
const validator = require("./middleware/validation-middleware");
const TransactionServices = require('../services/transaction');
const querystring = require("query-string");
const UpdateResponse = require("./../utils/updateResponse");
const json_encoding = require("./../utils/response-encoding");
const client = require('../redis/redis');
const logger = require('../logger/logger');
const {v4 : uuid} = require('uuid');
const Rules = require('./middleware/validation-rules')

const router = express.Router();

const failure = 'failure';
const success = 'success';

router.get("/check", (req, res) => {
    res.send(req.query);
})

router.post("/initiate", validator.nbValidationRules(), validator.nbValidation, (req, res) =>
{
    const transactionInfo = req.body;
    const transactionID = transactionInfo.BID;

    console.log("********generic-rotuter********");
    console.log(req.body);
    console.log("********generic-rotuter********");
   
    const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
    
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(mode.localeCompare('CC') && mode.localeCompare('DC'))
        res.status(200).render('confirm', {
            transactionID: transactionID
        });

    else
        res.status(200).render('confirm_Card', {
            transactionID: transactionID
        });
});


router.post("/authenticate", (req, res) => 
{
    const { transactionID, authenticate, failure }  = req.body;
    
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
            return res.redirect(303, transactionInfo['RU']+"?"+encodedJSON);
        }
        const responseSuccessJSON = transactionInfo;
        responseSuccessJSON['BID'] = transactionID;
        responseSuccessJSON['status'] = '000';
        logger.log('info', JSON.stringify(responseSuccessJSON));

        const encodedJSON = json_encoding.encodeJSON(responseSuccessJSON);
        return res.redirect(303, transactionInfo['RU']+"?"+encodedJSON);
    }) 
})


router.post("/authenticateCard", (req, res) => 
{
    const { transactionID, OTP }  = req.body;
    
    client.exists(transactionID, (error, reply) => {
        logger.log('info', reply);
    })
    let transactionInfo = {};
    client.get(transactionID, (error, value) => {
        const request_string = Buffer.from(value, 'base64').toString('ascii');
        transactionInfo = JSON.parse(request_string);

        const mode = Buffer.from(transactionInfo['mode'], 'base64').toString('ascii');
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        if(!Rules.OTPcheck(OTP)) {
            const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
        
            logger.log('info', JSON.stringify(responseFailureJSON));
            const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);
            return res.redirect(303, transactionInfo['RU']+"?"+encodedJSON);
        }
        res.status(200).render('confirm', {
            transactionID: transactionID
        });
    }) 
})

module.exports = router;