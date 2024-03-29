import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from "./routes/routes.js";
import cors from "cors";

//import adminRoutes from './routes/adminRoutes.js'
const app = express();

//cors
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

//This converts request body to json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cookie parser(if not used,cookies will be undefined)
app.use(cookieParser());

//body parser(To view in postman)
app.use(bodyParser.json());

app.use("/", routes);

export default app;
