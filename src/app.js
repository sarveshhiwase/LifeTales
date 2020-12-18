const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const path = require("path");

//Load Config
dotenv.config({ path: "./config/config.env" });

//Passport config
require("./passport/passport")(passport);

require("./database/dbconnect");

const cl = console.log;
const port = process.env.PORT || 3000;

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//HandleBars Helper
const {
  formatDate,
  stripTags,
  editIcon,
  select,
  truncate,
} = require("./helpers/hbs");

//Handle Bars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, editIcon, select, truncate },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

//Sessions
app.use(
  session({
    secret: "Narutowastheone",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Global Variables
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

//Static
app.use(express.static("public"));

app.listen(port, () => {
  cl(`Server Running on ${port} in ${process.env.NODE_ENV}`);
});
