// bài 25 1:38:22

const express = require("express");
const multer = require("multer");
const path = require('path');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// cú pháp thư viện Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// Tinymce
app.use(
    '/tinymce', 
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End Tinymce

// App locals Variables 
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

// Route
routeAdmin(app);    
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});