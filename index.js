import config from "./config/config.js";
import indexRouter from './routes/serviceRouter.js';
import emailRouter from './routes/emailRouter.js';
import express, { json } from "express";
import { init as dbInit } from './db/conn.js';
import cors from "cors";
const app = express();

app.use(json());
app.use(cors(config.corsOptions));
app.use("/mail", emailRouter);
app.use('/',indexRouter)

dbInit()
app.listen(config.server.port, config.server.host, () => {
  console.log(`Example app listening at http://${config.server.host}:${config.server.port}`);
});
