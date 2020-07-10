const cardNumCheck = (numberString) =>
{
    if(isNaN(numberString))
        return false;
    if(numberString.length<13 || numberString.length>19)
        return false;
    return true;
}

const CvvCheck = (numberString) =>
{
    if(isNaN(numberString))
        return false;
    if(numberString.length<3 || numberString.length>4)
        return false;
    return true;
}

const EMICheck = (str, amount) =>
{
    const str2 = str.toLowerCase()
    if(!str2.localeCompare('true') && parseFloat(amount)>=1000.00)
        return true;
    else if(!str2.localeCompare('false'))
        return true;
    return false;
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
    const currYear = current.getFullYear();
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

const OTPcheck = (numberString) =>
{
    if(isNaN(numberString))
        return false;
    if(numberString.length!=6)
        return false;
    return true;
}

module.exports = {
    expiryCheck : expiryCheck,
    cardNumCheck : cardNumCheck,
    CvvCheck : CvvCheck,
    EMICheck : EMICheck,
    OTPcheck : OTPcheck
}