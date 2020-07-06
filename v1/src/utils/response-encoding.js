const json_encode = require("json_encode");

exports.encodeJSON = (jsonObject) => {
    const encode = json_encode(jsonObject);
    const base64Encode = Buffer.from(encode, 'utf-8').toString('base64');
    
    return base64Encode;
}