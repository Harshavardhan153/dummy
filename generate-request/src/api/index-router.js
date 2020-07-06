const path = require("path");
const fs = require("fs");
const { ROOT_DIR } = require("../utils/path");
const express = require("express");

const PanelRouter = require("./panel-router");


const router = express.Router();

router.use("/panel", PanelRouter)

router.use("/", (req, res) => {
    if(JSON.stringify(req.body) === "{}") {
        var sampleRequest;

        if(req.query.id) {
            sampleRequest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "db", "sampleList.json")))[req.query.id];
        }
        else {
            sampleRequest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "db", "sampleList.json")))[0];
        }
        
        return res.status(200).render('index1', {
            sampleRequest: sampleRequest
        });
    }
    
    return res.send("404 PAGE NOT FOUND");
});


module.exports = router;