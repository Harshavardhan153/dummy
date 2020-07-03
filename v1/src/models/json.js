const fs = require("fs");
const path = require("path");
const { ROOT_DIR } = require("../utils/path");


function generateFilePath(transactionId, protocol) {
    const fileName = transactionId + "_" + protocol + ".json";
    const protocolFilePath = path.join(ROOT_DIR, "public", "request", fileName);

    return protocolFilePath;
}

 
exports.fetchProtocolJSON = (transactionId, protocol) => {
    const protocolFilePath = generateFilePath(transactionId, protocol);

    if(fs.existsSync(protocolFilePath)) {
        return JSON.parse(fs.readFileSync(protocolFilePath));
    }

    return {}
}

exports.saveProtocolJSON = (transactionId, protocol, protocolJSON) => {
    const protocolFilePath = generateFilePath(transactionId, protocol);

    const protocolJSONString = JSON.stringify(protocolJSON);
    fs.writeFileSync(protocolFilePath, protocolJSONString);
}

exports.deleteProtocolJSON = (transactionId, protocol) => {
    const protocolFilePath = generateFilePath(transactionId, protocol);

    if(fs.existsSync(protocolFilePath)) {
        fs.unlinkSync(protocolFilePath);
    }
}