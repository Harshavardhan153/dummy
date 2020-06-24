const { default: fetch } = require("node-fetch");

fetch('/api/transaction/netbanking', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        merchantName : "PAYU",
        merchantCode:"SlEscuJA98",
        txnAmount:10.00,
        txnCurrency:"INR",
        txnDate:"2020-06-15",
        custName:"rahul raman",
        custMobile:"9899075461",
        mode:"bmV0X2Jhbmtpbmc=",
        source:null,
        txnRefId:"87456656834",
        livemode:false,
        txnDescription:"test dummy payment"
    })
});