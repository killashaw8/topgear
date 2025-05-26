import express from "express";
import path from "path";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./libs/config";
import router from "./router";

// Entrance
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

// Routers
app.use("/", router);




export default app;