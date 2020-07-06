const fs = require("fs");
const path = require("path");
const { ROOT_DIR } = require("./path");


function generateFilePath(mode, type) {
    const fileName = mode + "_response_" + type + ".json";

    const sampleResponseJSONPath = path.join(ROOT_DIR, "db", fileName);
    
    return sampleResponseJSONPath;
}

exports.populateResponse = (transactionInfo, mode, type) => {
    const sampleResponseJSONPath = generateFilePath(mode, type);
    
    const responseJSON = {};

    const sampleResponseJSON = JSON.parse(fs.readFileSync(sampleResponseJSONPath));
    const keys = Object.keys(sampleResponseJSON);

    for(let i=0; i<keys.length; i++) {
        responseJSON[keys[i]] = transactionInfo[keys[i]];
    }

    if(type === 'success') {
        responseJSON['status'] = "000";
    }
    else {
        responseJSON['status'] = "001";
        responseJSON['errorDesc'] = "User cancelled the transcation";
    }

    return responseJSON;
}

