import express from "express";
import path from "path";
import morgan from "morgan";
import session from "express-session";
import { MORGAN_FORMAT } from "./libs/config";
import router from "./router";
import routerAdmin from "./router-admin";
import ConnectMongoDBSession from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions"
})

// Entrance
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

// Sessions
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 60 * 60 * 5         //5 hours
    }, 
    store: store,                        //DB collection
    resave: true,
    saveUninitialized: true
  })
);

app.use(
  function(req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
  }
)

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routers
app.use("/admin", routerAdmin);   //SSR => EJS
app.use("/", router);             //SPA => React




export default app;