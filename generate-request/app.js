// require("./utils/tasks-before-close");
const path = require("path");
const { ROOT_DIR } = require("./utils/path");

const express = require("express");
// const IndexRouter = require("./api/index-router");
const bodyParser = require("body-parser");

const app = express();

// will go to env file...
const PORT = process.env.PORT || 5000;

//app
// app.set('view engine', 'hbs');
// console.log(path.join(ROOT_DIR, "views"));
// app.set("views", path.join(ROOT_DIR, "views"));


console.log(path.join(ROOT_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(ROOT_DIR, "public")));
// app.use(express.static(path.join(ROOT_DIR, "..", "node_modules", "jquery-serializejson")));


// app.use("/", IndexRouter);

app.use("/", (req, res) => {
    return res.sendFile(path.join(ROOT_DIR, 'public', 'index2.html'));
})

app.listen(PORT , (error) => {
    if(error) {
        console.log(error);
    }
    console.log("server is running at Port: ", PORT);
})