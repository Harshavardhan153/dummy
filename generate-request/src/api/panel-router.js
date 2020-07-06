const fs = require("fs");
const { ROOT_DIR } = require("../utils/path");
const path = require("path");

const express = require("express");
const router = express.Router();


router.get("/samples", (req, res) => {
    const sampleRequests = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "db", "sampleList.json")));

    return res.status(200).render('sample-requests', {
        sampleRequests: sampleRequests
    });
});

router.get("/:id", (req, res) => {
    const sampleRequest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "db", "sampleList.json")))[req.params.id];

    return res.status(200).render('panel', {
        sampleRequest: sampleRequest
    });
});


router.post("/save-request", (req, res) => {
    const sampleRequests = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "db", "sampleList.json")));
    sampleRequests.push(req.body);
    fs.writeFileSync(path.join(ROOT_DIR, "db", "sampleList.json"), JSON.stringify(sampleRequests, null, "\t"));

    return res.status(200).send("<pre style='font-size: 16px; line-height: 2'>" + JSON.stringify(req.body, null, 4) + "<pre>");
});

module.exports = router;