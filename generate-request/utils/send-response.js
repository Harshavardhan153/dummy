const rp = require("request-promise");

exports.sendResponse = (responseJSON) => {
    const option = {
        method: "POST",
        uri: responseJSON["RU"],
        body: responseJSON,
        json: true
    }

    return rp(option);
}