const express = require('express');
const app = express();
const netbanking = require('./payment_method/netbanking');
const path = require('path');
const public = '../public';
const hbs = require('hbs');

app.use(express.json());
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.get('/', (req, res) => {
    res.render('checkout.html');
});

app.use('/api/transaction/netbanking',netbanking);

app.get('/api/transaction',(req,res) => {
    console.log('transaction homepage');
    res.send("hello");
});

app.listen(3000, () => {
    console.log('listening on 3000');
});
