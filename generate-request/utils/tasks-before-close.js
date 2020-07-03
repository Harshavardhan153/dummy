const transactions = require("./../services/transaction");

process.on("SIGINT", () => {
    transactions.saveTranscations();
    process.exit();
})