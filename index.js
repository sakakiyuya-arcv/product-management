const express = require ('express');
const database = require("./config/database");
const methodOverride = require("method-override");
require("dotenv").config();
const route = require("./routes/client/index-route")
const routeAdmin = require("./routes/admin/index-route")
const systemConfig = require("./config/system");
const boddyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
database.connect();

const app = express();
app.use(methodOverride("_method"));
const port = process.env.PORT;

app.use(boddyParser.urlencoded({ extended: false}));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.locals.prefixAdmin = systemConfig.prefixAdmin
app.use(express.static(`${__dirname}/public`));

//Routes
routeAdmin(app);
route(app);

app.listen(port,() => {
    console.log(`app listening on port ${port}`)
})