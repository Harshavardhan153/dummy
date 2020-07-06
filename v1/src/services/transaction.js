const {v4: uuid} = require("uuid");
const JSONModel = require("./../models/json");

const request = 'request';
const successResponse = 'success_response';
const failedResponse = 'failed_response';

exports.generateTransactionID = () => {
    const transcationId = uuid();
    return transcationId;
}

exports.getRequestJSON = (transcationId) => {
    return JSONModel.fetchProtocolJSON(transcationId, request);
}

exports.setRequestJSON = (transcationId, transcationInfo) => {
    JSONModel.saveProtocolJSON(transcationId, request, transcationInfo);
}

exports.getFailedResponseJSON = (transcationId) => {
    
    const savedJSON =  JSONModel.fetchProtocolJSON(transcationId, failedResponse);
    JSONModel.deleteProtocolJSON(transcationId, failedResponse);

    return savedJSON;
}

exports.setFailedResponseJSON = (transcationId, transcationInfo) => {
    JSONModel.saveProtocolJSON(transcationId, failedResponse, transcationInfo);
}

exports.getSuccessResponseJSON = (transcationId) => {
    return JSONModel.fetchProtocolJSON(transcationId, successResponse);
}

exports.setSuccessResponseJSON = (transcationId, transcationInfo) => {
    JSONModel.deleteProtocolJSON(transcationId, failedResponse);

    JSONModel.saveProtocolJSON(transcationId, successResponse, transcationInfo);
}

