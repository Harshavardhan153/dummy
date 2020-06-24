const {check, validationResult} = require('express-validator');
const express = require('express');
const router = express.Router();

router.get('/',[
    check('email').isEmail(),
    check('password').isLength({min:8})
],(req,res,next) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.send(errors);
   }
   console.log('validated');
   next();
})

module.exports = router;