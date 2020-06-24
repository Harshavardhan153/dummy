const express = require('express');
const router = express.Router();
const {check, validationResult } = require('express-validator');
const uuid = require('uuid-random');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/', [
    check('merchantName').not().isEmpty(),
    check('merchantCode').not().isEmpty(),
    check('txnAmount').custom((value,{req}) => value > 0),
    check('txnCurrency').isIn(['INR','EU','USD']),
    check('txnDate').not().isEmpty(),
    check('custName').not().isEmpty(),
    check('custMobile').isMobilePhone()
], (req,res,next) => {
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        const error_response = req.body;

        const BID = uuid();

        error_response['BID'] = BID;
        error_response['status'] = '001';
        error_response['errorDesc'] = 'invalid request';

        return res.status(422).send(JSON.stringify(error_response));
    }
    console.log('input authenticated');
    next();
})

module.exports = router;