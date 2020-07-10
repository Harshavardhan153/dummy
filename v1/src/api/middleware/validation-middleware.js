const {body, validationResult} = require("express-validator");
const TranscationServices = require("./../../services/transaction");
const UpdateResponse = require("./../../utils/updateResponse");
const {v4:uuid} = require('uuid');
const Rules = require('./validation-rules');
const querystring = require("querystring");

const client = require('../../redis/redis');
const logger = require('../../logger/logger');

const path = require("path");
const { ROOT_DIR } = require("../../utils/path");
const fs = require('fs');
const json_encoding = require("./../../utils/response-encoding");

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
        if(!mode.localeCompare('CC') || !mode.localeCompare('DC'))
        {
            if(!key.localeCompare('cardNumber') && !Rules.cardNumCheck(req.body[key]))
            {
                console.log('Credit card number entered wrong');
                errors2 = true;
                break;
            }
            else if(!key.localeCompare('cvv') && !Rules.CvvCheck(req.body[key]))
            {
                console.log('CVV entered wrong');
                errors2 = true;
                break;
            }
            else if(!key.localeCompare('expiryMonth') && !Rules.expiryCheck(req.body[key] + '-' + req.body['expiryYear']))
            {
                console.log('Invalid Expiry Date');
                errors2 = true;
                break;
            }
            else if(!mode.localeCompare('CC') && !key.localeCompare('isEMI') && !Rules.EMICheck(req.body[key], req.body['txnAmount']))
            {
                console.log('Invalid EMI Status');
                errors2 = true;
                break;
            }
        }
    }

    const transactionID = uuid();
    req.body['BID'] = transactionID;
    const transactionInfo = req.body;
    logger.log('info', JSON.stringify(transactionInfo));

    TranscationServices.setRequestJSON(transactionID, transactionInfo);
    const base_64_request_string = Buffer.from(JSON.stringify(transactionInfo)).toString('base64');

    client.set(transactionID, base_64_request_string, (error, reply) => {
        logger.log('info', reply);
    });


    if(errors.isEmpty() && !errors2) {
        return next();
    }
        
    const responseFailureJSON = req.body;

    responseFailureJSON['status'] = '001';
    responseFailureJSON['errorDesc'] = 'invalid input';
    const encodedJSON = json_encoding.encodeJSON(responseFailureJSON);

    logger.log('info', JSON.stringify(responseFailureJSON));
    return res.redirect(303, responseFailureJSON['RU']+"?"+encodedJSON);
}

module.exports = {
    nbValidationRules,
    nbValidation,
}