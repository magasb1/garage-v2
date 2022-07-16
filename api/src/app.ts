import { AppDataSource } from "./data-source";
import express, { Express } from "express";
import cookieParser from "cookie-parser";
import config from "../config";
import apiRoutes from "./routes/api";
import passport from "./passport";
import morgan from "morgan";

const app: Express = express();

app.use(cookieParser());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/api", apiRoutes);

// start express server
AppDataSource.initialize()
  .then(() => {
    app.listen(config.PORT, config.INTERFACE, () => {
      console.log(
        `Server is running at http://${config.INTERFACE}:${config.PORT}`
      );
    });
  })
  .catch((error) => console.log(error));
