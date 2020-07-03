const fs = require("fs");
const { ROOT_DIR } = require("./path");
const path = require("path");

module.exports = () => {
    const requestPath = path.join(ROOT_DIR, "db", "request.txt");
    const responseSuccessPath = path.join(ROOT_DIR, "db", "response_success.txt");
    const responseFailurePath = path.join(ROOT_DIR, "db", "response_failure.txt");
    
    var requestJSON = {};
    var responseSuccessJSON = {};
    var responseFailureJSON = {};

    if(fs.existsSync(requestPath)) {
        requestJSON = JSON.parse(fs.readFileSync(requestPath));
    };
    if(fs.existsSync(responseSuccessPath)) {
        responseSuccessJSON = JSON.parse(fs.readFileSync(responseSuccessPath));
    };
    if(fs.existsSync(responseFailurePath)) {
        responseFailureJSON = JSON.parse(fs.readFileSync(responseFailurePath));
    };
    

    return [requestJSON, responseSuccessJSON, responseFailureJSON];
}