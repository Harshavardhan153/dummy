const {body, validationResult} = require("express-validator");
const TranscationServices = require("./../../services/transaction");
const UpdateResponse = require("./../../utils/updateResponse");
const {v4:uuid} = require('uuid');

const client = require('../../redis/redis');
const logger = require('../../logger/logger');

const path = require("path");
const { ROOT_DIR } = require("../../utils/path");
const fs = require('fs');
const json_encoding = require("./../../utils/response-encoding");

const numCheck = (numberString, minLength, maxLength) =>
{
    if(isNaN(numberString))
        return false;
    if(numberString.length<minLength || numberString.length>maxLength)
        return false;
    return true;
}

const expiryCheck = (dateStr) =>
{
    if(!/\d\d-\d\d/.test(dateStr))
        return false;
    const month = parseInt(dateStr.split('-')[0])
    const year = parseInt(dateStr.split('-')[1])
    if(month<1 || month >12)
        return false;
    const current = new Date();
    const currmonth = current.getMonth() + 1;
    const currYear = current.getFullYear() % 100;
    if(year<currYear){
        console.log("Expired Card 1"); return false;}
    else if(year==currYear && month<currmonth){
        console.log("Expired Card 2"); return false;}
    else if(year==currYear+5 && month>currmonth){
        console.log("Expired Card 3"); return false;}
    else if(year>currYear+5){
        console.log("Expired Card 4"); return false;}
    return true;
}

const nbValidationRules = () => {
    return [
        body('txnAmount').trim().isFloat({min: 0.0}),
        body('custMobile').trim().isMobilePhone(),
        body('txnRefId').trim().not().isEmpty().isNumeric({no_symbols: true}),
        body('txnDate').trim().not().isEmpty(),
        body('custName').trim().not().isEmpty(),
        body('custMobile').trim().isMobilePhone(),
    ];
}

const nbValidation = (req, res, next) => {
    const errors = validationResult(req);

    const transactionID = uuid();
    req.body['BID'] = transactionID;
    const transactionInfo = req.body;
    logger.log('info', JSON.stringify(transactionInfo));

    TranscationServices.setRequestJSON(transactionID, transactionInfo);
    const base_64_request_string = Buffer.from(JSON.stringify(transactionInfo)).toString('base64');

    client.set(transactionID, base_64_request_string, (error, reply) => {
        logger.log('info', reply);
    });

    var errors2 = false;
    const mode = Buffer.from(req.body['mode'], 'base64').toString('ascii');
    const sampleRequestPath = path.join(ROOT_DIR, "db", mode+"_request.json");
    const sampleRequestJSON = JSON.parse(fs.readFileSync(sampleRequestPath));
    const Reqkeys = Object.keys(sampleRequestJSON);
    for(let i=0; i<Reqkeys.length; i++) {
        var key = Reqkeys[i]
        if(!req.body.hasOwnProperty(key))
        {
            console.log(key + ' Absent')
            errors2 = true;
            break;
        }
        else if(sampleRequestJSON[key] && sampleRequestJSON[key].length!=0)
        {
            const val = new String(req.body[key])
            if(val.trim().localeCompare(sampleRequestJSON[key]))
            {
                console.log(key + ' Wrong')
                errors2 = true;
                break;
            }
        }
        if(!mode.localeCompare('CC'))
        {
            if(!key.localeCompare('cardNumber') && !numCheck(req.body[key], 13, 19))
            {
                console.log('Credit card number entered wrong');
                errors2 = true;
                break;
            }
            if(!key.localeCompare('cvv') && !numCheck(req.body[key], 3, 4))
            {
                console.log('CVV entered wrong');
                errors2 = true;
                break;
            }
            if(!key.localeCompare('expiryMonth') && !expiryCheck(req.body[key] + '-' + req.body['expiryYear']))
            {
                console.log('Invalid Expiry Date');
                errors2 = true;
                break;
            }
        }
    }
    
    if(errors.isEmpty() && !errors2) {
        return next();
    }
    
    /*
    const transactionID = TranscationServices.generateTransactionID();
    TranscationServices.setRequestJSON(transactionID, req.body);
    const responseFailureJSON = UpdateResponse.populateResponse(req.body, mode, 'failure');
    
    const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);
    return res.redirect(303, responseFailureJSON['RU']+"?data="+encodedJSON);
    const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
    TranscationServices.setFailedResponseJSON(transactionID, responseFailureJSON);
    */
    
    const responseFailureJSON = req.body;
    //responseFailureJSON['BID'] = transactionID;
    responseFailureJSON['status'] = '001';
    responseFailureJSON['errorDesc'] = 'invalid input';
    const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);

    logger.log('info', JSON.stringify(responseFailureJSON));
    return res.redirect(303, responseFailureJSON['RU']+"?data="+encodedJSON);
}

module.exports = {
    nbValidationRules,
    nbValidation,
}