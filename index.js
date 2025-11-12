const express = require ('express');
const database = require("./config/database");
const methodOverride = require("method-override");
require("dotenv").config();
const route = require("./routes/client/index-route")
const routeAdmin = require("./routes/admin/index-route")
const systemConfig = require("./config/system");
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
database.connect();

const app = express();
app.use(methodOverride("_method"));
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(cookieParser('secret'));
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 60000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));
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