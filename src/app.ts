import cors from "cors"
import express from "express";
import path from "path";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import router from "./router";
import routerAdmin from "./router-admin";
import ConnectMongoDBSession from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions"
})

const rootDir = process.cwd();
const isProd = process.env.NODE_ENV === "production";
const viewsDir = isProd ? path.join(rootDir, "src", "views") : path.join(__dirname, "views");
const publicDir = isProd ? path.join(rootDir, "src", "public") : path.join(__dirname, "public");

// Entrance
const app = express();
app.use(express.static(publicDir));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
    cors({
      origin: true,
      credentials: true
    })
);
app.use(cookieParser());
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
app.set("views", viewsDir);
app.set("view engine", "ejs");

// Routers
app.use("/admin", routerAdmin);   //SSR => EJS
app.use("/", router);             //SPA => React

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: true,
    credentials: true
  },
  // Allow older Socket.IO / Engine.IO clients to connect without transport errors.
  allowEIO3: true
}); 

io.engine.on("connection_error", (err) => {
  console.log("\x1b[31m%s\x1b[0m", "Socket connection error", {
    code: err.code,
    message: err.message,
    context: err.context,
  });
});

io.on("connection", (socket) => {
  const count = io.of("/").sockets.size;
  const transport = socket.conn.transport.name;
  const protocol = socket.conn.protocol;
  const origin = socket.handshake.headers.origin ?? "n/a";
  const ua = socket.handshake.headers["user-agent"] ?? "n/a";
  console.log(
    "\x1b[32m%s\x1b[0m",
    `Connection & total [${count}] transport=${transport} protocol=EIO${protocol} origin=${origin}`
  );
  console.log("\x1b[36m%s\x1b[0m", `Socket client UA: ${ua}`);

  socket.on("disconnect", (reason) => {
    const nextCount = io.of("/").sockets.size;
    console.log(
      "\x1b[33m%s\x1b[0m",
      `Disconnection & total [${nextCount}] reason=${reason}`
    );
  });
});

export default server;
