var express = require('express');
var router = express.Router();
const redis = require('redis');
const client = redis.createClient(6379);
const path = require('path');
const authenticate = require('../middleware/nb_authenticate.js');
const uuid = require('uuid-random');
const logger = require('../../config/logger.js');

client.on('connect', () => {
    logger.log('info','connected to Redis-server');
});

router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(authenticate);

router.post('/',(req,res) => {
    logger.log('info',JSON.stringify(req.body));
    
    const BID = uuid();
    const response = req.body;
    response['BID'] = BID;
    response['status'] = '000';
    client.hmset(BID, response, (error, reply) => {
        logger.log('info',reply);
    });

    res.redirect('netbanking/intermediate?id='+BID);
});

router.get('/intermediate', (req,res) => {
    res.render('intermediate.html');
});

router.post('/final', (req,res) => {
    logger.log('info',JSON.stringify(req.body));

    let bid = req.query.id;

    client.exists(bid, (error,reply) => {
        logger.log('info',reply);
    });
    let response = {};

    client.hgetall(bid, (error,object) => {
        response = JSON.parse(JSON.stringify(object));
        response['BID'] = req.query.id;

        if(error){
            logger.log('error',error);
            response.status = '001';
            response['errorDesc'] = 'unknown error';
            res.send(response);
            return;
        }
        logger.log('info',JSON.stringify(object));

        if(req.body.right){
            logger.log('info','success');
            res.send(JSON.stringify(response));
        }else{
            logger.log('info','failure');
            response.status = '001';
            response['errorDesc'] = 'user declined';
            res.send(JSON.stringify(response));
        }
        return;
    });

});


module.exports = router;