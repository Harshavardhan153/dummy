const path = require("path");
const { ROOT_DIR } = require("./utils/path");

const express = require("express");
const bodyParser = require("body-parser");
const IndexRouter = require("./api/index-router");

const app = express();

// will go to env file...
const PORT = process.env.PORT || 5000;

// app
app.set('view engine', 'ejs');
console.log(path.join(ROOT_DIR, "views"));
app.set("views", path.join(ROOT_DIR, "views"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(ROOT_DIR, "public")));
// app.use(express.static(path.join(ROOT_DIR, "..", "node_modules", "jquery-serializejson")));

app.use("/", IndexRouter);

app.listen(PORT , (error) => {
    if(error) {
        console.log(error);
    }
    console.log("server is running at Port: ", PORT);
})