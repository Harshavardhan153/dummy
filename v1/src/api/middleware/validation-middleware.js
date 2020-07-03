const {check, validationResult} = require("express-validator");
const TranscationServices = require("./../../services/transaction");
const UpdateResponse = require("./../../utils/updateResponse");
const {v4: uuid} = require('uuid');
const client = require('../../redis/redis');
const logger = require('../../logger/logger');
const querystring = require('querystring');

const nbValidationRules = () => {
    
        
        return [
            check('merchantName').trim().equals("PAYU"),
            check('merchantCode').trim().equals("SlEscuJA98"),
            check('txnAmount').trim().isFloat({min: 0.0}),
            check('txnDate').trim().not().isEmpty(),
            check('custName').trim().not().isEmpty(),
            check('custMobile').trim().isMobilePhone(),
            check('txnRefId').trim().not().isEmpty().isNumeric({no_symbols: true}),
            check('credit_card_number').isLength({min: 13,max: 19}),
            check('expiry_date').not().isEmpty(),
            check('cvv').isInt({min: 100, max: 9999})
        ];    
}

const nbValidation = (req, res, next) => {
    const errors = validationResult(req);

    const transactionID = uuid();
    console.log(transactionID);
    
    req.body['BID'] = transactionID;
    const transactionInfo = req.body;
    logger.log('info', JSON.stringify(transactionInfo));

    TranscationServices.setRequestJSON(transactionID, transactionInfo);
    
    client.hmset(transactionID, req.body, (error, reply) => {
        logger.log('info', reply);
    });

    if(errors.isEmpty()) {
        logger.log('info', 'input validated');
        return next();
    }
    logger.log('error', errors);
    /*
    const transactionID = TranscationServices.generateTransactionID();
    TranscationServices.setRequestJSON(transactionID, req.body);
    
    const responseFailureJSON = UpdateResponse.populateResponse(transactionInfo, mode, failure);
    TranscationServices.setFailedResponseJSON(transactionID, responseFailureJSON);
    */
    
    const responseFailureJSON = req.body;
    //responseFailureJSON['BID'] = transactionID;
    responseFailureJSON['status'] = '001';
    responseFailureJSON['errorDesc'] = 'invalid input';

    logger.log('info', JSON.stringify(responseFailureJSON));
    return res.redirect(303, req.body['RU']+"?"+querystring.stringify(responseFailureJSON));
}

module.exports = {
    nbValidationRules,
    nbValidation,
}