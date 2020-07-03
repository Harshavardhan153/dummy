const path = require("path");
const { ROOT_DIR } = require("./utils/path");

const express = require("express");
const IndexRouter = require("./api/index-router");
const logger = require('./logger/logger');
const config = require('config');

const bodyParser = require("body-parser");

const app = express();

// will go to env file...
const PORT = config.get('app.port');

//app
app.set('view engine', 'ejs');
//console.log(path.join(ROOT_DIR, "views"));
app.set("views", path.join(ROOT_DIR, "views"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(ROOT_DIR, "public")));


app.use("/", IndexRouter);

app.listen(PORT , (error) => {
    if(error) {
        logger.log('error', error);
    }
    logger.log('info',`server is running at Port: ${PORT}`);
})