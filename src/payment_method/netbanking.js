var express = require('express');
var router = express.Router();
const redis = require('redis');
const client = redis.createClient(6379);
const path = require('path');
const authenticate = require('../middleware/nb_authenticate.js');
const uuid = require('uuid-random');

client.on('connect', () => {
    console.log('connected to Redis-server');
});

router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(authenticate);

router.post('/',(req,res) => {
    console.log(req.body);
    
    const BID = uuid();
    const response = req.body;
    response['BID'] = BID;
    response['status'] = '000';
    client.hmset(BID, response, (error, reply) => {
        console.log(reply);
    });

    res.redirect('netbanking/intermediate?id='+BID);
});

router.get('/intermediate', (req,res) => {
    res.render('intermediate.html');
});

// router.get('/logs', (req,res) => {
//     client.get()
// })

router.post('/final', (req,res) => {
    console.log(req.body);

    let bid = req.query.id;

    client.exists(bid, (error,reply) => {
        console.log(reply);
    });
    let response = {};

    client.hgetall(bid, (error,object) => {
        response = JSON.parse(JSON.stringify(object));
        response['BID'] = req.query.id;

        if(error){
            console.error(error);
            response.status = '001';
            response['errorDesc'] = 'unknown error';
            res.send(response);
            return;
        }
        console.log(object);

        if(req.body.right){
            console.log('success');
            res.send(JSON.stringify(response));
        }else{
            console.log('failure');
            response.status = '001';
            response['errorDesc'] = 'user declined';
            res.send(JSON.stringify(response));
        }
        return;
    });

});


module.exports = router;